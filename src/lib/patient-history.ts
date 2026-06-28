export interface ConsultationDateSource {
  id: string | number;
  data_consulta: string | null;
}

export interface RelatedHistoryItem {
  consulta_id: string | number;
}

export function attachConsultationDates<T extends RelatedHistoryItem>(
  items: T[],
  consultations: ConsultationDateSource[],
): Array<T & { consulta_data_consulta: string | null }> {
  const consultationDateById = new Map(
    consultations.map((consultation) => [String(consultation.id), consultation.data_consulta]),
  );

  return items.map((item) => ({
    ...item,
    consulta_data_consulta: consultationDateById.get(String(item.consulta_id)) ?? null,
  }));
}

export function parseLooseDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const normalized = value.includes("T") ? value : `${value}T12:00:00`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function calculateAge(value: string | null | undefined, referenceDate = new Date()): number | null {
  const birthDate = parseLooseDate(value);
  if (!birthDate) return null;

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  const dayDiff = referenceDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

export function calculateBodyMassIndex(
  weightKg: number | string | null | undefined,
  heightCm: number | string | null | undefined,
): number | null {
  const weight = Number(weightKg);
  const height = Number(heightCm);

  if (!Number.isFinite(weight) || !Number.isFinite(height) || weight <= 0 || height <= 0) {
    return null;
  }

  const heightMeters = height / 100;
  if (heightMeters <= 0) return null;

  return Number((weight / (heightMeters * heightMeters)).toFixed(1));
}

export function formatDatePtBr(value: string | null | undefined): string {
  const parsed = parseLooseDate(value);
  if (!parsed) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export function formatDateTimePtBr(value: string | null | undefined): string {
  const parsed = parseLooseDate(value);
  if (!parsed) return "—";

  const date = formatDatePtBr(value);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);

  return `${date} ${time}`;
}
