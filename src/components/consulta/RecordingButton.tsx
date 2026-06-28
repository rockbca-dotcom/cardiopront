"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";

import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import {
  type ConsultationRecordingState,
  uploadConsultationAudio,
} from "@/lib/consultation-media";

interface RecordingButtonProps {
  onTranscription: (text: string) => void;
  onSynthesis: (synthesis: ConsultationAIDraft) => void;
  onAudioUrl?: (audioUrl: string | null) => void;
  onStateChange?: (state: ConsultationRecordingState) => void;
}

export default function RecordingButton({
  onTranscription,
  onSynthesis,
  onAudioUrl,
  onStateChange,
}: RecordingButtonProps) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function startRecording() {
    try {
      setError(null);
      setWarning(null);
      onAudioUrl?.(null);
      onStateChange?.("recording");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecording(false);
        setProcessing(true);
        onStateChange?.("processing");

        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        chunksRef.current = [];

        if (blob.size === 0) {
          setError("Nenhum áudio foi capturado.");
          setProcessing(false);
          onStateChange?.("idle");
          return;
        }

        const audioUploadPromise = uploadConsultationAudio(blob, { mimeType: blob.type })
          .then(({ publicUrl }) => publicUrl)
          .catch((uploadError) => {
            console.error("Error uploading consultation audio:", uploadError);
            setWarning("A consulta foi transcrita, mas o áudio não pôde ser salvo na nuvem.");
            return null;
          });

        try {
          const formData = new FormData();
          formData.append("audio", blob, "consulta.webm");

          const transRes = await fetch("/api/ai/transcrever", {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const transData = await transRes.json().catch(() => ({}));
          if (!transRes.ok) {
            throw new Error(transData.error || "Erro na transcrição");
          }

          if (typeof transData.transcricao !== "string" || !transData.transcricao.trim()) {
            throw new Error("A transcrição retornou vazia");
          }

          onTranscription(transData.transcricao);

          const synthRes = await fetch("/api/ai/sintetizar", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transcricao: transData.transcricao }),
          });

          const synthData = await synthRes.json().catch(() => ({}));
          if (!synthRes.ok) {
            throw new Error(synthData.error || "Erro na síntese");
          }

          if (!synthData.sintese) {
            throw new Error("A síntese da consulta não foi gerada");
          }

          onSynthesis(synthData.sintese as ConsultationAIDraft);
        } catch (processingError) {
          const message = processingError instanceof Error ? processingError.message : "Erro ao processar o áudio";
          setError(message);
          console.error("Error processing audio:", processingError);
        } finally {
          const audioUrl = await audioUploadPromise;
          onAudioUrl?.(audioUrl);
          setProcessing(false);
          onStateChange?.("idle");
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((current) => current + 1);
      }, 1000);
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : "Não foi possível acessar o microfone";
      setError(message.includes("permission") ? "Permissão de microfone negada." : "Não foi possível acessar o microfone. Verifique as permissões.");
      setRecording(false);
      setProcessing(false);
      onStateChange?.("idle");
      console.error("Error starting recording:", startError);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (processing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
          <span className="text-sm text-primary-700">Transcrevendo, sintetizando e salvando o áudio...</span>
        </div>
        {warning && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            {warning}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
            recording
              ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
              : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {recording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        <div>
          <p className="text-sm font-medium text-surface-900">
            {recording
              ? `Gravando ${formatDuration(duration)} — clique para parar`
              : "Clique para iniciar gravação da consulta"}
          </p>
          <p className="text-xs text-surface-500 mt-0.5">
            {recording
              ? "A transcrição e o upload do áudio serão feitos automaticamente"
              : "A gravação é processada com a sessão autenticada do usuário"}
          </p>
        </div>
      </div>

      {warning && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {warning}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
