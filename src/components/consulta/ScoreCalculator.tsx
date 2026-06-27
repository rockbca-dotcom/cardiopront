"use client";

import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  calculateCHA2DS2VASc as calcCHA2DS2VASc,
  calculateHASBLED as calcHASBLED,
  calculateFramingham as calcFramingham,
  getNYHAInfo,
  getKillipInfo,
  type ScoreResult,
} from "@/lib/cardioScores";

type ScoreType = "cha2ds2vasc" | "hasbled" | "framingham" | "nyha" | "killip";

interface ScoreCalculatorProps {
  patientData?: {
    age?: number;
    sex?: "M" | "F";
    heartFailure?: boolean;
    hypertension?: boolean;
    diabetes?: boolean;
    strokeHistory?: boolean;
    renalDisease?: boolean;
    liverDisease?: boolean;
    bleedingHistory?: boolean;
    vascularDisease?: boolean;
    totalCholesterol?: number;
    hdlCholesterol?: number;
    systolicBP?: number;
    treatedBP?: boolean;
    smoker?: boolean;
  };
  onScoreCalculated?: (type: ScoreType, result: ScoreResult) => void;
}

const riskColors = {
  baixo: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", badge: "bg-green-100 text-green-800" },
  moderado: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-100 text-amber-800" },
  alto: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", badge: "bg-orange-100 text-orange-800" },
  muito_alto: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", badge: "bg-red-100 text-red-800" },
};

export default function ScoreCalculator({ patientData, onScoreCalculated }: ScoreCalculatorProps) {
  const [activeScore, setActiveScore] = useState<ScoreType | null>(null);
  const [results, setResults] = useState<Partial<Record<ScoreType, ScoreResult>>>({});

  // CHA₂DS₂-VASc state
  const [cha2ds2, setCha2ds2] = useState({
    age: patientData?.age || 65,
    sex: (patientData?.sex || "M") as "M" | "F",
    heartFailure: patientData?.heartFailure || false,
    hypertension: patientData?.hypertension || false,
    diabetes: patientData?.diabetes || false,
    strokeTIA: patientData?.strokeHistory || false,
    vascularDisease: patientData?.vascularDisease || false,
  });

  // HAS-BLED state
  const [hasbled, setHasbled] = useState({
    hypertension: patientData?.hypertension || false,
    renalDisease: patientData?.renalDisease || false,
    liverDisease: patientData?.liverDisease || false,
    strokeHistory: patientData?.strokeHistory || false,
    bleedingHistory: patientData?.bleedingHistory || false,
    labileINR: false,
    age65: (patientData?.age || 0) >= 65,
    drugs: false,
    alcohol: false,
  });

  // Framingham state
  const [framingham, setFramingham] = useState({
    age: patientData?.age || 55,
    sex: (patientData?.sex || "M") as "M" | "F",
    totalCholesterol: patientData?.totalCholesterol || 200,
    hdlCholesterol: patientData?.hdlCholesterol || 50,
    systolicBP: patientData?.systolicBP || 130,
    treatedBP: patientData?.treatedBP || false,
    smoker: patientData?.smoker || false,
    diabetes: patientData?.diabetes || false,
  });

  // NYHA/Killip state
  const [nyhaClass, setNyhaClass] = useState(2);
  const [killipClass, setKillipClass] = useState(1);

  function calculateCHA2DS2VASc() {
    const result = calcCHA2DS2VASc(cha2ds2);
    setResults({ ...results, cha2ds2vasc: result });
    onScoreCalculated?.("cha2ds2vasc", result);
  }

  function calculateHASBLED() {
    const result = calcHASBLED(hasbled);
    setResults({ ...results, hasbled: result });
    onScoreCalculated?.("hasbled", result);
  }

  function calculateFramingham() {
    const result = calcFramingham(framingham);
    setResults({ ...results, framingham: result });
    onScoreCalculated?.("framingham", result);
  }

  function toggleScore(type: ScoreType) {
    setActiveScore(activeScore === type ? null : type);
  }

  const nyhaInfo = getNYHAInfo(nyhaClass);
  const killipInfo = getKillipInfo(killipClass);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-primary-600" />
        <h2 className="font-semibold text-surface-900">Escores Cardiovasculares</h2>
      </div>

      {/* CHA₂DS₂-VASc */}
      <ScoreCard
        title="CHA₂DS₂-VASc"
        subtitle="Risco de AVC na Fibrilação Atrial"
        isActive={activeScore === "cha2ds2vasc"}
        onToggle={() => toggleScore("cha2ds2vasc")}
        result={results.cha2ds2vasc}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="label text-xs">Idade</label>
            <input
              type="number"
              value={cha2ds2.age}
              onChange={(e) => setCha2ds2({ ...cha2ds2, age: parseInt(e.target.value) || 0 })}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="label text-xs">Sexo</label>
            <select
              value={cha2ds2.sex}
              onChange={(e) => setCha2ds2({ ...cha2ds2, sex: e.target.value as "M" | "F" })}
              className="input-field text-sm"
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Checkbox label="Insuficiência Cardíaca" checked={cha2ds2.heartFailure} onChange={(v) => setCha2ds2({ ...cha2ds2, heartFailure: v })} />
          <Checkbox label="Hipertensão" checked={cha2ds2.hypertension} onChange={(v) => setCha2ds2({ ...cha2ds2, hypertension: v })} />
          <Checkbox label="Diabetes" checked={cha2ds2.diabetes} onChange={(v) => setCha2ds2({ ...cha2ds2, diabetes: v })} />
          <Checkbox label="AVC/TIA prévio" checked={cha2ds2.strokeTIA} onChange={(v) => setCha2ds2({ ...cha2ds2, strokeTIA: v })} />
          <Checkbox label="Doença Vascular" checked={cha2ds2.vascularDisease} onChange={(v) => setCha2ds2({ ...cha2ds2, vascularDisease: v })} />
        </div>
        <button onClick={calculateCHA2DS2VASc} className="btn-primary w-full mt-3 text-sm">
          Calcular CHA₂DS₂-VASc
        </button>
      </ScoreCard>

      {/* HAS-BLED */}
      <ScoreCard
        title="HAS-BLED"
        subtitle="Risco de Sangramento com Anticoagulação"
        isActive={activeScore === "hasbled"}
        onToggle={() => toggleScore("hasbled")}
        result={results.hasbled}
      >
        <div className="grid grid-cols-2 gap-2">
          <Checkbox label="Hipertensão (PA >160)" checked={hasbled.hypertension} onChange={(v) => setHasbled({ ...hasbled, hypertension: v })} />
          <Checkbox label="Doença Renal" checked={hasbled.renalDisease} onChange={(v) => setHasbled({ ...hasbled, renalDisease: v })} />
          <Checkbox label="Doença Hepática" checked={hasbled.liverDisease} onChange={(v) => setHasbled({ ...hasbled, liverDisease: v })} />
          <Checkbox label="AVC prévio" checked={hasbled.strokeHistory} onChange={(v) => setHasbled({ ...hasbled, strokeHistory: v })} />
          <Checkbox label="Sangramento prévio" checked={hasbled.bleedingHistory} onChange={(v) => setHasbled({ ...hasbled, bleedingHistory: v })} />
          <Checkbox label="INR instável" checked={hasbled.labileINR} onChange={(v) => setHasbled({ ...hasbled, labileINR: v })} />
          <Checkbox label="Idade ≥65" checked={hasbled.age65} onChange={(v) => setHasbled({ ...hasbled, age65: v })} />
          <Checkbox label="Drogas (AAS/Clopidogrel)" checked={hasbled.drugs} onChange={(v) => setHasbled({ ...hasbled, drugs: v })} />
          <Checkbox label="Álcool (≥8 doses/semana)" checked={hasbled.alcohol} onChange={(v) => setHasbled({ ...hasbled, alcohol: v })} />
        </div>
        <button onClick={calculateHASBLED} className="btn-primary w-full mt-3 text-sm">
          Calcular HAS-BLED
        </button>
      </ScoreCard>

      {/* Framingham */}
      <ScoreCard
        title="Framingham"
        subtitle="Risco Cardiovascular em 10 anos"
        isActive={activeScore === "framingham"}
        onToggle={() => toggleScore("framingham")}
        result={results.framingham}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="label text-xs">Idade</label>
            <input type="number" value={framingham.age} onChange={(e) => setFramingham({ ...framingham, age: parseInt(e.target.value) || 0 })} className="input-field text-sm" />
          </div>
          <div>
            <label className="label text-xs">Sexo</label>
            <select value={framingham.sex} onChange={(e) => setFramingham({ ...framingham, sex: e.target.value as "M" | "F" })} className="input-field text-sm">
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <div>
            <label className="label text-xs">Colesterol Total (mg/dL)</label>
            <input type="number" value={framingham.totalCholesterol} onChange={(e) => setFramingham({ ...framingham, totalCholesterol: parseInt(e.target.value) || 0 })} className="input-field text-sm" />
          </div>
          <div>
            <label className="label text-xs">HDL (mg/dL)</label>
            <input type="number" value={framingham.hdlCholesterol} onChange={(e) => setFramingham({ ...framingham, hdlCholesterol: parseInt(e.target.value) || 0 })} className="input-field text-sm" />
          </div>
          <div>
            <label className="label text-xs">PA Sistólica (mmHg)</label>
            <input type="number" value={framingham.systolicBP} onChange={(e) => setFramingham({ ...framingham, systolicBP: parseInt(e.target.value) || 0 })} className="input-field text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox label="PA tratada" checked={framingham.treatedBP} onChange={(v) => setFramingham({ ...framingham, treatedBP: v })} />
            <Checkbox label="Tabagista" checked={framingham.smoker} onChange={(v) => setFramingham({ ...framingham, smoker: v })} />
          </div>
        </div>
        <button onClick={calculateFramingham} className="btn-primary w-full mt-3 text-sm">
          Calcular Framingham
        </button>
      </ScoreCard>

      {/* NYHA */}
      <ScoreCard
        title="NYHA"
        subtitle="Classificação Funcional da Insuficiência Cardíaca"
        isActive={activeScore === "nyha"}
        onToggle={() => toggleScore("nyha")}
      >
        <div>
          <label className="label text-xs">Classe NYHA</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4].map((cls) => (
              <button
                key={cls}
                onClick={() => setNyhaClass(cls)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  nyhaClass === cls
                    ? "bg-primary-600 text-white"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                Classe {cls}
              </button>
            ))}
          </div>
          <div className={`mt-3 p-3 rounded-lg border ${riskColors[nyhaInfo.color as keyof typeof riskColors]?.bg || "bg-gray-50"} ${riskColors[nyhaInfo.color as keyof typeof riskColors]?.border || "border-gray-200"}`}>
            <p className="font-medium text-sm text-surface-900">{nyhaInfo.label}</p>
            <p className="text-xs text-surface-600 mt-1">{nyhaInfo.description}</p>
          </div>
        </div>
      </ScoreCard>

      {/* Killip */}
      <ScoreCard
        title="Killip"
        subtitle="Classificação de Gravidade no IAM"
        isActive={activeScore === "killip"}
        onToggle={() => toggleScore("killip")}
      >
        <div>
          <label className="label text-xs">Classe Killip</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4].map((cls) => (
              <button
                key={cls}
                onClick={() => setKillipClass(cls)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  killipClass === cls
                    ? "bg-primary-600 text-white"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                Classe {cls}
              </button>
            ))}
          </div>
          <div className={`mt-3 p-3 rounded-lg border ${riskColors[killipInfo.color as keyof typeof riskColors]?.bg || "bg-gray-50"} ${riskColors[killipInfo.color as keyof typeof riskColors]?.border || "border-gray-200"}`}>
            <p className="font-medium text-sm text-surface-900">{killipInfo.label}</p>
            <p className="text-xs text-surface-600 mt-1">{killipInfo.description}</p>
          </div>
        </div>
      </ScoreCard>
    </div>
  );
}

function ScoreCard({
  title,
  subtitle,
  isActive,
  onToggle,
  result,
  children,
}: {
  title: string;
  subtitle: string;
  isActive: boolean;
  onToggle: () => void;
  result?: ScoreResult;
  children: React.ReactNode;
}) {
  const colors = result ? riskColors[result.risk] : null;

  return (
    <div className={`card ${colors ? `${colors.border} ${colors.bg}` : ""}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <p className="font-medium text-surface-900 text-sm">{title}</p>
          <p className="text-xs text-surface-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <span className={`badge ${colors?.badge}`}>
              {result.score} pts — {result.risk}
            </span>
          )}
          {isActive ? (
            <ChevronUp className="w-4 h-4 text-surface-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-surface-400" />
          )}
        </div>
      </button>

      {isActive && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          {children}

          {result && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-surface-200">
              <div className="flex items-center gap-2 mb-2">
                {result.risk === "baixo" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className={`w-4 h-4 ${result.risk === "muito_alto" ? "text-red-500" : "text-amber-500"}`} />
                )}
                <span className="font-semibold text-sm text-surface-900">
                  Score: {result.score} — Risco {result.risk.toUpperCase()}
                  {result.riskPercent && ` (${result.riskPercent}/ano)`}
                </span>
              </div>
              <p className="text-xs text-surface-600 mb-2">{result.description}</p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-700 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Recomendações:
                </p>
                <ul className="text-xs text-surface-600 space-y-1 ml-4">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="list-disc">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
      />
      <span className="text-xs text-surface-700">{label}</span>
    </label>
  );
}
