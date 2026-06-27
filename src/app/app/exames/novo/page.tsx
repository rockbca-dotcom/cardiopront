"use client";
import { FileText } from "lucide-react";

export default function NovoExamePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Pedido de exame</h1>
      
      <div className="card">
        <div className="flex items-center gap-3 text-surface-500">
          <FileText className="w-5 h-5" />
          <p>Catálogo com 25+ exames cardiológicos em desenvolvimento</p>
        </div>
      </div>
    </div>
  );
}
