"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, FileText, AlertCircle, Microscope, User } from "lucide-react";
import Link from "next/link";

interface Exame {
  id: string;
  consulta_id: string;
  data_pedido: string;
  data_resultado: string | null;
  prioridade: string;
  status: "pendente" | "resultado_enviado" | "lido";
  indicacao_clinica: string | null;
  tipo_exame_nome: string;
  tipo_exame_categoria: string;
  paciente_nome: string;
}

interface ExamGroup {
  consultaId: string;
  paciente: string;
  date: string;
  items: Exame[];
}

export default function ExamesPage() {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { void fetchExams(); }, []);

  async function fetchExams() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/exames", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setExames(data.exames || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    if (status === "pendente") return <span className="badge-amber"><Clock className="w-3 h-3 mr-1" />Pendente</span>;
    if (status === "resultado_enviado") return <span className="badge-blue"><AlertCircle className="w-3 h-3 mr-1" />Resultado</span>;
    if (status === "lido") return <span className="badge-green"><CheckCircle className="w-3 h-3 mr-1" />Lido</span>;
    return null;
  }

  const grouped = exames.reduce((acc, exame) => {
    const key = exame.consulta_id;
    if (!acc[key]) {
      acc[key] = {
        consultaId: exame.consulta_id,
        paciente: exame.paciente_nome || "Paciente não informado",
        date: exame.data_pedido,
        items: [],
      };
    }
    acc[key].items.push(exame);
    return acc;
  }, {} as Record<string, ExamGroup>);

  const groups = Object.values(grouped).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Exames</h1>
          <p className="text-surface-600 mt-1">{exames.length} pedido(s)</p>
        </div>
        <Link href="/app/exames/novo" className="btn-primary"><FileText className="w-4 h-4" /> Novo pedido</Link>
      </div>

      {loading ? (
        <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>
      ) : exames.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">Nenhum exame pedido ainda.</p>
          <Link href="/app/exames/novo" className="btn-primary mt-4 inline-flex">Pedir primeiro exame</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.consultaId} className="card space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Microscope className="w-4 h-4 text-primary-500" />
                    <p className="font-medium text-surface-900">{group.paciente}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-surface-500 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(group.date).toLocaleDateString("pt-BR")}</span>
                    <span>{group.items.length} exame(s)</span>
                  </div>
                </div>

                <Link href={`/app/exames/${group.consultaId}`} className="btn-secondary text-sm inline-flex items-center gap-2 self-start">
                  <User className="w-4 h-4" /> Detalhes
                </Link>
              </div>

              <div className="space-y-2">
                {group.items.map((exame) => (
                  <div key={exame.id} className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-surface-900">{exame.tipo_exame_nome}</p>
                        <p className="text-xs text-surface-500 mt-1">{exame.tipo_exame_categoria}</p>
                      </div>
                      {getStatusBadge(exame.status)}
                    </div>
                    {exame.indicacao_clinica && <p className="text-xs text-surface-500 mt-2">Indicação: {exame.indicacao_clinica}</p>}
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
