import assert from "node:assert/strict";
import test from "node:test";

import type { ConsultationAIDraft } from "./consultation-ai";
import { buildConsultationFollowUpPlan, inferConsultationExamCategory } from "./consultation-followup";

const followUpDraft = {
  motivo_consulta: "Dor torácica aos esforços",
  queixa_principal: "Dispneia leve",
  historia_doenca_atual: "Piora progressiva há 2 semanas",
  achados_relevantes: ["PA elevada"],
  diagnosticos_suspeitos: ["Angina estável"],
  exames_pedidos: [
    { tipo: " ECG ", indicacao: " Avaliar isquemia " },
    { tipo: " Ecocardiograma ", indicacao: " Função ventricular " },
  ],
  conduta: "Ajustar anti-hipertensivo",
  medicamentos_ajustados: [
    { nome: " Enalapril ", dose: " 10 mg ", acao: " aumentar dose " },
    { nome: "AAS", dose: "100 mg", acao: "manter" },
  ],
  encaminhamentos_sugeridos: [
    { especialidade: " Cardiologia ", justificativa: " dor torácica persistente ", prioridade: " alta " },
    { especialidade: "Fisioterapia", justificativa: "reabilitação", prioridade: "media" },
  ],
  sinais_de_alerta: ["Dor torácica em repouso"],
  orientacoes_paciente: "Retornar com exames",
  trechos_suporte: ["'dor no peito ao subir escadas'"],
};

test("buildConsultationFollowUpPlan normalizes meds, exams and referrals", () => {
  const plan = buildConsultationFollowUpPlan(followUpDraft as ConsultationAIDraft);

  assert.deepEqual(plan.medications, [
    { nome: "Enalapril", dose: "10 mg", acao: "aumentar dose" },
    { nome: "AAS", dose: "100 mg", acao: "manter" },
  ]);
  assert.deepEqual(plan.exams, [
    { tipo: "ECG", indicacao: "Avaliar isquemia", categoria: "cardiovascular" },
    { tipo: "Ecocardiograma", indicacao: "Função ventricular", categoria: "cardiovascular" },
  ]);
  assert.deepEqual(plan.referrals, [
    { especialidade: "Cardiologia", justificativa: "dor torácica persistente", prioridade: "alta" },
    { especialidade: "Fisioterapia", justificativa: "reabilitação", prioridade: "media" },
  ]);
  assert.equal(plan.prescriptionSearch, "Enalapril");
  assert.equal(plan.examSearch, "ECG");
  assert.equal(plan.examCategory, "cardiovascular");
  assert.match(plan.referralClipboardText, /Cardiologia/);
  assert.match(plan.referralClipboardText, /Fisioterapia/);
});

test("inferConsultationExamCategory infers common exam groups", () => {
  assert.equal(inferConsultationExamCategory("Holter 24h"), "cardiovascular");
  assert.equal(inferConsultationExamCategory("Hemograma completo"), "laboratorial");
  assert.equal(inferConsultationExamCategory("Ressonância magnética de tórax"), "imagem");
  assert.equal(inferConsultationExamCategory("teste livre"), "outros");
});
