"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, AlertTriangle, Activity, CalendarClock, FileText, Mic, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { calculateAge, calculateBodyMassIndex, formatDatePtBr, formatDateTimePtBr } from "@/lib/patient-history";

interface PatientDetail {
  id: number;
  nome: string;
  nascimento: string;
  sexo: string | null;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  tipo_sanguineo: string | null;
  peso_kg: number | null;
  altura_cm: number | null;
  alergias: string | null;
}

interface ConsultationHistoryItem {
  id: number;
  data_consulta: string;
  tipo: string | null;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  historia_doenca_atual: string | null;
  historia_familiar_cardiovascular: string | null;
  pa_sistolica: number | null;
  pa_diastolica: number | null;
  fc: number | null;
  fr: number | null;
  temp_celsius: number | null;
  saturacao_o2: number | null;
  peso_kg: number | null;
  altura_cm: number | null;
  imc: number | null;
  exame_fisico_geral: string | null;
  diagnostico: string | null;
  cid10: string | null;
  conduta: string | null;
  orientacoes: string | null;
  audio_url: string | null;
  transcricao_completa: string | null;
  sintese_ia: string | null;
  criado_em: string | null;
}

interface ExamHistoryItem {
  id: number;
  consulta_id: number;
  paciente_id: number;
  tipo_exame_id: number;
  prioridade: string | null;
  indicacao_clinica: string | null;
  data_pedido: string;
  data_resultado: string | null;
  resultado_texto: string | null;
  resultado_valores: unknown;
  status: string | null;
  tipos_exame: { nome: string; categoria: string } | null;
  consulta_data_consulta: string | null;
}

interface PrescriptionHistoryItem {
  id: number;
  consulta_id: number;
  paciente_id: number;
  data_prescricao: string;
  validade_dias: number | null;
  medicamento: string;
  principio_ativo: string | null;
  dose: string | null;
  unidade: string | null;
  frequencia: string | null;
  posologia: string | null;
  via: string | null;
  advertencias: string | null;
  consulta_data_consulta: string | null;
}

interface PatientHistoryResponse {
  paciente: PatientDetail;
  historico: {
    consultas: ConsultationHistoryItem[];
    exames: ExamHistoryItem[];
    prescricoes: PrescriptionHistoryItem[];
  };
}

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const patientId = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [data, setData] = useState<PatientHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) return;

    async function fetchPatient() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/pacientes/${patientId}`, {
          credentials: "include",
          cache: "no-store",
        });
        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(payload.error || "Erro ao carregar paciente");
        }

        setData(payload as PatientHistoryResponse);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : "Erro ao carregar paciente";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [patientId]);

  const patient = data?.paciente ?? null;
  const consultas = data?.historico.consultas ?? [];
  const exames = data?.historico.exames ?? [];
  const prescricoes = data?.historico.prescricoes ?? [];
  const age = calculateAge(patient?.nascimento);
  const bmi = calculateBodyMassIndex(patient?.peso_kg, patient?.altura_cm);
  const lastConsultation = consultas[0]?.data_consulta ?? null;
  const lastExam = exames[0]?.data_pedido ?? null;
  const lastPrescription = prescricoes[0]?.data_prescricao ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Link href="/app/pacientes" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar para pacientes
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Dados do paciente</h1>
          <p className="text-surface-600 mt-1">Consulta, exames, prescrições e áudios gravados em uma única página.</p>
        </div>

        {patient && (
          <Link href="/app/consultas/nova" className="btn-primary">
            <FileText className="w-4 h-4" /> Nova consulta
          </Link>
        )}
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando dados do paciente...</p>
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 text-center py-12">
          <p className="text-red-700 font-medium">{error}</p>
          <Link href="/app/pacientes" className="btn-secondary mt-4 inline-flex">
            Voltar para a lista
          </Link>
        </div>
      ) : !patient ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Paciente não encontrado.</p>
          <Link href="/app/pacientes" className="btn-secondary mt-4 inline-flex">
            Voltar para a lista
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <MetricCard label="Consultas" value={String(consultas.length)} subvalue={lastConsultation ? formatDateTimePtBr(lastConsultation) : "Sem consultas"} />
            <MetricCard label="Exames" value={String(exames.length)} subvalue={lastExam ? formatDatePtBr(lastExam) : "Sem exames"} />
            <MetricCard label="Prescrições" value={String(prescricoes.length)} subvalue={lastPrescription ? formatDatePtBr(lastPrescription) : "Sem prescrições"} />
            <MetricCard label="Idade" value={age !== null ? `${age} anos` : "—"} subvalue={patient.nascimento ? formatDatePtBr(patient.nascimento) : "Nascimento não informado"} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <section className="card">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                      <User className="w-3.5 h-3.5" /> Perfil do paciente
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-surface-900">Dados cadastrais</h2>
                    <p className="text-sm text-surface-500 mt-1">Informações básicas e dados clínicos de cadastro.</p>
                  </div>
                  <div className="rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-wide text-surface-500">Paciente</p>
                    <p className="text-base font-semibold text-surface-900">{patient.nome}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoField label="Nome completo" value={patient.nome} />
                  <InfoField label="Sexo" value={formatSexo(patient.sexo)} />
                  <InfoField label="CPF" value={patient.cpf || "—"} />
                  <InfoField label="Telefone" value={patient.telefone || "—"} />
                  <InfoField label="E-mail" value={patient.email || "—"} />
                  <InfoField label="Tipo sanguíneo" value={patient.tipo_sanguineo || "—"} />
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <MetricMini label="Peso" value={formatNumberWithUnit(patient.peso_kg, "kg")} />
                  <MetricMini label="Altura" value={formatHeight(patient.altura_cm)} />
                  <MetricMini label="IMC" value={bmi !== null ? `${bmi}` : "—"} />
                  <MetricMini label="Idade" value={age !== null ? `${age} anos` : "—"} />
                </div>

                {patient.alergias && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <p className="text-sm font-semibold text-surface-900">Alergias e alertas</p>
                    </div>
                    <p className="text-sm text-surface-700 leading-6 whitespace-pre-line">{patient.alergias}</p>
                  </div>
                )}
              </section>

              <section className="card">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-700">
                      <CalendarClock className="w-3.5 h-3.5" /> Histórico clínico
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-surface-900">Consultas</h2>
                    <p className="text-sm text-surface-500 mt-1">Linha do tempo com datas, áudio gravado e transcrição.</p>
                  </div>
                </div>

                {consultas.length === 0 ? (
                  <EmptyState title="Nenhuma consulta registrada" description="Quando houver consultas, elas aparecerão aqui com áudio e transcrição." />
                ) : (
                  <div className="space-y-4">
                    {consultas.map((consulta) => (
                      <article key={consulta.id} className="rounded-2xl border border-surface-200 bg-surface-50 p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                                {formatDateTimePtBr(consulta.data_consulta)}
                              </span>
                              <span className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-medium text-surface-600 capitalize">
                                {consulta.tipo || "presencial"}
                              </span>
                              {consulta.audio_url && (
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  Áudio gravado
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-semibold text-surface-900">
                              {consulta.motivo_consulta || consulta.queixa_principal || "Consulta sem título"}
                            </h3>
                            <p className="text-sm text-surface-600 leading-6">
                              {consulta.diagnostico ? <span><strong>Diagnóstico:</strong> {consulta.diagnostico}</span> : "Diagnóstico não informado"}
                            </p>
                          </div>

                          <Link href={`/app/consultas/${consulta.id}`} className="btn-secondary shrink-0 text-xs">
                            Abrir consulta
                          </Link>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 text-sm">
                          <InfoField label="Queixa principal" value={consulta.queixa_principal || "—"} />
                          <InfoField label="Conduta" value={consulta.conduta || "—"} />
                          <InfoField label="Orientações" value={consulta.orientacoes || "—"} wide />
                          <InfoField label="Exame físico" value={consulta.exame_fisico_geral || "—"} wide />
                        </div>

                        {consulta.audio_url ? (
                          <div className="space-y-2 rounded-2xl border border-surface-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-surface-800">
                              <Mic className="w-4 h-4 text-primary-600" />
                              Áudio da consulta
                            </div>
                            <audio controls src={consulta.audio_url} className="w-full" />
                            <a href={consulta.audio_url} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-primary-700 hover:text-primary-800">
                              Abrir arquivo de áudio
                            </a>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-surface-200 bg-white p-4 text-sm text-surface-500">
                            Nenhum áudio anexado para esta consulta.
                          </div>
                        )}

                        {consulta.transcricao_completa && (
                          <details className="rounded-2xl border border-surface-200 bg-white p-4">
                            <summary className="cursor-pointer text-sm font-medium text-surface-700">
                              Ver transcrição completa
                            </summary>
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-surface-700">
                              {consulta.transcricao_completa}
                            </p>
                          </details>
                        )}

                        {consulta.sintese_ia && (
                          <details className="rounded-2xl border border-surface-200 bg-white p-4">
                            <summary className="cursor-pointer text-sm font-medium text-surface-700">
                              Síntese por IA
                            </summary>
                            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-surface-700">
                              {stringifySynthesis(consulta.sintese_ia)}
                            </pre>
                          </details>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section className="card">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-700">
                      <Activity className="w-3.5 h-3.5" /> Exames
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-surface-900">Histórico de exames</h2>
                  </div>
                </div>

                {exames.length === 0 ? (
                  <EmptyState title="Nenhum exame pedido" description="Os exames solicitados nas consultas aparecerão aqui com as respectivas datas." />
                ) : (
                  <div className="space-y-4">
                    {exames.map((exame) => (
                      <article key={exame.id} className="rounded-2xl border border-surface-200 bg-surface-50 p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="font-semibold text-surface-900">
                              {exame.tipos_exame?.nome || "Exame"}
                            </p>
                            <p className="text-xs text-surface-500">
                              {exame.tipos_exame?.categoria ? exame.tipos_exame.categoria : "Sem categoria"}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(exame.status)}`}>
                            {statusLabel(exame.status)}
                          </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 text-sm">
                          <InfoField label="Solicitado em" value={formatDatePtBr(exame.data_pedido)} />
                          <InfoField label="Resultado em" value={formatDatePtBr(exame.data_resultado)} />
                          <InfoField label="Prioridade" value={priorityLabel(exame.prioridade)} />
                          <InfoField label="Consulta de origem" value={exame.consulta_data_consulta ? formatDateTimePtBr(exame.consulta_data_consulta) : "—"} />
                        </div>

                        {exame.indicacao_clinica && (
                          <div className="rounded-xl border border-surface-200 bg-white p-3 text-sm text-surface-700 leading-6">
                            <strong>Indicação clínica:</strong> {exame.indicacao_clinica}
                          </div>
                        )}

                        {exame.resultado_texto && (
                          <details className="rounded-xl border border-surface-200 bg-white p-3">
                            <summary className="cursor-pointer text-sm font-medium text-surface-700">Resultado textual</summary>
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-surface-700">{exame.resultado_texto}</p>
                          </details>
                        )}

                        {Boolean(exame.resultado_valores) && (
                          <details className="rounded-xl border border-surface-200 bg-white p-3">
                            <summary className="cursor-pointer text-sm font-medium text-surface-700">Valores do resultado</summary>
                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-surface-700">
                              {JSON.stringify(exame.resultado_valores, null, 2)}
                            </pre>
                          </details>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="card">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-700">
                      <FileText className="w-3.5 h-3.5" /> Prescrições
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-surface-900">Histórico de prescrições</h2>
                  </div>
                </div>

                {prescricoes.length === 0 ? (
                  <EmptyState title="Nenhuma prescrição emitida" description="As prescrições e receitas geradas para este paciente aparecerão aqui." />
                ) : (
                  <div className="space-y-4">
                    {prescricoes.map((prescricao) => (
                      <article key={prescricao.id} className="rounded-2xl border border-surface-200 bg-surface-50 p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="font-semibold text-surface-900">{prescricao.medicamento}</p>
                            <p className="text-xs text-surface-500">
                              {formatDatePtBr(prescricao.data_prescricao)}
                              {prescricao.via ? ` · via ${prescricao.via}` : ""}
                            </p>
                          </div>
                          <Link href={`/app/consultas/${prescricao.consulta_id}`} className="btn-secondary shrink-0 text-xs">
                            Abrir consulta
                          </Link>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 text-sm">
                          <InfoField label="Dose" value={prescricao.dose ? `${prescricao.dose}${prescricao.unidade ? ` ${prescricao.unidade}` : ""}` : "—"} />
                          <InfoField label="Frequência" value={prescricao.frequencia || "—"} />
                          <InfoField label="Posologia" value={prescricao.posologia || "—"} wide />
                          <InfoField label="Consulta de origem" value={prescricao.consulta_data_consulta ? formatDateTimePtBr(prescricao.consulta_data_consulta) : "—"} />
                        </div>

                        {prescricao.principio_ativo && (
                          <p className="text-sm text-surface-600">
                            <strong>Princípio ativo:</strong> {prescricao.principio_ativo}
                          </p>
                        )}

                        {prescricao.advertencias && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 leading-6">
                            <strong>Advertências:</strong> {prescricao.advertencias}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, subvalue }: { label: string; value: string; subvalue?: string }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-surface-900">{value}</p>
      {subvalue && <p className="mt-1 text-sm text-surface-500">{subvalue}</p>}
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-surface-900">{value}</p>
    </div>
  );
}

function InfoField({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <p className="text-xs uppercase tracking-wide text-surface-500 mb-1.5">{label}</p>
      <p className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-800 leading-6 whitespace-pre-line">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-5 text-sm text-surface-500">
      <p className="font-medium text-surface-700">{title}</p>
      <p className="mt-1 leading-6">{description}</p>
    </div>
  );
}

function formatSexo(value: string | null): string {
  if (!value) return "—";
  if (value === "M") return "Masculino";
  if (value === "F") return "Feminino";
  return "Outro";
}

function formatNumberWithUnit(value: number | null, unit: string): string {
  if (value === null || value === undefined) return "—";
  return `${value} ${unit}`;
}

function formatHeight(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${value} cm`;
}

function stringifySynthesis(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function priorityLabel(value: string | null): string {
  if (!value) return "Rotina";
  return value === "urgente" ? "Urgente" : value === "eletiva" ? "Eletiva" : "Rotina";
}

function statusLabel(value: string | null): string {
  if (!value) return "Pendente";
  if (value === "resultado_enviado") return "Resultado enviado";
  if (value === "lido") return "Lido";
  return "Pendente";
}

function statusClasses(value: string | null): string {
  if (value === "resultado_enviado") return "bg-amber-50 text-amber-800 border border-amber-200";
  if (value === "lido") return "bg-emerald-50 text-emerald-800 border border-emerald-200";
  return "bg-surface-100 text-surface-700 border border-surface-200";
}
