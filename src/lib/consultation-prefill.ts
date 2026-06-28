import type { ConsultationAIDraft } from "./consultation-ai";

export interface ConsultationFormValues {
  [key: string]: string;
  paciente_id: string;
  data_consulta: string;
  tipo: string;
  motivo_consulta: string;
  queixa_principal: string;
  pa_sistolica: string;
  pa_diastolica: string;
  fc: string;
  fr: string;
  temp_celsius: string;
  saturacao_o2: string;
  peso_kg: string;
  altura_cm: string;
  exame_fisico_geral: string;
  diagnostico: string;
  cid10: string;
  conduta: string;
  orientacoes: string;
}

export type ConsultationPrefillField =
  | "motivo_consulta"
  | "queixa_principal"
  | "diagnostico"
  | "conduta"
  | "orientacoes";

export type ConsultationPrefillSource =
  | "motivo_consulta"
  | "queixa_principal"
  | "historia_doenca_atual"
  | "diagnosticos_suspeitos"
  | "conduta"
  | "orientacoes_paciente";

export type ConsultationPrefillConfidence = "alta" | "media";
export type ConsultationPrefillStatus = "pending" | "applied" | "manual";

export interface ConsultationPrefillSuggestion {
  field: ConsultationPrefillField;
  label: string;
  value: string;
  source: ConsultationPrefillSource;
  sourceLabel: string;
  confidence: ConsultationPrefillConfidence;
}

export interface ConsultationPrefillSummary {
  total: number;
  applied: number;
  manual: number;
  pending: number;
}

export const CONSULTATION_PREFILL_FIELDS: Record<ConsultationPrefillField, string> = {
  motivo_consulta: "Motivo da consulta",
  queixa_principal: "Queixa principal",
  diagnostico: "Diagnóstico",
  conduta: "Conduta",
  orientacoes: "Orientações ao paciente",
};

const CONSULTATION_PREFILL_SOURCE_LABELS: Record<ConsultationPrefillSource, string> = {
  motivo_consulta: "Motivo relatado",
  queixa_principal: "Queixa principal ou HDA",
  historia_doenca_atual: "História da doença atual",
  diagnosticos_suspeitos: "Diagnósticos suspeitos",
  conduta: "Conduta sugerida",
  orientacoes_paciente: "Orientações ao paciente",
};

function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function uniqueNonEmpty(values: string[]): string[] {
  return Array.from(new Set(values.map(normalizeText).filter(Boolean)));
}

export function buildConsultationPrefillSuggestions(
  synthesis: ConsultationAIDraft | null | undefined,
): ConsultationPrefillSuggestion[] {
  if (!synthesis) return [];

  const suggestions: ConsultationPrefillSuggestion[] = [];

  const motivoConsulta = normalizeText(synthesis.motivo_consulta);
  if (motivoConsulta) {
    suggestions.push({
      field: "motivo_consulta",
      label: CONSULTATION_PREFILL_FIELDS.motivo_consulta,
      value: motivoConsulta,
      source: "motivo_consulta",
      sourceLabel: CONSULTATION_PREFILL_SOURCE_LABELS.motivo_consulta,
      confidence: "alta",
    });
  }

  const queixaPrincipal = normalizeText(synthesis.queixa_principal);
  const historiaDoencaAtual = normalizeText(synthesis.historia_doenca_atual);
  const queixaValue = queixaPrincipal || historiaDoencaAtual;
  if (queixaValue) {
    suggestions.push({
      field: "queixa_principal",
      label: CONSULTATION_PREFILL_FIELDS.queixa_principal,
      value: queixaValue,
      source: queixaPrincipal ? "queixa_principal" : "historia_doenca_atual",
      sourceLabel: queixaPrincipal
        ? CONSULTATION_PREFILL_SOURCE_LABELS.queixa_principal
        : CONSULTATION_PREFILL_SOURCE_LABELS.historia_doenca_atual,
      confidence: queixaPrincipal ? "alta" : "media",
    });
  }

  const diagnosticosSuspeitos = uniqueNonEmpty(synthesis.diagnosticos_suspeitos);
  if (diagnosticosSuspeitos.length > 0) {
    suggestions.push({
      field: "diagnostico",
      label: CONSULTATION_PREFILL_FIELDS.diagnostico,
      value: diagnosticosSuspeitos.join("; "),
      source: "diagnosticos_suspeitos",
      sourceLabel: CONSULTATION_PREFILL_SOURCE_LABELS.diagnosticos_suspeitos,
      confidence: "media",
    });
  }

  const conduta = normalizeText(synthesis.conduta);
  if (conduta) {
    suggestions.push({
      field: "conduta",
      label: CONSULTATION_PREFILL_FIELDS.conduta,
      value: conduta,
      source: "conduta",
      sourceLabel: CONSULTATION_PREFILL_SOURCE_LABELS.conduta,
      confidence: "media",
    });
  }

  const orientacoes = normalizeText(synthesis.orientacoes_paciente);
  if (orientacoes) {
    suggestions.push({
      field: "orientacoes",
      label: CONSULTATION_PREFILL_FIELDS.orientacoes,
      value: orientacoes,
      source: "orientacoes_paciente",
      sourceLabel: CONSULTATION_PREFILL_SOURCE_LABELS.orientacoes_paciente,
      confidence: "media",
    });
  }

  return suggestions;
}

export function applyConsultationSuggestion(
  form: ConsultationFormValues,
  suggestion: ConsultationPrefillSuggestion,
): ConsultationFormValues {
  const next = { ...form };
  if (!normalizeText(next[suggestion.field])) {
    next[suggestion.field] = suggestion.value;
  }
  return next;
}

export function applyConsultationPrefill(
  form: ConsultationFormValues,
  suggestions: ConsultationPrefillSuggestion[],
): ConsultationFormValues {
  return suggestions.reduce((currentForm, suggestion) => applyConsultationSuggestion(currentForm, suggestion), {
    ...form,
  });
}

export function getConsultationPrefillStatus(
  form: ConsultationFormValues,
  suggestion: ConsultationPrefillSuggestion,
): ConsultationPrefillStatus {
  const currentValue = normalizeText(form[suggestion.field]);
  if (!currentValue) return "pending";
  if (currentValue === suggestion.value) return "applied";
  return "manual";
}

export function getConsultationPrefillSummary(
  form: ConsultationFormValues,
  suggestions: ConsultationPrefillSuggestion[],
): ConsultationPrefillSummary {
  return suggestions.reduce<ConsultationPrefillSummary>(
    (summary, suggestion) => {
      const status = getConsultationPrefillStatus(form, suggestion);
      if (status === "applied") summary.applied += 1;
      else if (status === "manual") summary.manual += 1;
      else summary.pending += 1;
      summary.total += 1;
      return summary;
    },
    { total: 0, applied: 0, manual: 0, pending: 0 },
  );
}
