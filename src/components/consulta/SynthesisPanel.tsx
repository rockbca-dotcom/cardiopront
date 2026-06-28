"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Brain, FileText, MessageSquare, Pill, Stethoscope } from "lucide-react";

import type { ConsultationAIDraft } from "@/lib/consultation-ai";

interface SynthesisPanelProps {
  synthesis: ConsultationAIDraft | null;
}

export default function SynthesisPanel({ synthesis }: SynthesisPanelProps) {
  if (!synthesis) return null;

  return (
    <div className="card border-primary-200 bg-primary-50/30">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-surface-900">Síntese da consulta por IA</h3>
      </div>

      <p className="text-sm text-surface-600 mb-4">
        Revisão clínica estruturada da gravação. Os campos editáveis são refinados no painel de preenchimento guiado logo abaixo.
      </p>

      <div className="space-y-4">
        {synthesis.motivo_consulta && (
          <Section icon={<MessageSquare className="w-4 h-4" />} title="Motivo da consulta">
            <p className="text-sm text-surface-700">{synthesis.motivo_consulta}</p>
          </Section>
        )}

        {synthesis.queixa_principal && (
          <Section icon={<MessageSquare className="w-4 h-4" />} title="Queixa principal">
            <p className="text-sm text-surface-700">{synthesis.queixa_principal}</p>
          </Section>
        )}

        {synthesis.historia_doenca_atual && (
          <Section icon={<FileText className="w-4 h-4" />} title="História da doença atual">
            <p className="text-sm text-surface-700 whitespace-pre-line">{synthesis.historia_doenca_atual}</p>
          </Section>
        )}

        {synthesis.achados_relevantes.length > 0 && (
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Achados relevantes">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.achados_relevantes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        {synthesis.diagnosticos_suspeitos.length > 0 && (
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Diagnósticos suspeitos">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.diagnosticos_suspeitos.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        {synthesis.exames_pedidos.length > 0 && (
          <Section icon={<FileText className="w-4 h-4" />} title="Exames pedidos">
            <div className="space-y-2">
              {synthesis.exames_pedidos.map((exame, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-surface-700">
                  <span className="font-medium">{exame.tipo}</span>
                  {exame.indicacao && <span className="text-surface-500">— {exame.indicacao}</span>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {synthesis.conduta && (
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Conduta">
            <p className="text-sm text-surface-700 whitespace-pre-line">{synthesis.conduta}</p>
          </Section>
        )}

        {synthesis.medicamentos_ajustados.length > 0 && (
          <Section icon={<Pill className="w-4 h-4" />} title="Medicamentos ajustados">
            <div className="space-y-2">
              {synthesis.medicamentos_ajustados.map((medicamento, index) => (
                <div key={index} className="text-sm text-surface-700">
                  <span className="font-medium">{medicamento.nome}</span> — {medicamento.dose}
                  {medicamento.acao ? ` (${medicamento.acao})` : ""}
                </div>
              ))}
            </div>
          </Section>
        )}

        {synthesis.sinais_de_alerta.length > 0 && (
          <Section icon={<AlertTriangle className="w-4 h-4" />} title="Sinais de alerta" variant="warning">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.sinais_de_alerta.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Section>
        )}

        {synthesis.orientacoes_paciente && (
          <Section icon={<MessageSquare className="w-4 h-4" />} title="Orientações ao paciente">
            <p className="text-sm text-surface-700 whitespace-pre-line">{synthesis.orientacoes_paciente}</p>
          </Section>
        )}

        {synthesis.trechos_suporte.length > 0 && (
          <Section icon={<FileText className="w-4 h-4" />} title="Trechos de suporte">
            <ul className="list-disc list-inside text-sm text-surface-700 space-y-1">
              {synthesis.trechos_suporte.map((trecho, index) => (
                <li key={index}>{trecho}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
  variant = "default",
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
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
