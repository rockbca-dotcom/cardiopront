"use client";

import { AlertTriangle, X } from "lucide-react";

interface Interaction {
  drug1: string;
  drug2: string;
  severity: "leve" | "moderada" | "grave";
  description: string;
}

interface InteractionAlertProps {
  interactions: Interaction[];
  onDismiss: () => void;
}

const severityConfig = {
  leve: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: "text-blue-500", label: "Interacao leve" },
  moderada: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "text-amber-500", label: "Interacao moderada" },
  grave: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: "text-red-500", label: "Interacao grave" },
};

export default function InteractionAlert({ interactions, onDismiss }: InteractionAlertProps) {
  if (interactions.length === 0) return null;
  const maxSeverity = interactions.reduce((max, i) => {
    const levels = { leve: 1, moderada: 2, grave: 3 };
    return levels[i.severity] > levels[max] ? i.severity : max;
  }, "leve" as "leve" | "moderada" | "grave");
  const config = severityConfig[maxSeverity];

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 ${config.icon} shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`font-medium text-sm ${config.text}`}>{interactions.length} interacao(oes) detectada(s)</p>
          <ul className={`mt-2 space-y-1 text-xs ${config.text}`}>
            {interactions.map((interaction, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-medium">{interaction.drug1} + {interaction.drug2}:</span>
                <span>{interaction.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onDismiss} className={`${config.icon} hover:opacity-70`}><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export const knownInteractions = [
  { class1: "Anticoagulante", class2: "Antiagregante", severity: "grave" as const, desc: "Risco aumentado de sangramento. Monitorar INR." },
  { class1: "IECA", class2: "BRA", severity: "moderada" as const, desc: "Risco de hipercalemia. Monitorar K+." },
  { class1: "Beta-bloqueador", class2: "Bloqueador de Canais", severity: "moderada" as const, desc: "Risco de bradicardia." },
  { class1: "IECA", class2: "Diurético", severity: "moderada" as const, desc: "Risco de hipotensao." },
];

export function checkInteractions(selectedClasses: string[], allDrugs: Array<{ classe: string; principio_ativo: string }>) {
  const interactions: Interaction[] = [];
  for (let i = 0; i < selectedClasses.length; i++) {
    for (let j = i + 1; j < selectedClasses.length; j++) {
      const interaction = knownInteractions.find(
        (k) => (k.class1 === selectedClasses[i] && k.class2 === selectedClasses[j]) || (k.class1 === selectedClasses[j] && k.class2 === selectedClasses[i])
      );
      if (interaction) {
        const drug1 = allDrugs.find((d) => d.classe === selectedClasses[i]);
        const drug2 = allDrugs.find((d) => d.classe === selectedClasses[j]);
        if (drug1 && drug2) {
          interactions.push({ drug1: drug1.principio_ativo, drug2: drug2.principio_ativo, severity: interaction.severity, description: interaction.desc });
        }
      }
    }
  }
  return interactions;
}
