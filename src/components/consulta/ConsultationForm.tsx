"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import ConsultationPrefillPanel from "./ConsultationPrefillPanel";
import RecordingButton from "./RecordingButton";
import SynthesisPanel from "./SynthesisPanel";
import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import {
  applyConsultationPrefill,
  applyConsultationSuggestion,
  buildConsultationPrefillSuggestions,
  type ConsultationFormValues,
  type ConsultationPrefillSuggestion,
} from "@/lib/consultation-prefill";

interface Patient {
  id: number;
  nome: string;
}

interface ConsultationFormProps {
  patients: Patient[];
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

const initialForm: ConsultationFormValues = {
  paciente_id: "",
  data_consulta: new Date().toISOString().slice(0, 16),
  tipo: "presencial",
  motivo_consulta: "",
  queixa_principal: "",
  pa_sistolica: "",
  pa_diastolica: "",
  fc: "",
  fr: "",
  temp_celsius: "",
  saturacao_o2: "",
  peso_kg: "",
  altura_cm: "",
  exame_fisico_geral: "",
  diagnostico: "",
  cid10: "",
  conduta: "",
  orientacoes: "",
};

export default function ConsultationForm({ patients, onSave }: ConsultationFormProps) {
  const [transcription, setTranscription] = useState("");
  const [synthesis, setSynthesis] = useState<ConsultationAIDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ConsultationFormValues>(initialForm);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSynthesis(synthData: ConsultationAIDraft) {
    setSynthesis(synthData);
    setForm((current) => applyConsultationPrefill(current, buildConsultationPrefillSuggestions(synthData)));
  }

  function handleApplySuggestion(suggestion: ConsultationPrefillSuggestion) {
    setForm((current) => applyConsultationSuggestion(current, suggestion));
  }

  function handleApplyAllSuggestions() {
    if (!synthesis) return;
    setForm((current) => applyConsultationPrefill(current, buildConsultationPrefillSuggestions(synthesis)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      await onSave({
        ...form,
        pa_sistolica: form.pa_sistolica ? parseInt(form.pa_sistolica) : null,
        pa_diastolica: form.pa_diastolica ? parseInt(form.pa_diastolica) : null,
        fc: form.fc ? parseInt(form.fc) : null,
        fr: form.fr ? parseInt(form.fr) : null,
        saturacao_o2: form.saturacao_o2 ? parseInt(form.saturacao_o2) : null,
        peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null,
        altura_cm: form.altura_cm ? parseFloat(form.altura_cm) : null,
        temp_celsius: form.temp_celsius ? parseFloat(form.temp_celsius) : null,
        transcricao_completa: transcription.trim() || null,
        sintese_ia: synthesis ?? null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recording Section */}
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4">Gravação da consulta</h2>
        <RecordingButton onTranscription={(text) => setTranscription(text)} onSynthesis={handleSynthesis} />
        {transcription && (
          <details className="mt-4 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-surface-700">
              Ver transcrição completa
            </summary>
            <p className="mt-3 text-sm text-surface-700 whitespace-pre-line leading-6">{transcription}</p>
          </details>
        )}
      </div>

      {/* Structured synthesis */}
      <SynthesisPanel synthesis={synthesis} />

      {/* Guided prefill */}
      <ConsultationPrefillPanel
        synthesis={synthesis}
        form={form}
        onApplySuggestion={handleApplySuggestion}
        onApplyAll={handleApplyAllSuggestions}
      />

      {/* Patient Selection */}
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4">Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Paciente *</label>
            <select name="paciente_id" value={form.paciente_id} onChange={handleChange} className="input-field" required>
              <option value="">Selecione...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Data/hora</label>
            <input type="datetime-local" name="data_consulta" value={form.data_consulta} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className="input-field">
              <option value="presencial">Presencial</option>
              <option value="tele">Telemedicina</option>
              <option value="retorno">Retorno</option>
            </select>
          </div>
        </div>
      </div>

      {/* Anamnese */}
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4">Anamnese</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Motivo da consulta</label>
            <textarea
              name="motivo_consulta"
              value={form.motivo_consulta}
              onChange={handleChange}
              className="input-field min-h-[60px]"
              placeholder="Ex: Acompanhamento de hipertensão, dor torácica..."
            />
          </div>
          <div>
            <label className="label">Queixa principal</label>
            <textarea
              name="queixa_principal"
              value={form.queixa_principal}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              placeholder="Descreva a queixa principal do paciente..."
            />
          </div>
        </div>
      </div>

      {/* Exame Físico */}
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4">Exame físico</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="label">PA (mmHg)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" name="pa_sistolica" value={form.pa_sistolica} onChange={handleChange} className="input-field" placeholder="Sist" />
              <input type="number" name="pa_diastolica" value={form.pa_diastolica} onChange={handleChange} className="input-field" placeholder="Diast" />
            </div>
          </div>
          <div>
            <label className="label">FC (bpm)</label>
            <input type="number" name="fc" value={form.fc} onChange={handleChange} className="input-field" placeholder="72" />
          </div>
          <div>
            <label className="label">FR (rpm)</label>
            <input type="number" name="fr" value={form.fr} onChange={handleChange} className="input-field" placeholder="16" />
          </div>
          <div>
            <label className="label">SpO2 (%)</label>
            <input type="number" name="saturacao_o2" value={form.saturacao_o2} onChange={handleChange} className="input-field" placeholder="98" />
          </div>
          <div>
            <label className="label">Temp (°C)</label>
            <input type="number" step="0.1" name="temp_celsius" value={form.temp_celsius} onChange={handleChange} className="input-field" placeholder="36.5" />
          </div>
          <div>
            <label className="label">Peso (kg)</label>
            <input type="number" step="0.1" name="peso_kg" value={form.peso_kg} onChange={handleChange} className="input-field" placeholder="75" />
          </div>
          <div>
            <label className="label">Altura (cm)</label>
            <input type="number" step="0.1" name="altura_cm" value={form.altura_cm} onChange={handleChange} className="input-field" placeholder="175" />
          </div>
        </div>
        <div>
          <label className="label">Exame físico geral</label>
          <textarea
            name="exame_fisico_geral"
            value={form.exame_fisico_geral}
            onChange={handleChange}
            className="input-field min-h-[80px]"
            placeholder="Ausculta cardíaca, pulsos, DVPJ, edema..."
          />
        </div>
      </div>

      {/* Diagnóstico */}
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4">Diagnóstico</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Diagnóstico</label>
            <textarea
              name="diagnostico"
              value={form.diagnostico}
              onChange={handleChange}
              className="input-field min-h-[60px]"
              placeholder="Ex: Hipertensão arterial estágio 1..."
            />
          </div>
          <div>
            <label className="label">CID-10</label>
            <input type="text" name="cid10" value={form.cid10} onChange={handleChange} className="input-field" placeholder="Ex: I10" />
          </div>
        </div>
      </div>

      {/* Conduta */}
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-4">Conduta e orientações</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Conduta</label>
            <textarea
              name="conduta"
              value={form.conduta}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              placeholder="Medicamentos ajustados, exames solicitados, encaminhamentos..."
            />
          </div>
          <div>
            <label className="label">Orientações ao paciente</label>
            <textarea
              name="orientacoes"
              value={form.orientacoes}
              onChange={handleChange}
              className="input-field min-h-[60px]"
              placeholder="Dieta, atividade física, sinais de alerta..."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary px-8 h-11">
          <Save className="w-4 h-4" />
          {saving ? "Salvando..." : "Salvar consulta"}
        </button>
      </div>
    </form>
  );
}
