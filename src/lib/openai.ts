import OpenAI from "openai";

import {
  CONSULTATION_AI_SYSTEM_PROMPT,
  ConsultationAIDraft,
  parseConsultationAIDraft,
} from "./consultation-ai";

let openaiClient: OpenAI | null = null;

function getOpenAIApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada");
  }
  return apiKey;
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: getOpenAIApiKey(),
    });
  }

  return openaiClient;
}

export async function synthesizeConsultation(transcription: string): Promise<ConsultationAIDraft> {
  const cleanTranscription = transcription.trim();
  if (!cleanTranscription) {
    throw new Error("Transcrição vazia");
  }

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: CONSULTATION_AI_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Transcrição da consulta:\n\n${cleanTranscription}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Resposta vazia da IA");
  }

  return parseConsultationAIDraft(content);
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const apiKey = getOpenAIApiKey();

  const blob = new Blob([audioBuffer as BlobPart], { type: "audio/webm" });
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("language", "pt");
  formData.append("response_format", "text");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Transcription failed (${response.status}): ${details || response.statusText}`);
  }

  return response.text();
}
