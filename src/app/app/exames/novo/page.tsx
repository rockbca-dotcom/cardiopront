"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

import ExamBuilder from "@/components/exames/ExamBuilder";
import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import { buildConsultationFollowUpPlan, inferConsultationExamCategory } from "@/lib/consultation-followup";

interface Patient {
  id: string;
  nome: string;
}

interface ConsultationSummary {
  id: string;
  data_consulta: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  diagnostico: string | null;
  pacientes?: { id: string; nome: string } | null;
  sintese_ia: ConsultationAIDraft | null;
}

export default function NovoExamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultaId = searchParams.get("consulta_id")?.trim() || "";
  const querySearch = searchParams.get("search")?.trim() || "";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultation, setConsultation] = useState<ConsultationSummary | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationError, setConsultationError] = useState("");

  const followUpPlan = useMemo(() => buildConsultationFollowUpPlan(consultation?.sintese_ia), [consultation]);
  const initialExamSearch = querySearch || followUpPlan.examSearch;
  const initialExamCategory = inferConsultationExamCategory(initialExamSearch || followUpPlan.examSearch || "");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!consultaId) {
      setConsultationLoading(false);
      return;
    }

    fetchConsultation(consultaId);
  }, [consultaId]);

  async function fetchPatients() {
    setLoadingPatients(true);
    try {
      const res = await fetch("/api/pacientes", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar pacientes");
      }
      setPatients(data.pacientes || []);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoadingPatients(false);
    }
  }

  async function fetchConsultation(id: string) {
    setConsultationLoading(true);
    setConsultationError("");

    try {
      const res = await fetch(`/api/consultas/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar consulta");
      }

      setConsultation(data.consulta || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar consulta";
      setConsultationError(message);
    } finally {
      setConsultationLoading(false);
    }
  }

  async function handleSave(data: { consulta_id: string | null; paciente_id: string; exams: Array<{ tipo_exame_id: string; prioridade: string; indicacao_clinica: string }> }) {
    for (const exam of data.exams) {
      const res = await fetch("/api/exames", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consulta_id: data.consulta_id,
          paciente_id: data.paciente_id,
          tipo_exame_id: exam.tipo_exame_id,
          prioridade: exam.prioridade,
          indicacao_clinica: exam.indicacao_clinica || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro");
      }
    }
    alert("Exames salvos!");
    router.push("/app/exames");
  }

  if (loadingPatients) {
    return (
      <div className="max-w-5xl">
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href="/app/exames" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">Novo pedido de exames</h1>
        <p className="text-surface-600 mt-1">Selecione o paciente e os exames.</p>
      </div>

      {consultaId && (
        <div className="card border-primary-200 bg-primary-50/30 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Consulta vinculada
              </div>
              <p className="text-sm text-surface-700">
                {consultation
                  ? `Paciente: ${consultation.pacientes?.nome || "Paciente não informado"}`
                  : consultationError
                    ? `Não foi possível carregar a consulta: ${consultationError}`
                    : consultationLoading
                      ? "Carregando contexto da consulta..."
                      : "A consulta vinculada não foi encontrada."}
              </p>
              {consultation?.motivo_consulta && (
                <p className="text-xs text-surface-500">Motivo: {consultation.motivo_consulta}</p>
              )}
            </div>

            {consultation?.id && (
              <Link href={`/app/consultas/${consultation.id}`} className="btn-secondary text-xs h-10 px-4 whitespace-nowrap">
                Ver consulta
              </Link>
            )}
          </div>

          {followUpPlan.exams.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {followUpPlan.exams.map((exam) => (
                <span key={exam.tipo} className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs text-primary-700">
                  <span className="font-semibold">{exam.tipo}</span>
                  {exam.indicacao && <span className="text-primary-500"> · {exam.indicacao}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <ExamBuilder
        patients={patients}
        onSave={handleSave}
        initialPatientId={consultation?.pacientes?.id || ""}
        initialSearch={initialExamSearch}
        initialCategory={initialExamCategory}
      />
    </div>
  );
}
