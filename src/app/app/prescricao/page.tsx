"use client";

import { useEffect, useState } from "react";
import { Plus, Pill, Calendar, User } from "lucide-react";
import Link from "next/link";

interface Prescricao {
  id: string;
  data_prescricao: string;
  medicamento: string;
  dose: string | null;
  unidade: string | null;
  frequencia: string | null;
  via: string | null;
  posologia: string | null;
  paciente_nome: string;
}

export default function PrescricoesPage() {
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPrescricoes(); }, []);

  async function fetchPrescricoes() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/prescricao", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPrescricoes(data.prescricoes || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Prescricoes</h1>
          <p className="text-surface-600 mt-1">{prescricoes.length} prescricoes</p>
        </div>
        <Link href="/app/prescricao/nova" className="btn-primary"><Plus className="w-4 h-4" />Nova prescricao</Link>
      </div>
      {loading ? (
        <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>
      ) : prescricoes.length === 0 ? (
        <div className="card text-center py-12">
          <Pill className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">Nenhuma prescricao criada ainda.</p>
          <Link href="/app/prescricao/nova" className="btn-primary mt-4 inline-flex">Criar primeira prescricao</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {prescricoes.map((p) => (
            <div key={p.id} className="card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><Pill className="w-4 h-4 text-primary-500 shrink-0" /><p className="font-medium text-surface-900 text-sm">{p.medicamento}</p></div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-surface-500 flex-wrap">
                    {p.dose && <span>{p.dose} {p.unidade || "mg"}</span>}
                    {p.frequencia && <span>{p.frequencia}</span>}
                    {p.via && <span>{p.via}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.data_prescricao).toLocaleDateString("pt-BR")}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.paciente_nome}</span>
                  </div>
                  {p.posologia && <p className="text-xs text-surface-500 mt-2 italic">{p.posologia}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
