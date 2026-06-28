import { z } from "zod";

const requiredText = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().min(1, message),
  );

const optionalText = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(120),
);

const optionalLongText = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(300000),
);

export const configuracoesFormSchema = z.object({
  nome: requiredText("Informe seu nome"),
  email: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : ""),
    z.string().email("Informe um e-mail válido"),
  ),
  crm: requiredText("Informe o CRM"),
  crm_uf: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toUpperCase() : ""),
    z.string().length(2, "Informe a UF do CRM"),
  ),
  especialidade: optionalText,
  telefone: optionalText,
  assinatura_data_url: optionalLongText,
});

export type ConfiguracoesFormValues = z.infer<typeof configuracoesFormSchema>;

export interface ConfiguracoesProfile {
  id: string;
  nome: string;
  email: string;
  crm: string;
  crm_uf: string;
  especialidade: string | null;
  telefone: string | null;
  assinatura_data_url: string | null;
  plano: "trial" | "essencial" | "profissional" | "clinica";
  trial_fim: string | null;
  atualizado_em: string | null;
}

export function normalizeConfiguracoesInput(raw: unknown): ConfiguracoesFormValues {
  return configuracoesFormSchema.parse(raw);
}

export function mapMedicoToConfiguracoesProfile(medico: {
  id: string;
  nome: string;
  email: string;
  crm: string;
  crm_uf: string;
  especialidade: string | null;
  telefone: string | null;
  assinatura_data_url: string | null;
  plano: "trial" | "essencial" | "profissional" | "clinica";
  trial_fim: string | null;
  atualizado_em?: string | null;
}): ConfiguracoesProfile {
  return {
    id: medico.id,
    nome: medico.nome ?? "",
    email: medico.email ?? "",
    crm: medico.crm ?? "",
    crm_uf: medico.crm_uf ?? "",
    especialidade: medico.especialidade ?? null,
    telefone: medico.telefone ?? null,
    assinatura_data_url: medico.assinatura_data_url ?? null,
    plano: medico.plano,
    trial_fim: medico.trial_fim ?? null,
    atualizado_em: medico.atualizado_em ?? null,
  };
}
