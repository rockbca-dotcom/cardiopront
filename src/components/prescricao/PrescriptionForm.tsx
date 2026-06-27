"use client";

import { useState, useEffect } from "react";
import { Save, Printer, Trash2 } from "lucide-react";
import DrugSearch, { MedicamentoCatalogo } from "./DrugSearch";
import InteractionAlert, { checkInteractions } from "./InteractionAlert";

interface Patient {
  id: string;
  nome: string;
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

interface PrescriptionFormProps {
  patients: Patient[];
  onSave: (data: {
    consulta_id: string | null;
    paciente_id: string;
    items: Array<{
      medicamento: string;
      principio_ativo: string;
      dose: string;
      unidade: string | null;
      frequencia: string | null;
      posologia: string | null;
      via: string | null;
      advertencias: string | null;
    }>;
  }) => Promise<void>;
}

const frequencias = [
  "1x/dia",
  "2x/dia (12/12h)",
  "3x/dia (8/8h)",
  "4x/dia (6/6h)",
  "A cada 4h",
  "A cada 6h",
  "A cada 8h",
  "A cada 12h",
  "Semanal",
  "Mensal",
  "Se necessário",
];

const vias = [
  "Oral",
  "EV",
  "IM",
  "SC",
  "Tópica",
  "Inalatória",
];

export default function PrescriptionForm({ patients, onSave }: PrescriptionFormProps) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [interactions, setInteractions] = useState<Array<{ drug1: string; drug2: string; severity: "leve" | "moderada" | "grave"; description: string }>>([]);

  function addDrug(drug: MedicamentoCatalogo) {
    if (items.find((i) => i.medicamento.id === drug.id)) return;

    setItems([
      ...items,
      {
        medicamento: drug,
        dose: drug.dose_padrao || "",
        unidade: drug.unidade || "mg",
        frequencia: "",
        posologia: "",
        via: drug.via || "Oral",
        advertencias: drug.ajuste_renal ? "Ajustar dose em insuficiência renal" : "",
      },
    ]);
    setShowSearch(false);
    checkDrugInteractions([...items.map(i => i.medicamento), drug]);
  }

  function removeDrug(id: string) {
    const newItems = items.filter((i) => i.medicamento.id !== id);
    setItems(newItems);
    checkDrugInteractions(newItems.map(i => i.medicamento));
  }

  function updateItem(id: string, field: string, value: string) {
    setItems(items.map((i) => (i.medicamento.id === id ? { ...i, [field]: value } : i)));
  }

  function checkDrugInteractions(drugs: MedicamentoCatalogo[]) {
    const classes = drugs.map((d) => d.classe);
    const detected = checkInteractions(classes, drugs.map(d => ({ classe: d.classe, principio_ativo: d.principio_ativo })));
    setInteractions(detected);
  }

  async function handleSave() {
    if (!selectedPatient || items.length === 0) {
      alert("Selecione um paciente e pelo menos um medicamento.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        consulta_id: null,
        paciente_id: selectedPatient,
        items: items.map((i) => ({
          medicamento: i.medicamento.principio_ativo,
          principio_ativo: i.medicamento.principio_ativo,
          dose: i.dose,
          unidade: i.unidade || null,
          frequencia: i.frequencia || null,
          posologia: i.posologia || null,
          via: i.via || null,
          advertencias: i.advertencias || null,
        })),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient */}
      <div className="card">
        <label className="label">Paciente</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="input-field"
        >
          <option value="">Selecione o paciente...</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      {/* Interactions Alert */}
      {interactions.length > 0 && (
        <InteractionAlert
          interactions={interactions}
          onDismiss={() => setInteractions([])}
        />
      )}

      {/* Add drug button */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="btn-primary w-full"
      >
        + Adicionar medicamento
      </button>

      {/* Drug search panel */}
      {showSearch && (
        <div className="card border-primary-200">
          <DrugSearch onSelectDrug={addDrug} />
        </div>
      )}

      {/* Prescription items */}
      {items.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-surface-900">
            Prescrição ({items.length} {items.length === 1 ? "medicamento" : "medicamentos"})
          </h2>

          {items.map((item, index) => (
            <div key={item.medicamento.id} className="card border-surface-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-surface-900 text-sm">
                    {item.medicamento.principio_ativo}
                  </h3>
                  {item.medicamento.nome_comercial && (
                    <span className="text-xs text-surface-500">
                      ({item.medicamento.nome_comercial})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeDrug(item.medicamento.id)}
                  className="text-surface-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="label text-xs">Dose</label>
                  <input
                    type="text"
                    value={item.dose}
                    onChange={(e) => updateItem(item.medicamento.id, "dose", e.target.value)}
                    className="input-field text-sm"
                    placeholder="Ex: 10"
                  />
                </div>
                <div>
                  <label className="label text-xs">Unidade</label>
                  <select
                    value={item.unidade}
                    onChange={(e) => updateItem(item.medicamento.id, "unidade", e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="mcg">mcg</option>
                    <option value="UI">UI</option>
                    <option value="mL">mL</option>
                    <option value="gotas">gotas</option>
                    <option value="comprimido">comprimido</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Via</label>
                  <select
                    value={item.via}
                    onChange={(e) => updateItem(item.medicamento.id, "via", e.target.value)}
                    className="input-field text-sm"
                  >
                    {vias.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Frequência</label>
                  <select
                    value={item.frequencia}
                    onChange={(e) => updateItem(item.medicamento.id, "frequencia", e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Selecione...</option>
                    {frequencias.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="label text-xs">Posologia / Instruções</label>
                <textarea
                  value={item.posologia}
                  onChange={(e) => updateItem(item.medicamento.id, "posologia", e.target.value)}
                  className="input-field text-sm min-h-[60px]"
                  placeholder="Ex: Tomar 1 comprimido de 12/12h por 30 dias..."
                />
              </div>

              {item.advertencias && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                  ⚠ {item.advertencias}
                </div>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setItems([])}
              className="btn-secondary text-sm"
            >
              Limpar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !selectedPatient}
              className="btn-primary text-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar prescrição"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
