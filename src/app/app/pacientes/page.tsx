"use client";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PacientesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Pacientes</h1>
          <p className="text-surface-600 mt-1">Gerencie seus pacientes cardiológicos</p>
        </div>
        <Link href="/app/pacientes/novo" className="btn-primary">
          <Plus className="w-4 h-4" /> Novo paciente
        </Link>
      </div>
      <div className="card text-center py-12">
        <p className="text-surface-500">Nenhum paciente cadastrado ainda.</p>
        <Link href="/app/pacientes/novo" className="btn-primary mt-4 inline-flex">
          Cadastrar primeiro paciente
        </Link>
      </div>
    </div>
  );
}
