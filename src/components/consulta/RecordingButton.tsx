"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface RecordingButtonProps {
  onTranscription: (text: string) => void;
  onSynthesis: (synthesis: Record<string, unknown>) => void;
}

export default function RecordingButton({ onTranscription, onSynthesis }: RecordingButtonProps) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setProcessing(true);

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });

        try {
          // Transcription
          const formData = new FormData();
          formData.append("audio", blob, "consulta.webm");

          const transRes = await fetch("/api/ai/transcrever", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });

          const transData = await transRes.json();
          if (transData.transcricao) {
            onTranscription(transData.transcricao);

            // Synthesis
            const synthRes = await fetch("/api/ai/sintetizar", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ transcricao: transData.transcricao }),
            });

            const synthData = await synthRes.json();
            if (synthData.sintese) {
              onSynthesis(synthData.sintese as Record<string, unknown>);
            }
          }
        } catch (error) {
          console.error("Error processing audio:", error);
        } finally {
          setProcessing(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Não foi possível acessar o microfone. Verifique as permissões.");
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
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  if (processing) {
    return (
      <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
        <span className="text-sm text-primary-700">Processando áudio...</span>
      </div>
    );
  }

  return (
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
            ? `Gravando ${formatDuration(duration)} — Clique para parar`
            : "Clique para iniciar gravação da consulta"}
        </p>
        <p className="text-xs text-surface-500 mt-0.5">
          {recording
            ? "A IA transcreverá e sintetizará automaticamente"
            : "A gravação é processada localmente e enviada para transcrição"}
        </p>
      </div>
    </div>
  );
}
