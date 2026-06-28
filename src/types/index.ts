import type { ConsultationAIDraft } from "@/lib/consultation-ai";

export interface Medico {
  id: number;
  nome: string;
  email: string;
  crm: string;
  crm_uf: string;
  especialidade: string;
  telefone: string | null;
  plano: "trial" | "essencial" | "profissional" | "clinica";
  trial_fim: string | null;
  criado_em: string;
}

export interface Paciente {
  id: number;
  medico_id: number;
  nome: string;
  nascimento: string;
  sexo: "M" | "F" | "O" | null;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  tipo_sanguineo: string | null;
  peso_kg: number | null;
  altura_cm: number | null;
  alergias: string | null;
}

export interface Comorbidade {
  id: number;
  paciente_id: number;
  condicao: string;
  codigo_ciap2: string | null;
  data_diagnostico: string | null;
  observacoes: string | null;
  ativa: boolean;
}

export interface MedicamentoAtivo {
  id: number;
  paciente_id: number;
  medicamento: string;
  dose: string | null;
  frequencia: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  ativo: boolean;
  observacoes: string | null;
}

export interface Consulta {
  id: number;
  paciente_id: number;
  medico_id: number;
  data_consulta: string;
  tipo: "presencial" | "tele" | "retorno";
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
  criado_em: string;
}

export interface TipoExame {
  id: number;
  categoria: "laboratorial" | "cardiovascular" | "imagem" | "outros";
  nome: string;
  descricao: string | null;
  codigo_tus: string | null;
  ativo: boolean;
}

export interface Exame {
  id: number;
  consulta_id: number;
  paciente_id: number;
  tipo_exame_id: number;
  prioridade: "rotina" | "urgente" | "eletiva";
  indicacao_clinica: string | null;
  data_pedido: string;
  data_resultado: string | null;
  resultado_texto: string | null;
  resultado_valores: Record<string, unknown> | null;
  status: "pendente" | "resultado_enviado" | "lido";
}

export interface Prescricao {
  id: number;
  consulta_id: number;
  paciente_id: number;
  data_prescricao: string;
  validade_dias: number;
  medicamento: string;
  principio_ativo: string | null;
  dose: string | null;
  unidade: string | null;
  frequencia: string | null;
  posologia: string | null;
  via: string | null;
  advertencias: string | null;
}

export interface MedicamentoCatalogo {
  id: number;
  classe: string;
  principio_ativo: string;
  nome_comercial: string | null;
  apresentacao: string | null;
  dose_padrao: string | null;
  dose_maxima: number | null;
  unidade: string | null;
  via: string | null;
  ajuste_renal: boolean;
  ajuste_hepatico: boolean;
  principais_interacoes: string | null;
  contraindicacoes: string | null;
}
