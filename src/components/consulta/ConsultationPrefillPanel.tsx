"use client";

import { ArrowRight, CheckCircle2, Clock3, PenLine, Sparkles } from "lucide-react";

import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import {
  CONSULTATION_PREFILL_FIELDS,
  type ConsultationFormValues,
  type ConsultationPrefillSuggestion,
  buildConsultationPrefillSuggestions,
  getConsultationPrefillStatus,
  getConsultationPrefillSummary,
} from "@/lib/consultation-prefill";

interface ConsultationPrefillPanelProps {
  synthesis: ConsultationAIDraft | null;
  form: ConsultationFormValues;
  onApplySuggestion: (suggestion: ConsultationPrefillSuggestion) => void;
  onApplyAll: () => void;
}

export default function ConsultationPrefillPanel({ synthesis, form, onApplySuggestion, onApplyAll }: ConsultationPrefillPanelProps) {
  const suggestions = buildConsultationPrefillSuggestions(synthesis);
  if (suggestions.length === 0) return null;

  const summary = getConsultationPrefillSummary(form, suggestions);

  return (
    <div className="card border-primary-200 bg-primary-50/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Revisão guiada
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Preenchimento sugerido pela IA</h3>
            <p className="text-sm text-surface-600 mt-1 max-w-2xl">
              Os campos abaixo foram derivados da transcrição e podem ser aplicados com um clique. Nós preservamos qualquer texto já preenchido manualmente.
            </p>
          </div>
        </div>

        <button type="button" onClick={onApplyAll} className="btn-secondary whitespace-nowrap text-xs h-10 px-4">
          Aplicar campos vazios
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard value={summary.total} label="Sugestões" tone="blue" />
        <StatCard value={summary.applied} label="Aplicadas" tone="green" />
        <StatCard value={summary.manual} label="Manuais" tone="amber" />
      </div>

      <div className="mt-5 grid gap-3">
        {suggestions.map((suggestion) => {
          const status = getConsultationPrefillStatus(form, suggestion);
          const currentValue = form[suggestion.field]?.trim() || "";
          const canApply = status === "pending";

          return (
            <div key={suggestion.field} className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-surface-900">{CONSULTATION_PREFILL_FIELDS[suggestion.field]}</h4>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-surface-500">
                    <span>{suggestion.sourceLabel}</span>
                    <span>•</span>
                    <span>{suggestion.confidence === "alta" ? "Alta confiança" : "Campo de revisão"}</span>
                  </div>
                </div>

                {canApply ? (
                  <button
                    type="button"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="btn-primary h-9 px-4 text-xs whitespace-nowrap"
                  >
                    Aplicar
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 text-xs text-surface-600">
                    <PenLine className="w-3.5 h-3.5" />
                    {status === "applied" ? "Já preenchido" : "Valor manual preservado"}
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <SuggestionCard title="Sugestão da IA" value={suggestion.value} highlight="primary" />
                <SuggestionCard
                  title={currentValue ? "Valor atual no formulário" : "Campo ainda vazio"}
                  value={currentValue || "Sem texto manual por enquanto."}
                  highlight={status === "manual" ? "warning" : "neutral"}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ value, label, tone }: { value: number; label: string; tone: "blue" | "green" | "amber" }) {
  const toneClasses = {
    blue: "bg-primary-50 text-primary-700 border-primary-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  }[tone];

  return (
    <div className={`rounded-xl border p-3 ${toneClasses}`}>
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="text-xs font-medium mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "applied" | "manual" }) {
  if (status === "applied") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
        <CheckCircle2 className="w-3 h-3" />
        Aplicado
      </span>
    );
  }

  if (status === "manual") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-surface-700">
        <PenLine className="w-3 h-3" />
        Manual
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <Clock3 className="w-3 h-3" />
      Pendente
    </span>
  );
}

function SuggestionCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight: "primary" | "warning" | "neutral";
}) {
  const styles = {
    primary: "border-primary-100 bg-primary-50/50 text-primary-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    neutral: "border-surface-200 bg-surface-50 text-surface-700",
  }[highlight];

  return (
    <div className={`rounded-lg border p-3 ${styles}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{title}</p>
      <p className="mt-2 text-sm whitespace-pre-line leading-6">{value}</p>
    </div>
  );
}
