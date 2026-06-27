"use client";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PrescricoesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Prescrições</h1>
          <p className="text-surface-600 mt-1">Prescrições de medicamentos cardiovasculares</p>
        </div>
        <Link href="/app/prescricao/nova" className="btn-primary">
          <Plus className="w-4 h-4" /> Nova prescrição
        </Link>
      </div>
      <div className="card text-center py-12">
        <p className="text-surface-500">Nenhuma prescrição criada ainda.</p>
        <Link href="/app/prescricao/nova" className="btn-primary mt-4 inline-flex">
          Criar primeira prescrição
        </Link>
      </div>
    </div>
  );
}
