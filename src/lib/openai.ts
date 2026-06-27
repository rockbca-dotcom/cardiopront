import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }
  return openaiClient;
}

const SYNTHESIS_SYSTEM_PROMPT = `Você é um assistente especializado em cardiologia clínica. Sua tarefa é analisar transcrições de consultas cardiológicas e produzir sínteses estruturadas em JSON.

Diretrizes:
- Seja preciso e conciso com terminologia médica
- Identifique achados clínicos relevantes
- Destaque sinais de alerta que requerem atenção
- Use nomenclatura padrão em português brasileiro
- Se algo não foi mencionado na transcrição, use string vazia ou array vazio

Formato de resposta (JSON puro, sem markdown):
{
  "motivo_consulta": "motivo principal da consulta em 1-2 frases",
  "achados_relevantes": ["achado 1", "achado 2"],
  "diagnosticos_suspeitos": ["diagnóstico 1"],
  "exames_pedidos": [{"tipo": "ECG", "indicacao": "avaliação de arritmia"}],
  "conduta": "conduta terapêutica adotada",
  "medicamentos_ajustados": [{"nome": "Enalapril", "dose": "10mg", "acao": "aumento de dose"}],
  "sinais_de_alerta": ["sinal 1", "sinal 2"],
  "orientacoes_paciente": "orientações dadas ao paciente"
}`;

export async function synthesizeConsultation(transcription: string): Promise<string> {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYNTHESIS_SYSTEM_PROMPT },
      { role: "user", content: `Transcrição da consulta:

${transcription}` },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  return response.choices[0]?.message?.content || "{}";
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const openai = getOpenAIClient();
  
  const blob = new Blob([audioBuffer as BlobPart], { type: "audio/webm" });
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("language", "pt");
  formData.append("response_format", "text");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }

  const text = await response.text();
  return text;
}
