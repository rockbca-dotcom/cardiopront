"use client";

import { useEffect, useState } from "react";
import { Calendar, Pill, User } from "lucide-react";
import Link from "next/link";

import PrintPrescription from "@/components/prescricao/PrintPrescription";

interface Prescricao {
  id: string;
  consulta_id: string;
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

interface PrescriptionGroup {
  consultaId: string;
  paciente: string;
  date: string;
  items: Prescricao[];
}

export default function PrescricoesPage() {
  const [prescricoes, setPrescricoes] = useState<Prescricao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchPrescricoes();
  }, []);

  async function fetchPrescricoes() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/prescricao", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPrescricoes(data.prescricoes || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const grouped = prescricoes.reduce((acc, item) => {
    const key = item.consulta_id;
    if (!acc[key]) {
      acc[key] = {
        consultaId: item.consulta_id,
        paciente: item.paciente_nome || "Paciente não informado",
        date: item.data_prescricao,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, PrescriptionGroup>);

  const groups = Object.values(grouped).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Prescrições</h1>
          <p className="text-surface-600 mt-1">{prescricoes.length} medicamento(s) prescritos</p>
        </div>
        <Link href="/app/prescricao/nova" className="btn-primary">
          <Pill className="w-4 h-4" /> Nova prescrição
        </Link>
      </div>

      {loading ? (
        <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>
      ) : prescricoes.length === 0 ? (
        <div className="card text-center py-12">
          <Pill className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">Nenhuma prescrição criada ainda.</p>
          <Link href="/app/prescricao/nova" className="btn-primary mt-4 inline-flex">Criar primeira prescrição</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.consultaId} className="card space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill className="w-4 h-4 text-primary-500" />
                    <p className="font-medium text-surface-900">{group.paciente}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(group.date).toLocaleDateString("pt-BR")}</span>
                    <span>{group.items.length} medicamento(s)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <PrintPrescription
                    prescriptionId={group.consultaId}
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
                  <Link href={`/app/prescricao/${group.consultaId}`} className="btn-secondary text-sm inline-flex items-center gap-2">
                    <User className="w-4 h-4" /> Detalhes
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                {group.items.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 bg-surface-50 rounded text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900">{p.medicamento}</p>
                      <div className="flex items-center gap-3 text-xs text-surface-500 flex-wrap">
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
