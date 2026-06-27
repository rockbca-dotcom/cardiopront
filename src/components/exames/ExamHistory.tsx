"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Exame {
  id: string;
  data_pedido: string;
  data_resultado: string | null;
  prioridade: string;
  status: "pendente" | "resultado_enviado" | "lido";
  indicacao_clinica: string | null;
  tipo_exame_nome: string;
  tipo_exame_categoria: string;
  paciente_nome: string;
}

export default function ExamHistory() {
  const [exames, setExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchExams(); }, []);

  async function fetchExams() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/exames", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setExames(data.exames || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  function getStatusBadge(status: string) {
    if (status === "pendente") return <span className="badge-amber"><Clock className="w-3 h-3 mr-1" />Pendente</span>;
    if (status === "resultado_enviado") return <span className="badge-blue"><AlertCircle className="w-3 h-3 mr-1" />Resultado disponível</span>;
    if (status === "lido") return <span className="badge-green"><CheckCircle className="w-3 h-3 mr-1" />Lido</span>;
    return null;
  }

  if (loading) return <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>;
  if (exames.length === 0) return <div className="card text-center py-12"><FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" /><p className="text-surface-500">Nenhum exame pedido ainda.</p></div>;

  return (
    <div className="space-y-3">
      {exames.map((exame) => (
        <div key={exame.id} className="card-hover">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-surface-900 text-sm">{exame.tipo_exame_nome}</p>
                {getStatusBadge(exame.status)}
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-surface-500 flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(exame.data_pedido).toLocaleDateString("pt-BR")}</span>
                <span>Paciente: {exame.paciente_nome}</span>
              </div>
              {exame.indicacao_clinica && <p className="text-xs text-surface-500 mt-1">Indicação: {exame.indicacao_clinica}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
