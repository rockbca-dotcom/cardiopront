import assert from "node:assert/strict";
import test from "node:test";

import {
  attachConsultationDates,
  calculateAge,
  calculateBodyMassIndex,
  formatDatePtBr,
  formatDateTimePtBr,
} from "./patient-history";

test("attachConsultationDates links related history rows to consultation dates", () => {
  const consultas = [
    { id: 10, data_consulta: "2026-06-28T10:30:00.000Z" },
    { id: 11, data_consulta: "2026-06-29T09:00:00.000Z" },
  ];

  const exames = attachConsultationDates(
    [
      { consulta_id: 11, prioridade: "urgente" },
      { consulta_id: 10, prioridade: "rotina" },
    ],
    consultas,
  );

  assert.equal(exames[0].consulta_data_consulta, "2026-06-29T09:00:00.000Z");
  assert.equal(exames[1].consulta_data_consulta, "2026-06-28T10:30:00.000Z");
});

test("calculateAge and BMI are stable", () => {
  assert.equal(calculateAge("1990-06-28", new Date("2026-06-28T12:00:00.000Z")), 36);
  assert.equal(calculateAge("1990-06-29", new Date("2026-06-28T12:00:00.000Z")), 35);
  assert.equal(calculateBodyMassIndex(70, 175), 22.9);
});

test("date formatters render pt-BR values", () => {
  assert.equal(formatDatePtBr("2026-06-28T10:30:00.000Z"), "28/06/2026");
  assert.equal(formatDateTimePtBr("2026-06-28T10:30:00.000Z"), "28/06/2026 10:30");
});
