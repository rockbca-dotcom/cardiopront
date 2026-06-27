"use client";
import { useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

export default function NovaConsultaPage() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Nova consulta</h1>
      
      <div className="card mb-6">
        <h2 className="font-semibold text-surface-900 mb-4">Gravação por voz</h2>
        <p className="text-sm text-surface-600 mb-4">
          Grave a consulta e a IA transcreve e sintetiza automaticamente.
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRecording(!recording)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              recording 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-primary-100 text-primary-600 hover:bg-primary-200"
            }`}
          >
            {recording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <div>
            <p className="text-sm font-medium text-surface-900">
              {recording ? "Gravando... Clique para parar" : "Clique para iniciar gravação"}
            </p>
            <p className="text-xs text-surface-500">
              A gravação é processada localmente e enviada para transcrição
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="text-surface-500 text-center py-8">
          Formulário de consulta em desenvolvimento
        </p>
      </div>
    </div>
  );
}
