export type BiologicalSex = "M" | "F" | "O" | null | undefined;

export interface RenalPatientProfile {
  nascimento: string;
  sexo: BiologicalSex;
  pesoKg?: number | null;
}

export type RenalStage = "normal" | "leve" | "moderado" | "grave";

export interface RenalAssessment {
  age: number;
  creatininaMgDl: number;
  egfr: number | null;
  crcl: number | null;
  effectiveClearance: number | null;
  stage: RenalStage;
  stageLabel: string;
  shouldAdjustDose: boolean;
  summary: string;
  recommendation: string;
}

const RENAL_STAGE_LABELS: Record<RenalStage, string> = {
  normal: "Função preservada",
  leve: "Redução leve",
  moderado: "Redução moderada",
  grave: "Redução grave",
};

function toPositiveNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : null;
}

function roundPositive(value: number) {
  return Math.max(1, Math.round(value));
}

export function calculateAgeFromBirthdate(birthdate: string, referenceDate = new Date()) {
  if (!birthdate) return 0;

  const parts = birthdate.split("-").map((part) => Number(part));
  if (parts.length < 3 || parts.some((part) => !Number.isFinite(part))) {
    return 0;
  }

  const [year, month, day] = parts;
  const birthDate = new Date(year, month - 1, day);
  if (Number.isNaN(birthDate.getTime())) return 0;

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Math.max(0, age);
}

export function calculateCkdEpi2021(creatininaMgDl: number, age: number, sexo: BiologicalSex) {
  const creatinine = toPositiveNumber(creatininaMgDl);
  if (!creatinine || !Number.isFinite(age) || age < 0) return null;

  const isFemale = sexo === "F";
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexFactor = isFemale ? 1.012 : 1;
  const ratio = creatinine / kappa;

  const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * sexFactor;

  return roundPositive(egfr);
}

export function calculateCockcroftGault(
  creatininaMgDl: number,
  age: number,
  sexo: BiologicalSex,
  pesoKg?: number | null,
) {
  const creatinine = toPositiveNumber(creatininaMgDl);
  const weight = toPositiveNumber(pesoKg ?? Number.NaN);
  if (!creatinine || !weight || !Number.isFinite(age) || age < 0) return null;

  const isFemale = sexo === "F";
  const sexFactor = isFemale ? 0.85 : 1;
  const clearance = ((140 - age) * weight * sexFactor) / (72 * creatinine);

  return roundPositive(clearance);
}

export function classifyRenalStage(clearance: number | null): RenalStage {
  if (!clearance || clearance >= 90) return "normal";
  if (clearance >= 60) return "leve";
  if (clearance >= 30) return "moderado";
  return "grave";
}

export function buildRenalAssessment(
  profile: RenalPatientProfile,
  creatininaMgDl: number,
  referenceDate = new Date(),
): RenalAssessment | null {
  const creatinine = toPositiveNumber(creatininaMgDl);
  if (!creatinine) return null;

  const age = calculateAgeFromBirthdate(profile.nascimento, referenceDate);
  const egfr = calculateCkdEpi2021(creatinine, age, profile.sexo);
  const crcl = calculateCockcroftGault(creatinine, age, profile.sexo, profile.pesoKg);

  const availableClearances = [egfr, crcl].filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);
  const effectiveClearance = availableClearances.length > 0 ? Math.min(...availableClearances) : null;
  const stage = classifyRenalStage(effectiveClearance);
  const stageLabel = RENAL_STAGE_LABELS[stage];
  const shouldAdjustDose = effectiveClearance !== null && effectiveClearance < 60;

  const summaryParts = [] as string[];
  if (egfr !== null) summaryParts.push(`TFGe ${egfr} mL/min/1,73m²`);
  if (crcl !== null) summaryParts.push(`ClCr ${crcl} mL/min`);

  const recommendation =
    stage === "grave"
      ? "Evite sobrecarga e revise a dose com cautela; considere alternativa mais segura."
      : stage === "moderado"
        ? "Revise dose e intervalo dos medicamentos com ajuste renal."
        : stage === "leve"
          ? "Mantenha monitorização e reavalie se houver piora."
          : "Sem ajuste renal adicional no momento.";

  return {
    age,
    creatininaMgDl: creatinine,
    egfr,
    crcl,
    effectiveClearance,
    stage,
    stageLabel,
    shouldAdjustDose,
    summary: summaryParts.join(" · "),
    recommendation,
  };
}

export function formatRenalWarning(
  medicationName: string,
  assessment: RenalAssessment | null,
  requiresRenalAdjustment: boolean,
) {
  if (!requiresRenalAdjustment) return "";
  if (!assessment) {
    return `Informe a creatinina sérica para estimar TFGe antes de definir ${medicationName}.`;
  }
  if (!assessment.shouldAdjustDose) return "";

  const details = assessment.summary || `TFGe estimada ${assessment.effectiveClearance ?? "indisponível"}`;
  return `${medicationName} exige revisão renal. ${details}. ${assessment.recommendation}`;
}
