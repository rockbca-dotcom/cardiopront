"use client";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ConsultasPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Consultas</h1>
          <p className="text-surface-600 mt-1">Histórico de consultas</p>
        </div>
        <Link href="/app/consultas/nova" className="btn-primary">
          <Plus className="w-4 h-4" /> Nova consulta
        </Link>
      </div>
      <div className="card text-center py-12">
        <p className="text-surface-500">Nenhuma consulta registrada ainda.</p>
        <Link href="/app/consultas/nova" className="btn-primary mt-4 inline-flex">
          Iniciar primeira consulta
        </Link>
      </div>
    </div>
  );
}
