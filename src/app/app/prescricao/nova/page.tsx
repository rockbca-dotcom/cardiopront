"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";

import DrugSearch from "@/components/prescricao/DrugSearch";
import InteractionAlert from "@/components/prescricao/InteractionAlert";
import type { MedicamentoCatalogo } from "@/components/prescricao/DrugSearch";
import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import { buildConsultationFollowUpPlan } from "@/lib/consultation-followup";
import { buildRenalAssessment, formatRenalWarning } from "@/lib/renal-function";

interface Patient {
  id: string | number;
  nome: string;
  nascimento: string;
  sexo: "M" | "F" | "O" | null;
  peso_kg: number | null;
  altura_cm: number | null;
}

interface PrescriptionItem {
  medicamento: MedicamentoCatalogo;
  dose: string;
  unidade: string;
  frequencia: string;
  posologia: string;
  via: string;
  advertencias: string;
}

interface ConsultationSummary {
  id: string;
  data_consulta: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  diagnostico: string | null;
  pacientes?: { id: string; nome: string } | null;
  sintese_ia: ConsultationAIDraft | null;
}

const frequencias = ["1x/dia", "2x/dia (12/12h)", "3x/dia (8/8h)", "4x/dia (6/6h)", "A cada 4h", "A cada 6h", "A cada 8h", "A cada 12h", "Semanal", "Se necessario"];
const vias = ["Oral", "EV", "IM", "SC", "Topica", "Inalatoria"];

export default function NovaPrescricaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultaId = searchParams.get("consulta_id")?.trim() || "";
  const querySearch = searchParams.get("search")?.trim() || "";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultation, setConsultation] = useState<ConsultationSummary | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationError, setConsultationError] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [creatininaSerica, setCreatininaSerica] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [interactions, setInteractions] = useState<Array<{ drug1: string; drug2: string; severity: "leve" | "moderada" | "grave"; description: string }>>([]);

  const followUpPlan = useMemo(() => buildConsultationFollowUpPlan(consultation?.sintese_ia), [consultation]);
  const initialDrugSearch = querySearch || followUpPlan.prescriptionSearch;
  const selectedPatientData = useMemo(
    () => patients.find((patient) => String(patient.id) === selectedPatient) || null,
    [patients, selectedPatient],
  );
  const renalAssessment = useMemo(() => {
    if (!selectedPatientData) return null;

    const normalizedCreatinine = creatininaSerica.replace(",", ".").trim();
    if (!normalizedCreatinine) return null;

    const creatinine = Number(normalizedCreatinine);
    if (!Number.isFinite(creatinine) || creatinine <= 0) return null;

    return buildRenalAssessment(
      {
        nascimento: selectedPatientData.nascimento,
        sexo: selectedPatientData.sexo,
        pesoKg: selectedPatientData.peso_kg,
      },
      creatinine,
    );
  }, [creatininaSerica, selectedPatientData]);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!consultaId) {
      setConsultationLoading(false);
      return;
    }

    fetchConsultation(consultaId);
  }, [consultaId]);

  useEffect(() => {
    if (initialDrugSearch) {
      setShowSearch(true);
    }
  }, [initialDrugSearch]);

  useEffect(() => {
    if (consultation?.pacientes?.id) {
      setSelectedPatient(String(consultation.pacientes.id));
    }
  }, [consultation?.pacientes?.id]);

  async function fetchPatients() {
    setLoadingPatients(true);
    try {
      const res = await fetch("/api/pacientes", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar pacientes");
      }
      setPatients(data.pacientes || []);
    } catch (error) {
      console.error("Error loading patients:", error);
    } finally {
      setLoadingPatients(false);
    }
  }

  async function fetchConsultation(id: string) {
    setConsultationLoading(true);
    setConsultationError("");

    try {
      const res = await fetch(`/api/consultas/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar consulta");
      }

      setConsultation(data.consulta || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar consulta";
      setConsultationError(message);
    } finally {
      setConsultationLoading(false);
    }
  }

  function addDrug(drug: MedicamentoCatalogo) {
    if (items.find((i) => i.medicamento.id === drug.id)) return;
    setItems([...items, { medicamento: drug, dose: drug.dose_padrao || "", unidade: drug.unidade || "mg", frequencia: "", posologia: "", via: drug.via || "Oral", advertencias: "" }]);
    setShowSearch(false);
    checkInteractions([...items.map((i) => i.medicamento), drug]);
  }

  function removeDrug(id: string) {
    const newItems = items.filter((i) => i.medicamento.id !== id);
    setItems(newItems);
    checkInteractions(newItems.map((i) => i.medicamento));
  }

  function updateItem(id: string, field: string, value: string) {
    setItems(items.map((i) => (i.medicamento.id === id ? { ...i, [field]: value } : i)));
  }

  function checkInteractions(drugs: MedicamentoCatalogo[]) {
    const knownInteractions = [
      { class1: "Anticoagulante", class2: "Antiagregante", severity: "grave" as const, desc: "Risco aumentado de sangramento. Monitorar INR." },
      { class1: "IECA", class2: "BRA", severity: "moderada" as const, desc: "Risco de hipercalemia. Monitorar K+." },
      { class1: "Beta-bloqueador", class2: "Bloqueador de Canais", severity: "moderada" as const, desc: "Risco de bradicardia." },
      { class1: "IECA", class2: "Diuretico", severity: "moderada" as const, desc: "Risco de hipotensao." },
    ];
    const detected: Array<{ drug1: string; drug2: string; severity: "leve" | "moderada" | "grave"; description: string }> = [];
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const interaction = knownInteractions.find((k) => (k.class1 === drugs[i].classe && k.class2 === drugs[j].classe) || (k.class1 === drugs[j].classe && k.class2 === drugs[i].classe));
        if (interaction) {
          const drug1 = drugs.find((d) => d.classe === drugs[i].classe);
          const drug2 = drugs.find((d) => d.classe === drugs[j].classe);
          if (drug1 && drug2) detected.push({ drug1: drug1.principio_ativo, drug2: drug2.principio_ativo, severity: interaction.severity, description: interaction.desc });
        }
      }
    }
    setInteractions(detected);
  }

  async function handleSave() {
    if (!selectedPatient || items.length === 0) {
      alert("Selecione um paciente e pelo menos um medicamento.");
      return;
    }
    setSaving(true);
    try {
      for (const item of items) {
        const res = await fetch("/api/prescricao", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consulta_id: consultaId || null,
            paciente_id: selectedPatient,
            medicamento: item.medicamento.principio_ativo,
            principio_ativo: item.medicamento.principio_ativo,
            dose: item.dose,
            unidade: item.unidade,
            frequencia: item.frequencia,
            posologia: item.posologia,
            via: item.via,
            advertencias: formatRenalWarning(item.medicamento.principio_ativo, renalAssessment, item.medicamento.ajuste_renal) || null,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Erro");
        }
      }
      alert("Prescricao salva!");
      router.push("/app/prescricao");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loadingPatients) {
    return (
      <div className="max-w-4xl">
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href="/app/prescricao" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">Nova prescricao</h1>
        <p className="text-surface-600 mt-1">Selecione o paciente e os medicamentos.</p>
      </div>

      {consultaId && (
        <div className="card border-primary-200 bg-primary-50/30 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Consulta vinculada
              </div>
              <p className="text-sm text-surface-700">
                {consultation
                  ? `Paciente: ${consultation.pacientes?.nome || "Paciente não informado"}`
                  : consultationError
                    ? `Não foi possível carregar a consulta: ${consultationError}`
                    : consultationLoading
                      ? "Carregando contexto da consulta..."
                      : "A consulta vinculada não foi encontrada."}
              </p>
              {consultation?.motivo_consulta && (
                <p className="text-xs text-surface-500">Motivo: {consultation.motivo_consulta}</p>
              )}
            </div>

            {consultation?.id && (
              <Link href={`/app/consultas/${consultation.id}`} className="btn-secondary text-xs h-10 px-4 whitespace-nowrap">
                Ver consulta
              </Link>
            )}
          </div>

          {followUpPlan.medications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {followUpPlan.medications.map((medication) => (
                <span key={medication.nome} className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs text-primary-700">
                  <span className="font-semibold">{medication.nome}</span>
                  {medication.dose && <span className="text-primary-500"> · {medication.dose}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {interactions.length > 0 && <div className="mb-1"><InteractionAlert interactions={interactions} onDismiss={() => setInteractions([])} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <label className="label">Paciente</label>
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="input-field">
              <option value="">Selecione...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div className="card border-primary-200 bg-primary-50/30 space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-semibold text-surface-900">Ajuste renal / TFGe</h2>
                <p className="text-sm text-surface-600">
                  Selecione o paciente e informe a creatinina sérica mais recente para estimar TFGe e ClCr antes de salvar a prescrição.
                </p>
              </div>

              {selectedPatientData && (
                <div className="text-xs text-surface-500 md:text-right">
                  <p className="font-medium text-surface-700">{selectedPatientData.nome}</p>
                  <p>
                    {selectedPatientData.nascimento}
                    {selectedPatientData.sexo ? ` · Sexo ${selectedPatientData.sexo}` : ""}
                    {selectedPatientData.peso_kg != null ? ` · ${selectedPatientData.peso_kg} kg` : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Creatinina sérica (mg/dL)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={creatininaSerica}
                  onChange={(e) => setCreatininaSerica(e.target.value)}
                  disabled={!selectedPatientData}
                  className="input-field text-sm"
                  placeholder="Ex.: 1,20"
                />
              </div>

              <div className="rounded-lg border border-dashed border-primary-200 bg-white p-3 text-sm text-surface-600">
                {renalAssessment ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          renalAssessment.stage === "normal"
                            ? "bg-emerald-100 text-emerald-700"
                            : renalAssessment.stage === "leve"
                              ? "bg-blue-100 text-blue-700"
                              : renalAssessment.stage === "moderado"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {renalAssessment.stageLabel}
                      </span>
                      <span className="text-xs text-surface-500">Idade estimada: {renalAssessment.age} anos</span>
                    </div>
                    <p>TFGe: {renalAssessment.egfr ? `${renalAssessment.egfr} mL/min/1,73m²` : "não calculada"}</p>
                    {renalAssessment.crcl !== null && <p>ClCr (Cockcroft-Gault): {renalAssessment.crcl} mL/min</p>}
                    <p className="text-xs text-surface-500">{renalAssessment.recommendation}</p>
                  </div>
                ) : (
                  <p className="text-surface-500">
                    {selectedPatientData
                      ? "Informe a creatinina para ver a estimativa renal."
                      : "Selecione um paciente para habilitar a estimativa renal."}
                  </p>
                )}
              </div>
            </div>

            {renalAssessment?.shouldAdjustDose ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                Medicamentos com ajuste renal vão exibir alerta automático na lista e na receita.
              </div>
            ) : (
              <p className="text-xs text-surface-500">
                Medicamentos marcados com ajuste renal só vão gerar alerta quando a função estiver reduzida.
              </p>
            )}
          </div>
          <button type="button" onClick={() => setShowSearch(!showSearch)} className="btn-primary w-full">
            + Adicionar medicamento
          </button>
          {showSearch && <div className="card border-primary-200"><DrugSearch onSelectDrug={addDrug} initialSearch={initialDrugSearch} /></div>}
          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((item, index) => {
                const renalWarning = formatRenalWarning(item.medicamento.principio_ativo, renalAssessment, item.medicamento.ajuste_renal);

                return (
                  <div key={item.medicamento.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{item.medicamento.principio_ativo}</p>
                          {item.medicamento.nome_comercial && <p className="text-xs text-surface-500">{item.medicamento.nome_comercial}</p>}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeDrug(item.medicamento.id)} className="text-surface-400 hover:text-red-500">X</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div><label className="label text-xs">Dose</label><input type="text" value={item.dose} onChange={(e) => updateItem(item.medicamento.id, "dose", e.target.value)} className="input-field text-sm" /></div>
                      <div><label className="label text-xs">Unidade</label><select value={item.unidade} onChange={(e) => updateItem(item.medicamento.id, "unidade", e.target.value)} className="input-field text-sm"><option value="mg">mg</option><option value="g">g</option><option value="mcg">mcg</option><option value="UI">UI</option><option value="mL">mL</option><option value="gotas">gotas</option><option value="cp">comprimido</option></select></div>
                      <div><label className="label text-xs">Via</label><select value={item.via} onChange={(e) => updateItem(item.medicamento.id, "via", e.target.value)} className="input-field text-sm">{vias.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>
                      <div><label className="label text-xs">Frequencia</label><select value={item.frequencia} onChange={(e) => updateItem(item.medicamento.id, "frequencia", e.target.value)} className="input-field text-sm"><option value="">Selecione...</option>{frequencias.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
                    </div>
                    <div className="mt-3"><label className="label text-xs">Posologia</label><textarea value={item.posologia} onChange={(e) => updateItem(item.medicamento.id, "posologia", e.target.value)} className="input-field text-sm min-h-[60px]" placeholder="Instrucoes de uso..." /></div>
                    {renalWarning && <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">{renalWarning}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="font-semibold text-surface-900 mb-3">Resumo ({items.length})</h2>
            {items.length === 0 ? (
              <p className="text-sm text-surface-500 text-center py-8">Adicione medicamentos</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.medicamento.id} className="p-2 bg-surface-50 rounded text-sm">
                    <p className="font-medium text-surface-900 text-xs">{item.medicamento.principio_ativo}</p>
                    {item.dose && <p className="text-xs text-surface-500">{item.dose} {item.unidade} {item.frequencia && `- ${item.frequencia}`}</p>}
                  </div>
                ))}
              </div>
            )}
            {items.length > 0 && (
              <div className="mt-4 space-y-2">
                <button type="button" onClick={handleSave} disabled={saving || !selectedPatient} className="btn-primary w-full text-sm"><Save className="w-4 h-4" />{saving ? "Salvando..." : "Salvar prescricao"}</button>
                <button type="button" onClick={() => { setItems([]); setInteractions([]); }} className="btn-secondary w-full text-sm">Limpar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
