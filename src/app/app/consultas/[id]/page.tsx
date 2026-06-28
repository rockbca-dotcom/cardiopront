"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CalendarClock, FileText, Mic, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ConsultationFollowUpPanel from "@/components/consulta/ConsultationFollowUpPanel";
import SynthesisPanel from "@/components/consulta/SynthesisPanel";
import type { ConsultationAIDraft } from "@/lib/consultation-ai";

interface ConsultationDetail {
  id: string;
  data_consulta: string;
  tipo: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  historia_doenca_atual: string | null;
  historia_familiar_cardiovascular: string | null;
  pa_sistolica: number | null;
  pa_diastolica: number | null;
  fc: number | null;
  fr: number | null;
  temp_celsius: number | null;
  saturacao_o2: number | null;
  peso_kg: number | null;
  altura_cm: number | null;
  imc: number | null;
  exame_fisico_geral: string | null;
  diagnostico: string | null;
  cid10: string | null;
  conduta: string | null;
  orientacoes: string | null;
  audio_url: string | null;
  transcricao_completa: string | null;
  sintese_ia: ConsultationAIDraft | null;
  pacientes?: {
    id: string;
    nome: string;
    nascimento: string | null;
    sexo: string | null;
    cpf: string | null;
    telefone: string | null;
    email: string | null;
  } | null;
}

export default function ConsultaDetalhePage() {
  const params = useParams<{ id: string }>();
  const consultaId = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [consulta, setConsulta] = useState<ConsultationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!consultaId) return;

    async function fetchConsultation() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/consultas/${consultaId}`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Erro ao carregar consulta");
        }

        setConsulta(data.consulta || null);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Erro ao carregar consulta";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultation();
  }, [consultaId]);

  const dateLabel = consulta ? new Date(consulta.data_consulta).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "";
  const timeLabel = consulta ? new Date(consulta.data_consulta).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Link href="/app/consultas" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar para consultas
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Detalhe da consulta</h1>
          <p className="text-surface-600 mt-1">Áudio, transcrição, síntese e campos clínicos em um só lugar.</p>
        </div>

        {consulta && (
          <Link href="/app/consultas/nova" className="btn-primary">
            <FileText className="w-4 h-4" /> Nova consulta
          </Link>
        )}
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando consulta...</p>
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 text-center py-12">
          <p className="text-red-700 font-medium">{error}</p>
          <Link href="/app/consultas" className="btn-secondary mt-4 inline-flex">
            Voltar para a lista
          </Link>
        </div>
      ) : !consulta ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Consulta não encontrada.</p>
          <Link href="/app/consultas" className="btn-secondary mt-4 inline-flex">
            Voltar para a lista
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <MetricCard label="Data" value={dateLabel} subvalue={timeLabel} />
            <MetricCard label="Tipo" value={consulta.tipo || "presencial"} />
            <MetricCard label="Áudio" value={consulta.audio_url ? "Salvo" : "Não salvo"} tone={consulta.audio_url ? "green" : "neutral"} />
            <MetricCard label="IA" value={consulta.sintese_ia ? "Revisada" : "Pendente"} tone={consulta.sintese_ia ? "green" : "neutral"} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-semibold text-surface-900">Paciente</h2>
                    <p className="text-sm text-surface-500 mt-1">Dados vinculados à consulta.</p>
                  </div>
                  <User className="w-5 h-5 text-surface-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <InfoField label="Nome" value={consulta.pacientes?.nome || "Paciente não informado"} />
                  <InfoField label="Nascimento" value={consulta.pacientes?.nascimento ? new Date(consulta.pacientes.nascimento).toLocaleDateString("pt-BR") : "—"} />
                  <InfoField label="Sexo" value={formatSexo(consulta.pacientes?.sexo)} />
                  <InfoField label="Telefone" value={consulta.pacientes?.telefone || "—"} />
                  <InfoField label="CPF" value={consulta.pacientes?.cpf || "—"} />
                  <InfoField label="E-mail" value={consulta.pacientes?.email || "—"} />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Mic className="w-5 h-5 text-primary-600" />
                  <h2 className="font-semibold text-surface-900">Áudio da consulta</h2>
                </div>

                {consulta.audio_url ? (
                  <div className="space-y-3">
                    <audio controls src={consulta.audio_url} className="w-full" />
                    <a href={consulta.audio_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary-700 hover:text-primary-800">
                      Abrir arquivo de áudio
                    </a>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-surface-200 bg-surface-50 p-4 text-sm text-surface-500">
                    Esta consulta foi salva sem áudio anexado.
                  </div>
                )}
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="w-5 h-5 text-primary-600" />
                  <h2 className="font-semibold text-surface-900">Resumo clínico</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <InfoField label="Motivo da consulta" value={consulta.motivo_consulta || "—"} />
                  <InfoField label="Queixa principal" value={consulta.queixa_principal || "—"} />
                  <InfoField label="História da doença atual" value={consulta.historia_doenca_atual || "—"} wide />
                  <InfoField label="História familiar cardiovascular" value={consulta.historia_familiar_cardiovascular || "—"} wide />
                  <InfoField label="Exame físico geral" value={consulta.exame_fisico_geral || "—"} wide />
                  <InfoField label="Diagnóstico" value={consulta.diagnostico || "—"} />
                  <InfoField label="CID-10" value={consulta.cid10 || "—"} />
                  <InfoField label="Conduta" value={consulta.conduta || "—"} wide />
                  <InfoField label="Orientações" value={consulta.orientacoes || "—"} wide />
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <MiniVital label="PA" value={formatBloodPressure(consulta.pa_sistolica, consulta.pa_diastolica)} />
                  <MiniVital label="FC" value={formatNumberWithUnit(consulta.fc, "bpm")} />
                  <MiniVital label="FR" value={formatNumberWithUnit(consulta.fr, "rpm")} />
                  <MiniVital label="SpO2" value={formatNumberWithUnit(consulta.saturacao_o2, "%")} />
                  <MiniVital label="IMC" value={formatNumberWithUnit(consulta.imc, "kg/m²")} />
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h2 className="font-semibold text-surface-900">Transcrição completa</h2>
                </div>

                {consulta.transcricao_completa ? (
                  <details className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
                    <summary className="cursor-pointer text-sm font-medium text-surface-700">
                      Abrir transcrição integral
                    </summary>
                    <p className="mt-3 text-sm text-surface-700 whitespace-pre-line leading-6">
                      {consulta.transcricao_completa}
                    </p>
                  </details>
                ) : (
                  <div className="rounded-xl border border-dashed border-surface-200 bg-surface-50 p-4 text-sm text-surface-500">
                    Nenhuma transcrição foi associada a esta consulta.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <ConsultationFollowUpPanel consultationId={consulta.id} synthesis={consulta.sintese_ia} />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <h2 className="font-semibold text-surface-900">Síntese por IA</h2>
                </div>
                <SynthesisPanel synthesis={consulta.sintese_ia} />
                {!consulta.sintese_ia && (
                  <div className="rounded-xl border border-dashed border-surface-200 bg-surface-50 p-4 text-sm text-surface-500">
                    A síntese estruturada ainda não foi gerada.
                  </div>
                )}
              </div>

              <div className="card border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <h2 className="font-semibold text-surface-900">Pontos de revisão</h2>
                </div>
                <ul className="space-y-2 text-sm text-surface-700 list-disc list-inside">
                  <li>Confirme se o áudio anexado corresponde à consulta salva.</li>
                  <li>Revise a transcrição para eventuais correções de contexto clínico.</li>
                  <li>Compare a síntese IA com sua anotação final antes de emitir prescrição ou encaminhamento.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, subvalue, tone = "neutral" }: { label: string; value: string | number; subvalue?: string; tone?: "neutral" | "green" }) {
  const toneClasses = tone === "green" ? "border-emerald-200 bg-emerald-50" : "border-surface-200 bg-surface-50";

  return (
    <div className={`card ${toneClasses}`}>
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-surface-900">{value}</p>
      {subvalue && <p className="mt-1 text-xs text-surface-500">{subvalue}</p>}
    </div>
  );
}

function InfoField({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-1 whitespace-pre-line leading-6 text-surface-800">{value}</p>
    </div>
  );
}

function MiniVital({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-center">
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-surface-900">{value}</p>
    </div>
  );
}

function formatSexo(sexo?: string | null) {
  if (!sexo) return "—";
  if (sexo === "M") return "Masculino";
  if (sexo === "F") return "Feminino";
  return "Outro";
}

function formatBloodPressure(sistolica: number | null, diastolica: number | null) {
  if (!sistolica && !diastolica) return "—";
  return `${sistolica ?? "—"}/${diastolica ?? "—"}`;
}

function formatNumberWithUnit(value: number | null, unit: string) {
  if (value === null || value === undefined) return "—";
  return `${value} ${unit}`;
}
