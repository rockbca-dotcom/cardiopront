"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Copy, ExternalLink, FileText, Pill, Sparkles } from "lucide-react";

import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import { buildConsultationFollowUpPlan } from "@/lib/consultation-followup";

interface ConsultationFollowUpPanelProps {
  consultationId: string;
  synthesis: ConsultationAIDraft | null;
}

export default function ConsultationFollowUpPanel({ consultationId, synthesis }: ConsultationFollowUpPanelProps) {
  const [copied, setCopied] = useState(false);
  const plan = useMemo(() => buildConsultationFollowUpPlan(synthesis), [synthesis]);

  if (!plan.medications.length && !plan.exams.length && !plan.referrals.length) {
    return null;
  }

  const prescriptionHref = buildFollowUpHref("/app/prescricao/nova", consultationId, plan.prescriptionSearch);
  const examHref = buildFollowUpHref("/app/exames/novo", consultationId, plan.examSearch);

  async function copyReferrals() {
    if (!plan.referralClipboardText) return;

    try {
      await navigator.clipboard.writeText(plan.referralClipboardText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Error copying referral text:", error);
    }
  }

  return (
    <div className="card border-primary-200 bg-primary-50/30 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Próximos passos
          </div>
          <h2 className="font-semibold text-surface-900">Preparar prescrição, exames e encaminhamentos</h2>
          <p className="text-sm text-surface-600 max-w-xl">
            Use esta consulta como ponto de partida para abrir os fluxos de prescrição e exames ou copiar um rascunho de encaminhamento.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <FollowUpBlock
          icon={<Pill className="w-4 h-4" />}
          title="Prescrição"
          description="Termos sugeridos pela síntese IA para abrir a receita com contexto clínico já posicionado."
          items={plan.medications.map((item) => ({
            label: item.nome,
            href: buildFollowUpHref("/app/prescricao/nova", consultationId, item.nome),
            detail: [item.dose, item.acao].filter(Boolean).join(" • "),
          }))}
          actionHref={prescriptionHref}
          actionLabel="Abrir prescrição"
        />

        <FollowUpBlock
          icon={<FileText className="w-4 h-4" />}
          title="Exames"
          description="Atalhos para pesquisar exames sugeridos pela IA e preencher a indicação clínica mais rápido."
          items={plan.exams.map((item) => ({
            label: item.tipo,
            href: buildFollowUpHref("/app/exames/novo", consultationId, item.tipo),
            detail: [item.categoria, item.indicacao].filter(Boolean).join(" • "),
          }))}
          actionHref={examHref}
          actionLabel="Abrir exames"
        />

        <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-surface-900">Encaminhamentos sugeridos</h3>
                <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-surface-600">
                  {plan.referrals.length} item(s)
                </span>
              </div>
              <p className="text-xs text-surface-500">
                Copie o rascunho para usar no encaminhamento posterior ou no resumo de alta.
              </p>
            </div>

            <button
              type="button"
              onClick={copyReferrals}
              className="btn-secondary h-9 px-4 text-xs whitespace-nowrap"
              disabled={!plan.referralClipboardText}
            >
              {copied ? "Copiado" : "Copiar texto"}
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {plan.referrals.length > 0 ? (
              plan.referrals.map((referral) => (
                <div key={`${referral.especialidade}-${referral.justificativa}`} className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs text-surface-700">
                  <span className="font-semibold text-surface-900">{referral.especialidade}</span>
                  {referral.prioridade && <span className="text-surface-500"> · {referral.prioridade}</span>}
                </div>
              ))
            ) : (
              <p className="text-sm text-surface-500">Nenhum encaminhamento sugerido pela IA.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <Link href={prescriptionHref} className="btn-primary text-xs h-10 px-4">
          <ExternalLink className="w-3.5 h-3.5" />
          Prescrição principal
        </Link>
        <Link href={examHref} className="btn-secondary text-xs h-10 px-4">
          <ArrowRight className="w-3.5 h-3.5" />
          Exames principais
        </Link>
      </div>
    </div>
  );
}

function FollowUpBlock({
  icon,
  title,
  description,
  items,
  actionHref,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: Array<{ label: string; href: string; detail?: string }>;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-surface-900">{title}</h3>
          </div>
          <p className="text-xs text-surface-500 max-w-xl">{description}</p>
        </div>

        <Link href={actionHref} className="btn-secondary h-9 px-4 text-xs whitespace-nowrap">
          {actionLabel}
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex flex-col gap-0.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs text-primary-700 hover:bg-primary-100 transition-colors"
            >
              <span className="font-semibold">{item.label}</span>
              {item.detail && <span className="text-[11px] text-primary-600/80">{item.detail}</span>}
            </Link>
          ))
        ) : (
          <p className="text-sm text-surface-500">Nenhuma sugestão estruturada para este bloco.</p>
        )}
      </div>
    </div>
  );
}

function buildFollowUpHref(basePath: string, consultationId: string, search?: string) {
  const params = new URLSearchParams();
  params.set("consulta_id", consultationId);
  if (search?.trim()) {
    params.set("search", search.trim());
  }
  return `${basePath}?${params.toString()}`;
}
