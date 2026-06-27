"use client";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ExamesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Exames</h1>
          <p className="text-surface-600 mt-1">Pedidos de exames cardiológicos</p>
        </div>
        <Link href="/app/exames/novo" className="btn-primary">
          <Plus className="w-4 h-4" /> Novo pedido
        </Link>
      </div>
      <div className="card text-center py-12">
        <p className="text-surface-500">Nenhum exame pedido ainda.</p>
        <Link href="/app/exames/novo" className="btn-primary mt-4 inline-flex">
          Pedir primeiro exame
        </Link>
      </div>
    </div>
  );
}
