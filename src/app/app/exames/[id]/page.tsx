"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Microscope, User } from "lucide-react";

import PdfDocumentActions from "@/components/documentos/PdfDocumentActions";
import ExamPdf from "@/components/documentos/ExamPdf";
import { getSession } from "@/lib/auth";
import { formatDatePtBr } from "@/lib/pdf-standard";

interface DoctorProfile {
  nome: string;
  crm: string;
  crmUf: string;
  especialidade?: string | null;
  telefone?: string | null;
  assinatura_data_url?: string | null;
}

interface ExamItem {
  id: string;
  consulta_id: string;
  paciente_id: string;
  tipo_exame_id: string;
  prioridade: string;
  indicacao_clinica: string | null;
  data_pedido: string;
  data_resultado: string | null;
  resultado_texto: string | null;
  resultado_valores: unknown;
  status: string;
  tipo_exame_nome: string;
  tipo_exame_categoria: string;
  tipo_exame_descricao?: string | null;
  tipo_exame_codigo_tus?: string | null;
}

interface ConsultationBundle {
  id: string;
  data_consulta: string;
  tipo: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  diagnostico: string | null;
  conduta: string | null;
  orientacoes: string | null;
  pacientes?: {
    id: string;
    nome: string;
    nascimento: string | null;
    sexo: string | null;
    cpf: string | null;
    telefone: string | null;
    email: string | null;
  } | null;
}

export default function ExameDetalhePage() {
  const params = useParams<{ id: string }>();
  const consultaId = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [consulta, setConsulta] = useState<ConsultationBundle | null>(null);
  const [items, setItems] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadPage();
  }, [consultaId]);

  async function loadPage() {
    if (!consultaId) return;
    setLoading(true);
    setError("");

    try {
      const [session, response] = await Promise.all([
        getSession(),
        fetch(`/api/exames/${consultaId}`, { credentials: "include", cache: "no-store" }),
      ]);

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar exames");
      }

      setDoctor(
        session?.user?.medico
          ? {
              nome: session.user.medico.nome,
              crm: session.user.medico.crm,
              crmUf: session.user.medico.crm_uf,
              especialidade: session.user.medico.especialidade,
              telefone: session.user.medico.telefone,
              assinatura_data_url: session.user.medico.assinatura_data_url,
            }
          : null,
      );
      setConsulta(data.consulta || null);
      setItems(data.exames || []);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Erro ao carregar exames";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const dateLabel = consulta?.data_consulta ? formatDatePtBr(consulta.data_consulta) : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/app/exames" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar para exames
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Detalhe do pedido de exames</h1>
          <p className="text-surface-600 mt-1">Baixe o PDF padronizado ou abra para impressão.</p>
        </div>

        <Link href="/app/exames/novo" className="btn-primary self-start">
          <FileText className="w-4 h-4" /> Novo pedido
        </Link>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando exames...</p>
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 text-center py-12">
          <p className="text-red-700 font-medium">{error}</p>
          <Link href="/app/exames" className="btn-secondary mt-4 inline-flex">
            Voltar para a lista
          </Link>
        </div>
      ) : !consulta ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Pedido de exames não encontrado.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <MetricCard label="Data" value={dateLabel || "—"} />
            <MetricCard label="Paciente" value={consulta.pacientes?.nome || "—"} />
            <MetricCard label="Exames" value={items.length} />
            <MetricCard label="Vínculo" value={`Consulta #${consulta.id}`} />
          </div>

          <div className="card space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
                  <Microscope className="w-3.5 h-3.5" />
                  Documento padronizado
                </div>
                <p className="text-sm text-surface-600 mt-3">
                  A consulta vinculada pode ser revisada junto com os exames e o PDF pode ser baixado ou impresso.
                </p>
              </div>

              {doctor && (
                <PdfDocumentActions
                  document={<ExamPdf doctor={doctor} consultation={consulta} exams={items} />}
                  fileName={`exames-${consulta.id}-${dateLabel || new Date().toISOString().split("T")[0]}.pdf`}
                />
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoField label="Consulta" value={new Date(consulta.data_consulta).toLocaleString("pt-BR")} />
              <InfoField label="Tipo" value={consulta.tipo || "presencial"} />
              <InfoField label="Motivo" value={consulta.motivo_consulta || "—"} wide />
              <InfoField label="Diagnóstico" value={consulta.diagnostico || "—"} wide />
            </div>
          </div>

          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-surface-900">Paciente</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
              <InfoField label="Nome" value={consulta.pacientes?.nome || "—"} />
              <InfoField label="Nascimento" value={consulta.pacientes?.nascimento ? new Date(consulta.pacientes.nascimento).toLocaleDateString("pt-BR") : "—"} />
              <InfoField label="Sexo" value={consulta.pacientes?.sexo || "—"} />
              <InfoField label="Telefone" value={consulta.pacientes?.telefone || "—"} />
              <InfoField label="CPF" value={consulta.pacientes?.cpf || "—"} />
              <InfoField label="E-mail" value={consulta.pacientes?.email || "—"} />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <article key={item.id} className="card space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <Microscope className="w-4 h-4 text-primary-500" />
                      <p className="font-medium text-surface-900">{index + 1}. {item.tipo_exame_nome}</p>
                    </div>
                    <p className="text-xs text-surface-500 mt-1">Pedido emitido em {item.data_pedido ? new Date(item.data_pedido).toLocaleDateString("pt-BR") : "—"}</p>
                  </div>

                  <span className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-xs font-medium text-surface-600">
                    {item.prioridade}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                  <InfoField label="Categoria" value={item.tipo_exame_categoria || "—"} />
                  <InfoField label="Código TUSS" value={item.tipo_exame_codigo_tus || "—"} />
                  <InfoField label="Indicação clínica" value={item.indicacao_clinica || "—"} wide />
                  <InfoField label="Status" value={item.status || "—"} />
                  <InfoField label="Descrição do exame" value={item.tipo_exame_descricao || "—"} wide />
                  <InfoField label="Resultado textual" value={item.resultado_texto || "—"} wide />
                  <InfoField label="Dados do resultado" value={item.resultado_valores ? JSON.stringify(item.resultado_valores, null, 2) : "—"} wide />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-surface-900 break-words">{value}</p>
    </div>
  );
}

function InfoField({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2 rounded-xl border border-surface-200 bg-surface-50 p-3" : "rounded-xl border border-surface-200 bg-surface-50 p-3"}>
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-1 text-sm text-surface-800 whitespace-pre-line leading-6">{value}</p>
    </div>
  );
}
