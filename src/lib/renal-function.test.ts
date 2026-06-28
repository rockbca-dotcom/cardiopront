import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRenalAssessment,
  calculateAgeFromBirthdate,
  calculateCockcroftGault,
  calculateCkdEpi2021,
  formatRenalWarning,
} from "./renal-function";

test("calculateAgeFromBirthdate respects the birthday boundary", () => {
  const referenceDate = new Date("2026-06-28T12:00:00Z");

  assert.equal(calculateAgeFromBirthdate("1980-06-27", referenceDate), 46);
  assert.equal(calculateAgeFromBirthdate("1980-06-29", referenceDate), 45);
});

test("renal estimates use creatinine, age and sex", () => {
  const egfr = calculateCkdEpi2021(1.4, 60, "F");
  const crcl = calculateCockcroftGault(1.4, 60, "F", 70);

  assert.ok(egfr !== null);
  assert.ok(crcl !== null);
  assert.ok(egfr >= 40 && egfr <= 45);
  assert.ok(crcl >= 45 && crcl <= 50);
});

test("buildRenalAssessment flags reduced renal function for renal-sensitive drugs", () => {
  const assessment = buildRenalAssessment(
    {
      nascimento: "1950-01-01",
      sexo: "F",
      pesoKg: 65,
    },
    2.2,
    new Date("2026-06-28T00:00:00Z"),
  );

  assert.ok(assessment);
  assert.equal(assessment?.stage, "grave");
  assert.equal(assessment?.shouldAdjustDose, true);
  assert.match(assessment?.summary || "", /TFGe/);
  assert.match(formatRenalWarning("Enalapril", assessment, true), /revisão renal/i);
  assert.equal(formatRenalWarning("AAS", assessment, false), "");
  assert.match(formatRenalWarning("Losartana", null, true), /creatinina/i);
});
