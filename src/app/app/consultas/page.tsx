"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FileText, Plus, Search, Mic, Sparkles, NotebookText } from "lucide-react";
import Link from "next/link";

import type { ConsultationAIDraft } from "@/lib/consultation-ai";

interface ConsultationListItem {
  id: string;
  data_consulta: string;
  tipo: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  diagnostico: string | null;
  audio_url: string | null;
  transcricao_completa: string | null;
  sintese_ia: ConsultationAIDraft | null;
  pacientes?: {
    nome: string;
  } | null;
}

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<ConsultationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  async function fetchConsultations() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/consultas", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar consultas");
      }

      setConsultas(data.consultas || []);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Erro ao carregar consultas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const filteredConsultas = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return consultas;

    return consultas.filter((consulta) => {
      const patientName = consulta.pacientes?.nome || "";
      return [
        patientName,
        consulta.motivo_consulta || "",
        consulta.queixa_principal || "",
        consulta.diagnostico || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [consultas, search]);

  const totalAudio = consultas.filter((consulta) => Boolean(consulta.audio_url)).length;
  const totalSynthesis = consultas.filter((consulta) => Boolean(consulta.sintese_ia)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Consultas</h1>
          <p className="text-surface-600 mt-1">Histórico clínico com áudio, transcrição e síntese revisável.</p>
        </div>
        <Link href="/app/consultas/nova" className="btn-primary self-start md:self-auto">
          <Plus className="w-4 h-4" /> Nova consulta
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MetricCard label="Consultas" value={consultas.length} />
        <MetricCard label="Com áudio" value={totalAudio} />
        <MetricCard label="Com síntese IA" value={totalSynthesis} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input-field pl-10"
          placeholder="Buscar por paciente, motivo, diagnóstico..."
        />
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando consultas...</p>
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 text-center py-12">
          <p className="text-red-700 font-medium">{error}</p>
          <button type="button" onClick={fetchConsultations} className="btn-secondary mt-4 inline-flex">
            Tentar novamente
          </button>
        </div>
      ) : filteredConsultas.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">
            {search ? "Nenhuma consulta corresponde à busca." : "Nenhuma consulta registrada ainda."}
          </p>
          <Link href="/app/consultas/nova" className="btn-primary mt-4 inline-flex">
            Iniciar primeira consulta
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultas.map((consulta) => {
            const patientName = consulta.pacientes?.nome || "Paciente não informado";
            const dateLabel = new Date(consulta.data_consulta).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            const timeLabel = new Date(consulta.data_consulta).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article key={consulta.id} className="card-hover space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-surface-900">{patientName}</h2>
                      <span className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-xs font-medium text-surface-600">
                        {dateLabel} · {timeLabel}
                      </span>
                      <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        {consulta.tipo || "presencial"}
                      </span>
                    </div>

                    <p className="text-sm text-surface-600">
                      {consulta.motivo_consulta || consulta.queixa_principal || consulta.diagnostico || "Consulta sem resumo textual."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {consulta.audio_url && <StatusBadge tone="green" icon={<Mic className="w-3 h-3" />} text="Áudio" />}
                    {consulta.transcricao_completa && <StatusBadge tone="blue" icon={<NotebookText className="w-3 h-3" />} text="Transcrição" />}
                    {consulta.sintese_ia && <StatusBadge tone="violet" icon={<Sparkles className="w-3 h-3" />} text="IA" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <InfoCard title="Motivo" value={consulta.motivo_consulta || "—"} />
                  <InfoCard title="Queixa principal" value={consulta.queixa_principal || "—"} />
                  <InfoCard title="Diagnóstico" value={consulta.diagnostico || "—"} />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface-200">
                  <p className="text-xs text-surface-500">
                    {consulta.audio_url ? "Áudio anexado e salvo na consulta." : "Consulta salva sem áudio anexado."}
                  </p>
                  <Link href={`/app/consultas/${consulta.id}`} className="btn-secondary text-xs">
                    Ver detalhe
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-surface-900">{value}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-3">
      <p className="text-xs uppercase tracking-wide text-surface-500">{title}</p>
      <p className="mt-1 text-sm text-surface-800 whitespace-pre-line leading-6">{value}</p>
    </div>
  );
}

function StatusBadge({ tone, icon, text }: { tone: "green" | "blue" | "violet"; icon: ReactNode; text: string }) {
  const toneClasses =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
        ? "border-sky-200 bg-sky-50 text-sky-700"
        : "border-violet-200 bg-violet-50 text-violet-700";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${toneClasses}`}>
      {icon}
      {text}
    </span>
  );
}
