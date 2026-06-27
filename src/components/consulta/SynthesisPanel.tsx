"use client";

import { Brain, Stethoscope, FileText, Pill, AlertTriangle, MessageSquare } from "lucide-react";

interface SynthesisData {
  motivo_consulta?: string;
  achados_relevantes?: string[];
  diagnosticos_suspeitos?: string[];
  exames_pedidos?: Array<{ tipo: string; indicacao: string }>;
  conduta?: string;
  medicamentos_ajustados?: Array<{ nome: string; dose: string; acao: string }>;
  sinais_de_alerta?: string[];
  orientacoes_paciente?: string;
}

interface SynthesisPanelProps {
  synthesis: SynthesisData | null;
  onFillForm: (data: SynthesisData) => void;
}

export default function SynthesisPanel({ synthesis, onFillForm }: SynthesisPanelProps) {
  if (!synthesis) return null;

  return (
    <div className="card border-primary-200 bg-primary-50/30">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-surface-900">Síntese da consulta por IA</h3>
      </div>

      <div className="space-y-4">
        {synthesis.motivo_consulta && (
          <Section icon={<MessageSquare className="w-4 h-4" />} title="Motivo da consulta">
            <p className="text-sm text-surface-700">{synthesis.motivo_consulta}</p>
          </Section>
        )}

        {synthesis.achados_relevantes && synthesis.achados_relevantes.length > 0 && (
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Achados relevantes">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.achados_relevantes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        {synthesis.diagnosticos_suspeitos && synthesis.diagnosticos_suspeitos.length > 0 && (
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Diagnósticos suspeitos">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.diagnosticos_suspeitos.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        {synthesis.exames_pedidos && synthesis.exames_pedidos.length > 0 && (
          <Section icon={<FileText className="w-4 h-4" />} title="Exames pedidos">
            <div className="space-y-1">
              {synthesis.exames_pedidos.map((exame, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-surface-700">
                  <span className="font-medium">{exame.tipo}</span>
                  {exame.indicacao && <span className="text-surface-500">— {exame.indicacao}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {synthesis.conduta && (
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Conduta">
            <p className="text-sm text-surface-700">{synthesis.conduta}</p>
          </Section>
        )}

        {synthesis.medicamentos_ajustados && synthesis.medicamentos_ajustados.length > 0 && (
          <Section icon={<Pill className="w-4 h-4" />} title="Medicamentos ajustados">
            <div className="space-y-1">
              {synthesis.medicamentos_ajustados.map((med, i) => (
                <div key={i} className="text-sm text-surface-700">
                  <span className="font-medium">{med.nome}</span> — {med.dose} ({med.acao})
                </div>
              ))}
            </div>
          </Section>
        )}

        {synthesis.sinais_de_alerta && synthesis.sinais_de_alerta.length > 0 && (
          <Section icon={<AlertTriangle className="w-4 h-4" />} title="Sinais de alerta" variant="warning">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.sinais_de_alerta.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        {synthesis.orientacoes_paciente && (
          <Section icon={<MessageSquare className="w-4 h-4" />} title="Orientações ao paciente">
            <p className="text-sm text-surface-700">{synthesis.orientacoes_paciente}</p>
          </Section>
        )}
      </div>

      <button
        type="button"
        onClick={() => onFillForm(synthesis)}
        className="mt-4 btn-secondary w-full text-xs"
      >
        Preencher formulário com esta síntese
      </button>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "warning";
}) {
  return (
    <div className={`p-3 rounded-lg ${variant === "warning" ? "bg-amber-50 border border-amber-200" : "bg-white border border-surface-200"}`}>
      <div className="flex items-center gap-2 mb-2 text-surface-600">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}
