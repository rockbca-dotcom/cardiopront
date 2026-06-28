import assert from "node:assert/strict";
import test from "node:test";

import { mapMedicoToConfiguracoesProfile, normalizeConfiguracoesInput } from "./configuracoes";

test("normalizeConfiguracoesInput trims and normalizes profile data", () => {
  const parsed = normalizeConfiguracoesInput({
    nome: "  Dr. Rafael  ",
    email: "  RAFAEL@CardioPront.com.br  ",
    crm: " 123456 ",
    crm_uf: " sp ",
    especialidade: " Cardiologia ",
    telefone: " (11) 99999-9999 ",
  });

  assert.deepEqual(parsed, {
    nome: "Dr. Rafael",
    email: "rafael@cardiopront.com.br",
    crm: "123456",
    crm_uf: "SP",
    especialidade: "Cardiologia",
    telefone: "(11) 99999-9999",
  });
});

test("mapMedicoToConfiguracoesProfile preserves nullable settings", () => {
  const mapped = mapMedicoToConfiguracoesProfile({
    id: "med_1",
    nome: "Dr. Rafael",
    email: "rafael@cardiopront.com.br",
    crm: "123456",
    crm_uf: "SP",
    especialidade: null,
    telefone: null,
    plano: "profissional",
    trial_fim: null,
    atualizado_em: "2026-06-28T12:00:00.000Z",
  });

  assert.equal(mapped.id, "med_1");
  assert.equal(mapped.especialidade, null);
  assert.equal(mapped.telefone, null);
  assert.equal(mapped.plano, "profissional");
  assert.equal(mapped.atualizado_em, "2026-06-28T12:00:00.000Z");
});
