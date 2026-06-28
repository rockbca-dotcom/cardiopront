import { z } from "zod";

const textSchema = z.preprocess((value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}, z.string());

const textListSchema = z
  .preprocess((value) => (Array.isArray(value) ? value : []), z.array(textSchema))
  .transform((items) => items.filter((item) => item.length > 0));

const examSuggestionSchema = z
  .object({
    tipo: textSchema,
    indicacao: textSchema,
  })
  .strip();

const medicationAdjustmentSchema = z
  .object({
    nome: textSchema,
    dose: textSchema,
    acao: textSchema,
  })
  .strip();

const referralSuggestionSchema = z
  .object({
    especialidade: textSchema,
    justificativa: textSchema,
    prioridade: textSchema,
  })
  .strip();

export const consultationAIDraftSchema = z
  .object({
    motivo_consulta: textSchema,
    queixa_principal: textSchema,
    historia_doenca_atual: textSchema,
    achados_relevantes: textListSchema,
    diagnosticos_suspeitos: textListSchema,
    exames_pedidos: z.preprocess((value) => (Array.isArray(value) ? value : []), z.array(examSuggestionSchema)),
    conduta: textSchema,
    medicamentos_ajustados: z.preprocess((value) => (Array.isArray(value) ? value : []), z.array(medicationAdjustmentSchema)),
    encaminhamentos_sugeridos: z.preprocess((value) => (Array.isArray(value) ? value : []), z.array(referralSuggestionSchema)),
    sinais_de_alerta: textListSchema,
    orientacoes_paciente: textSchema,
    trechos_suporte: textListSchema,
  })
  .strip();

export type ConsultationAIDraft = z.infer<typeof consultationAIDraftSchema>;

export const CONSULTATION_AI_RESPONSE_TEMPLATE: ConsultationAIDraft = {
  motivo_consulta: "",
  queixa_principal: "",
  historia_doenca_atual: "",
  achados_relevantes: [],
  diagnosticos_suspeitos: [],
  exames_pedidos: [],
  conduta: "",
  medicamentos_ajustados: [],
  encaminhamentos_sugeridos: [],
  sinais_de_alerta: [],
  orientacoes_paciente: "",
  trechos_suporte: [],
};

export const CONSULTATION_AI_SYSTEM_PROMPT = `Você é um assistente clínico especializado em cardiologia. Converta a transcrição da consulta em uma síntese estruturada para revisão médica.

Regras:
- Responda somente com um objeto JSON válido.
- Não use markdown, blocos de código, comentários ou texto extra.
- Use português brasileiro.
- Não invente dados ausentes.
- Se algo não estiver na transcrição, use string vazia ou array vazio.
- Os trechos de suporte devem ser curtos, literais e úteis para revisão.
- Se houver indicação de encaminhamento, preencha encaminhamentos_sugeridos com especialidade, justificativa e prioridade.
- Preserve o conteúdo clínico relevante com objetividade.

Contrato de saída:
${JSON.stringify(CONSULTATION_AI_RESPONSE_TEMPLATE, null, 2)}`;

export function extractConsultationAIJson(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Resposta vazia da IA");
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Resposta da IA não contém um objeto JSON válido");
  }

  return trimmed.slice(firstBrace, lastBrace + 1).trim();
}

export function parseConsultationAIDraft(raw: string): ConsultationAIDraft {
  const jsonText = extractConsultationAIJson(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "erro desconhecido";
    throw new Error(`Falha ao interpretar JSON da IA: ${reason}`);
  }

  try {
    return consultationAIDraftSchema.parse(parsed);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "erro desconhecido";
    throw new Error(`Resposta da IA fora do contrato esperado: ${reason}`);
  }
}
