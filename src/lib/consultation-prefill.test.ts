import assert from "node:assert/strict";
import test from "node:test";

import {
  applyConsultationPrefill,
  buildConsultationPrefillSuggestions,
  getConsultationPrefillSummary,
} from "./consultation-prefill";

const baseDraft = {
  motivo_consulta: "  Dor torácica aos esforços  ",
  queixa_principal: "",
  historia_doenca_atual: "Dispneia progressiva há 2 semanas",
  achados_relevantes: ["PA em repouso elevada", ""],
  diagnosticos_suspeitos: [" Angina estável ", ""],
  exames_pedidos: [],
  conduta: "  Ajustar anti-hipertensivo  ",
  medicamentos_ajustados: [],
  encaminhamentos_sugeridos: [],
  sinais_de_alerta: [],
  orientacoes_paciente: "  Retorno em 7 dias  ",
  trechos_suporte: ["'dor no peito ao subir escadas'"]
};

test("buildConsultationPrefillSuggestions trims and maps structured fields", () => {
  const suggestions = buildConsultationPrefillSuggestions(baseDraft);

  assert.deepEqual(suggestions.map((item) => item.field), [
    "motivo_consulta",
    "queixa_principal",
    "diagnostico",
    "conduta",
    "orientacoes",
  ]);
  assert.equal(suggestions[0].value, "Dor torácica aos esforços");
  assert.equal(suggestions[1].value, "Dispneia progressiva há 2 semanas");
  assert.equal(suggestions[1].source, "historia_doenca_atual");
  assert.equal(suggestions[2].value, "Angina estável");
  assert.equal(suggestions[3].value, "Ajustar anti-hipertensivo");
  assert.equal(suggestions[4].value, "Retorno em 7 dias");
});

test("applyConsultationPrefill fills only empty fields and preserves manual text", () => {
  const suggestions = buildConsultationPrefillSuggestions(baseDraft);
  const applied = applyConsultationPrefill(
    {
      motivo_consulta: "",
      queixa_principal: "Manual da médica",
      diagnostico: "HAS controlada",
      conduta: "",
      orientacoes: "",
      outra_coisa: "preservar",
    },
    suggestions,
  );

  assert.equal(applied.motivo_consulta, "Dor torácica aos esforços");
  assert.equal(applied.queixa_principal, "Manual da médica");
  assert.equal(applied.diagnostico, "HAS controlada");
  assert.equal(applied.conduta, "Ajustar anti-hipertensivo");
  assert.equal(applied.orientacoes, "Retorno em 7 dias");
  assert.equal(applied.outra_coisa, "preservar");
});

test("getConsultationPrefillSummary reports pending, applied and manual states", () => {
  const suggestions = buildConsultationPrefillSuggestions(baseDraft);
  const summary = getConsultationPrefillSummary(
    {
      motivo_consulta: "Dor torácica aos esforços",
      queixa_principal: "Manual da médica",
      diagnostico: "Angina estável",
      conduta: "",
      orientacoes: "Retorno em 7 dias",
    },
    suggestions,
  );

  assert.equal(summary.total, 5);
  assert.equal(summary.applied, 3);
  assert.equal(summary.manual, 1);
  assert.equal(summary.pending, 1);
});
