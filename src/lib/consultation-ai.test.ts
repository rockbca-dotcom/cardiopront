import assert from "node:assert/strict";
import test from "node:test";

import { CONSULTATION_AI_RESPONSE_TEMPLATE, extractConsultationAIJson, parseConsultationAIDraft } from "./consultation-ai";

test("extractConsultationAIJson removes markdown fences", () => {
  const raw = "Antes\n```json\n{\"motivo_consulta\":\"Dor torácica\"}\n```\nDepois";
  assert.equal(extractConsultationAIJson(raw), '{"motivo_consulta":"Dor torácica"}');
});

test("parseConsultationAIDraft normalizes a valid payload", () => {
  const raw = JSON.stringify({
    motivo_consulta: " Dor torácica aos esforços ",
    queixa_principal: " Dispneia leve ",
    historia_doenca_atual: "Piora progressiva há 2 semanas",
    achados_relevantes: [" PA elevada ", ""],
    diagnosticos_suspeitos: ["Angina estável"],
    exames_pedidos: [{ tipo: " ECG ", indicacao: " Avaliar isquemia " }],
    conduta: " Ajustar anti-hipertensivo ",
    medicamentos_ajustados: [{ nome: " Enalapril ", dose: " 10 mg ", acao: " aumentar dose " }],
    encaminhamentos_sugeridos: [{ especialidade: " Cardiologia ", justificativa: " dor torácica persistente ", prioridade: " alta " }],
    sinais_de_alerta: ["Dor torácica em repouso"],
    orientacoes_paciente: "Retornar com exames",
    trechos_suporte: ["'dor no peito ao subir escadas'"],
  });

  const parsed = parseConsultationAIDraft(raw);

  assert.equal(parsed.motivo_consulta, "Dor torácica aos esforços");
  assert.equal(parsed.queixa_principal, "Dispneia leve");
  assert.equal(parsed.historia_doenca_atual, "Piora progressiva há 2 semanas");
  assert.deepEqual(parsed.achados_relevantes, ["PA elevada"]);
  assert.deepEqual(parsed.exames_pedidos, [{ tipo: "ECG", indicacao: "Avaliar isquemia" }]);
  assert.deepEqual(parsed.medicamentos_ajustados, [{ nome: "Enalapril", dose: "10 mg", acao: "aumentar dose" }]);
  assert.deepEqual(parsed.encaminhamentos_sugeridos, [{ especialidade: "Cardiologia", justificativa: "dor torácica persistente", prioridade: "alta" }]);
  assert.deepEqual(parsed.trechos_suporte, ["'dor no peito ao subir escadas'"]);
});

test("parseConsultationAIDraft fills missing fields with safe defaults", () => {
  const parsed = parseConsultationAIDraft("{}");

  assert.deepEqual(parsed, CONSULTATION_AI_RESPONSE_TEMPLATE);
});

test("parseConsultationAIDraft rejects non-json text", () => {
  assert.throws(() => parseConsultationAIDraft("texto solto sem objeto"), /JSON válido|fora do contrato/);
});
