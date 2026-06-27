"use client";
import { Pill } from "lucide-react";

export default function NovaPrescricaoPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Nova prescrição</h1>
      
      <div className="card">
        <div className="flex items-center gap-3 text-surface-500">
          <Pill className="w-5 h-5" />
          <p>Catálogo com 30+ medicamentos cardiovasculares em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
}
