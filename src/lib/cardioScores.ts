// Cardiovascular Risk Score Calculators
// Based on validated clinical guidelines

export interface ScoreResult {
  score: number;
  risk: "baixo" | "moderado" | "alto" | "muito_alto";
  riskPercent?: string;
  description: string;
  recommendations: string[];
}

// CHA₂DS₂-VASc Score (Atrial Fibrillation Stroke Risk)
export function calculateCHA2DS2VASc(data: {
  age: number;
  sex: "M" | "F";
  heartFailure: boolean;
  hypertension: boolean;
  diabetes: boolean;
  strokeTIA: boolean;
  vascularDisease: boolean;
}): ScoreResult {
  let score = 0;

  // Congestive Heart Failure
  if (data.heartFailure) score += 1;
  // Hypertension
  if (data.hypertension) score += 1;
  // Age >= 75
  if (data.age >= 75) score += 2;
  // Diabetes
  if (data.diabetes) score += 1;
  // Stroke/TIA/Thromboembolism
  if (data.strokeTIA) score += 2;
  // Vascular disease (MI, PAD, aortic plaque)
  if (data.vascularDisease) score += 1;
  // Age 65-74
  if (data.age >= 65 && data.age < 75) score += 1;
  // Sex category (female)
  if (data.sex === "F") score += 1;

  let risk: ScoreResult["risk"];
  let riskPercent: string;
  let description: string;
  let recommendations: string[];

  if (score === 0) {
    risk = "baixo";
    riskPercent = "0%";
    description = "Risco muito baixo de AVC. Anticoagulação geralmente não necessária.";
    recommendations = [
      "Manter acompanhamento cardiológico regular",
      "Controle de fatores de risco cardiovascular",
    ];
  } else if (score === 1) {
    risk = "moderado";
    riskPercent = "1.3%";
    description = "Risco moderado de AVC. Considerar anticoagulação baseada em preferências do paciente.";
    recommendations = [
      "Considerar anticoagulação oral (DOAC ou Varfarina)",
      "Avaliar risco de sangramento (HAS-BLED)",
      "Discutir opções com o paciente",
    ];
  } else if (score === 2) {
    risk = "alto";
    riskPercent = "2.2%";
    description = "Risco alto de AVC. Anticoagulação recomendada.";
    recommendations = [
      "Iniciar anticoagulação oral (DOAC preferencial)",
      "Se Varfarina: manter INR entre 2.0-3.0",
      "Monitorar função renal periodicamente",
    ];
  } else if (score >= 3) {
    risk = "muito_alto";
    riskPercent = score >= 4 ? "≥4.0%" : "3.2%";
    description = `Risco muito alto de AVC (${score} pontos). Anticoagulação fortemente recomendada.`;
    recommendations = [
      "Iniciar anticoagulação oral imediatamente (DOAC preferencial)",
      "Se Varfarina: manter INR entre 2.0-3.0",
      "Monitorar função renal e hepática",
      "Avaliar interações medicamentosas",
    ];
  } else {
    risk = "baixo";
    riskPercent = "0%";
    description = "Risco baixo.";
    recommendations = ["Manter acompanhamento regular."];
  }

  return { score, risk, riskPercent, description, recommendations };
}

// HAS-BLED Score (Bleeding Risk on Anticoagulation)
export function calculateHASBLED(data: {
  hypertension: boolean;
  renalDisease: boolean;
  liverDisease: boolean;
  strokeHistory: boolean;
  bleedingHistory: boolean;
  labileINR: boolean;
  age65: boolean;
  drugs: boolean;
  alcohol: boolean;
}): ScoreResult {
  let score = 0;

  if (data.hypertension) score += 1;
  if (data.renalDisease) score += 1;
  if (data.liverDisease) score += 1;
  if (data.strokeHistory) score += 1;
  if (data.bleedingHistory) score += 1;
  if (data.labileINR) score += 1;
  if (data.age65) score += 1;
  if (data.drugs) score += 1;
  if (data.alcohol) score += 1;

  let risk: ScoreResult["risk"];
  let description: string;
  let recommendations: string[];

  if (score <= 1) {
    risk = "baixo";
    description = "Risco baixo de sangramento (≤1.8%/ano). Anticoagulação segura.";
    recommendations = [
      "Anticoagulação pode ser iniciada com segurança",
      "Monitorar pressão arterial regularmente",
    ];
  } else if (score === 2) {
    risk = "moderado";
    description = "Risco moderado de sangramento (2.4-3.2%/ano). Cautela com anticoagulação.";
    recommendations = [
      "Avaliar benefício vs risco da anticoagulação",
      "Considerar DOAC em vez de Varfarina",
      "Monitorar função renal e hepática",
    ];
  } else {
    risk = "alto";
    description = `Risco alto de sangramento (≥3.7%/ano). Requer cautela especial.`;
    recommendations = [
      "Avaliar alternativas à anticoagulação",
      "Se necessário, usar menor dose eficaz",
      "Monitorar sinais de sangramento frequentemente",
      "Considerar cardiodesfibrilador se FA",
    ];
  }

  return { score, risk, description, recommendations };
}

// Framingham Risk Score (10-year CVD Risk) - Simplified
export function calculateFramingham(data: {
  age: number;
  sex: "M" | "F";
  totalCholesterol: number;
  hdlCholesterol: number;
  systolicBP: number;
  treatedBP: boolean;
  smoker: boolean;
  diabetes: boolean;
}): ScoreResult {
  let score = 0;

  if (data.sex === "M") {
    // Male scoring
    if (data.age >= 20 && data.age <= 34) score += -9;
    else if (data.age >= 35 && data.age <= 39) score += -4;
    else if (data.age >= 40 && data.age <= 44) score += 0;
    else if (data.age >= 45 && data.age <= 49) score += 3;
    else if (data.age >= 50 && data.age <= 54) score += 6;
    else if (data.age >= 55 && data.age <= 59) score += 8;
    else if (data.age >= 60 && data.age <= 64) score += 10;
    else if (data.age >= 65 && data.age <= 69) score += 11;
    else if (data.age >= 70 && data.age <= 74) score += 12;
    else if (data.age >= 75) score += 13;

    // Total cholesterol
    if (data.totalCholesterol < 160) score += 0;
    else if (data.totalCholesterol <= 199) score += 3;
    else if (data.totalCholesterol <= 239) score += 5;
    else if (data.totalCholesterol <= 279) score += 6;
    else score += 8;

    // Smoking
    if (data.smoker) {
      if (data.age >= 20 && data.age <= 39) score += 8;
      else if (data.age >= 40 && data.age <= 49) score += 5;
      else if (data.age >= 50 && data.age <= 59) score += 3;
      else if (data.age >= 60 && data.age <= 69) score += 1;
      else score += 1;
    }

    // HDL
    if (data.hdlCholesterol >= 60) score += -1;
    else if (data.hdlCholesterol >= 50) score += 0;
    else if (data.hdlCholesterol >= 40) score += 1;
    else score += 2;

    // Systolic BP
    if (data.systolicBP < 120) score += 0;
    else if (data.systolicBP <= 129) score += 0;
    else if (data.systolicBP <= 139) score += 1;
    else if (data.systolicBP <= 159) score += 1;
    else score += 2;

    if (data.treatedBP) {
      if (data.systolicBP < 120) score += 0;
      else if (data.systolicBP <= 129) score += 1;
      else if (data.systolicBP <= 139) score += 2;
      else if (data.systolicBP <= 159) score += 2;
      else score += 3;
    }
  } else {
    // Female scoring
    if (data.age >= 20 && data.age <= 34) score += -7;
    else if (data.age >= 35 && data.age <= 39) score += -3;
    else if (data.age >= 40 && data.age <= 44) score += 0;
    else if (data.age >= 45 && data.age <= 49) score += 3;
    else if (data.age >= 50 && data.age <= 54) score += 6;
    else if (data.age >= 55 && data.age <= 59) score += 8;
    else if (data.age >= 60 && data.age <= 64) score += 10;
    else if (data.age >= 65 && data.age <= 69) score += 12;
    else if (data.age >= 70 && data.age <= 74) score += 14;
    else if (data.age >= 75) score += 16;

    // Total cholesterol
    if (data.totalCholesterol < 160) score += 0;
    else if (data.totalCholesterol <= 199) score += 3;
    else if (data.totalCholesterol <= 239) score += 6;
    else if (data.totalCholesterol <= 279) score += 8;
    else score += 10;

    // Smoking
    if (data.smoker) {
      if (data.age >= 20 && data.age <= 39) score += 9;
      else if (data.age >= 40 && data.age <= 49) score += 7;
      else if (data.age >= 50 && data.age <= 59) score += 4;
      else if (data.age >= 60 && data.age <= 69) score += 2;
      else score += 1;
    }

    // HDL
    if (data.hdlCholesterol >= 60) score += -1;
    else if (data.hdlCholesterol >= 50) score += 0;
    else if (data.hdlCholesterol >= 40) score += 1;
    else score += 2;

    // Systolic BP
    if (data.systolicBP < 120) score += 0;
    else if (data.systolicBP <= 129) score += 1;
    else if (data.systolicBP <= 139) score += 2;
    else if (data.systolicBP <= 159) score += 3;
    else score += 4;

    if (data.treatedBP) {
      if (data.systolicBP < 120) score += 0;
      else if (data.systolicBP <= 129) score += 3;
      else if (data.systolicBP <= 139) score += 4;
      else if (data.systolicBP <= 159) score += 5;
      else score += 6;
    }
  }

  // Convert score to 10-year risk percentage
  let riskPercent: number;
  if (data.sex === "M") {
    if (score <= 0) riskPercent = 1;
    else if (score <= 4) riskPercent = 1;
    else if (score <= 6) riskPercent = 2;
    else if (score <= 7) riskPercent = 3;
    else if (score <= 8) riskPercent = 4;
    else if (score <= 9) riskPercent = 5;
    else if (score <= 10) riskPercent = 6;
    else if (score <= 11) riskPercent = 8;
    else if (score <= 12) riskPercent = 10;
    else if (score <= 13) riskPercent = 12;
    else if (score <= 14) riskPercent = 16;
    else if (score <= 15) riskPercent = 20;
    else if (score <= 16) riskPercent = 25;
    else riskPercent = 30;
  } else {
    if (score <= 9) riskPercent = 1;
    else if (score <= 12) riskPercent = 1;
    else if (score <= 14) riskPercent = 2;
    else if (score <= 15) riskPercent = 3;
    else if (score <= 16) riskPercent = 4;
    else if (score <= 17) riskPercent = 5;
    else if (score <= 18) riskPercent = 6;
    else if (score <= 19) riskPercent = 8;
    else if (score <= 20) riskPercent = 11;
    else if (score <= 21) riskPercent = 14;
    else if (score <= 22) riskPercent = 17;
    else if (score <= 23) riskPercent = 22;
    else riskPercent = 25;
  }

  let risk: ScoreResult["risk"];
  let description: string;
  let recommendations: string[];

  if (riskPercent < 5) {
    risk = "baixo";
    description = `Risco de 10 anos: ${riskPercent}%. Risco cardiovascular baixo.`;
    recommendations = [
      "Manter estilo de vida saudável",
      "Dieta balanceada e exercício regular",
      "Controle de peso",
      "Acompanhamento a cada 2-3 anos",
    ];
  } else if (riskPercent < 10) {
    risk = "moderado";
    description = `Risco de 10 anos: ${riskPercent}%. Risco cardiovascular moderado.`;
    recommendations = [
      "Intensificar mudanças no estilo de vida",
      "Considerar estatina se LDL > 130 mg/dL",
      "Controle rigoroso da pressão arterial",
      "Acompanhamento anual",
    ];
  } else if (riskPercent < 20) {
    risk = "alto";
    description = `Risco de 10 anos: ${riskPercent}%. Risco cardiovascular alto.`;
    recommendations = [
      "Iniciar estatina de alta intensidade",
      "Meta de LDL < 70 mg/dL",
      "Controle rigoroso da PA (<130/80)",
      "Avaliar necessidade de AAS",
      "Acompanhamento semestral",
    ];
  } else {
    risk = "muito_alto";
    description = `Risco de 10 anos: ${riskPercent}%. Risco cardiovascular muito alto.`;
    recommendations = [
      "Estatina de alta intensidade imediatamente",
      "Meta de LDL < 55 mg/dL",
      "Considerar adição de ezetimiba",
      "Controle agressivo de todos os fatores de risco",
      "Avaliar revascularização se indicada",
      "Acompanhamento trimestral",
    ];
  }

  return { score, risk, riskPercent: `${riskPercent}%`, description, recommendations };
}

// NYHA Classification Helper
export function getNYHAInfo(nyhaClass: number): { label: string; description: string; color: string } {
  switch (nyhaClass) {
    case 1:
      return {
        label: "NYHA I",
        description: "Sem limitação da atividade física. Atividades habituais não causam fadiga.",
        color: "green",
      };
    case 2:
      return {
        label: "NYHA II",
        description: "Ligeira limitação. Atividades habituais causam fadiga ou dispneia.",
        color: "yellow",
      };
    case 3:
      return {
        label: "NYHA III",
        description: "Marcada limitação. Menos que atividades habituais causam sintomas.",
        color: "orange",
      };
    case 4:
      return {
        label: "NYHA IV",
        description: "Incapacidade de realizar qualquer atividade sem desconforto. Sintomas em repouso.",
        color: "red",
      };
    default:
      return { label: "NYHA ?", description: "Classificação inválida", color: "gray" };
  }
}

// Killip Classification Helper
export function getKillipInfo(killipClass: number): { label: string; description: string; color: string } {
  switch (killipClass) {
    case 1:
      return {
        label: "Killip I",
        description: "Sem sinais de insuficiência cardíaca. Mortalidade ~6%.",
        color: "green",
      };
    case 2:
      return {
        label: "Killip II",
        description: "IC leve a moderada (crepitações, S3, estertores). Mortalidade ~17%.",
        color: "yellow",
      };
    case 3:
      return {
        label: "Killip III",
        description: "Edema pulmonar franco. Mortalidade ~38%.",
        color: "orange",
      };
    case 4:
      return {
        label: "Killip IV",
        description: "Choque cardiogênico. Mortalidade ~80%.",
        color: "red",
      };
    default:
      return { label: "Killip ?", description: "Classificação inválida", color: "gray" };
  }
}
