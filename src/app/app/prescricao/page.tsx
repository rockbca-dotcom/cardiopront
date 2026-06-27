"use client";

import { useEffect, useState } from "react";
import { Plus, Pill, Calendar, User, Printer } from "lucide-react";
import Link from "next/link";
import PrintPrescription from "@/components/prescricao/PrintPrescription";

interface Prescricao {
  id: string;
  data_prescricao: string;
  medicamento: string;
  principio_ativo: string | null;
  dose: string | null;
  unidade: string | null;
  frequencia: string | null;
  via: string | null;
  posologia: string | null;
  advertencias: string | null;
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

  // Group prescriptions by date + patient (simple grouping)
  const grouped = prescricoes.reduce((acc, p) => {
    const key = `${p.id.slice(0, 8)}-${p.paciente_nome}`;
    if (!acc[key]) acc[key] = { id: p.id, paciente: p.paciente_nome, date: p.data_prescricao, items: [] };
    acc[key].items.push(p);
    return acc;
  }, {} as Record<string, { id: string; paciente: string; date: string; items: Prescricao[] }>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Prescricoes</h1>
          <p className="text-surface-600 mt-1">{prescricoes.length} medicamentos prescritos</p>
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
        <div className="space-y-4">
          {Object.values(grouped).map((group) => (
            <div key={group.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary-500" />
                    <p className="font-medium text-surface-900">{group.paciente}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(group.date).toLocaleDateString("pt-BR")}</span>
                    <span>{group.items.length} medicamento(s)</span>
                  </div>
                </div>
                <PrintPrescription
                  prescriptionId={group.id}
                  patientNome={group.paciente}
                  items={group.items.map((p) => ({
                    medicamento: p.medicamento,
                    principio_ativo: p.principio_ativo || p.medicamento,
                    dose: p.dose,
                    unidade: p.unidade,
                    frequencia: p.frequencia,
                    via: p.via,
                    posologia: p.posologia,
                    advertencias: p.advertencias,
                  }))}
                />
              </div>
              <div className="space-y-2">
                {group.items.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 bg-surface-50 rounded text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900">{p.medicamento}</p>
                      <div className="flex items-center gap-3 text-xs text-surface-500">
                        {p.dose && <span>{p.dose} {p.unidade || "mg"}</span>}
                        {p.frequencia && <span>{p.frequencia}</span>}
                        {p.via && <span>{p.via}</span>}
                      </div>
                      {p.posologia && <p className="text-xs text-surface-500 mt-1 italic">{p.posologia}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
