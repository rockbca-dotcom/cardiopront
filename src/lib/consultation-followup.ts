import type { ConsultationAIDraft } from "./consultation-ai";

export type ConsultationFollowUpExamCategory = "cardiovascular" | "laboratorial" | "imagem" | "outros";
export type ConsultationFollowUpPriority = "alta" | "media" | "baixa";

export interface ConsultationFollowUpMedication {
  nome: string;
  dose: string;
  acao: string;
}

export interface ConsultationFollowUpExam {
  tipo: string;
  indicacao: string;
  categoria: ConsultationFollowUpExamCategory;
}

export interface ConsultationFollowUpReferral {
  especialidade: string;
  justificativa: string;
  prioridade: ConsultationFollowUpPriority;
}

export interface ConsultationFollowUpPlan {
  medications: ConsultationFollowUpMedication[];
  exams: ConsultationFollowUpExam[];
  referrals: ConsultationFollowUpReferral[];
  prescriptionSearch: string;
  examSearch: string;
  examCategory: ConsultationFollowUpExamCategory;
  referralClipboardText: string;
}

function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map(normalizeText).filter(Boolean)));
}

function normalizePriority(value: unknown): ConsultationFollowUpPriority {
  const priority = normalizeText(value).toLowerCase();
  if (priority === "alta" || priority === "baixa") return priority;
  return "media";
}

export function inferConsultationExamCategory(value: string): ConsultationFollowUpExamCategory {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized) return "outros";

  if (/(ecg|eletro|holter|mapa|ergom|teste ergom|ecocard|eco\b)/.test(normalized)) {
    return "cardiovascular";
  }

  if (/(hemogram|glic|creatin|urei|colesterol|triglic|tsh|t4|tropon|pot[áa]ssio|s[oó]dio|laborator)/.test(normalized)) {
    return "laboratorial";
  }

  if (/(raio|rx\b|tomograf|resson|ultrassom|doppler|angiotom|angio|cintil|imagem)/.test(normalized)) {
    return "imagem";
  }

  return "outros";
}

export function buildConsultationFollowUpPlan(synthesis: ConsultationAIDraft | null | undefined): ConsultationFollowUpPlan {
  if (!synthesis) {
    return {
      medications: [],
      exams: [],
      referrals: [],
      prescriptionSearch: "",
      examSearch: "",
      examCategory: "outros",
      referralClipboardText: "",
    };
  }

  const medications = unique(synthesis.medicamentos_ajustados.map((item) => item.nome)).map((nome) => {
    const source = synthesis.medicamentos_ajustados.find((item) => normalizeText(item.nome) === nome);
    return {
      nome,
      dose: normalizeText(source?.dose),
      acao: normalizeText(source?.acao),
    };
  });

  const exams = unique(synthesis.exames_pedidos.map((item) => item.tipo)).map((tipo) => {
    const source = synthesis.exames_pedidos.find((item) => normalizeText(item.tipo) === tipo);
    return {
      tipo,
      indicacao: normalizeText(source?.indicacao),
      categoria: inferConsultationExamCategory(tipo),
    };
  });

  const referrals = unique(
    synthesis.encaminhamentos_sugeridos.map(
      (item) => `${item.especialidade}__${item.justificativa}__${item.prioridade}`,
    ),
  ).map((key) => {
    const [especialidadeRaw, justificativaRaw, prioridadeRaw] = key.split("__");
    return {
      especialidade: normalizeText(especialidadeRaw),
      justificativa: normalizeText(justificativaRaw),
      prioridade: normalizePriority(prioridadeRaw),
    };
  });

  const referralClipboardText = referrals.length
    ? ["Encaminhamentos sugeridos:", ...referrals.map((item) => `- ${item.especialidade} (${item.prioridade}): ${item.justificativa}`)].join("\n")
    : "";

  return {
    medications,
    exams,
    referrals,
    prescriptionSearch: medications[0]?.nome || "",
    examSearch: exams[0]?.tipo || "",
    examCategory: inferConsultationExamCategory(exams[0]?.tipo || ""),
    referralClipboardText,
  };
}
