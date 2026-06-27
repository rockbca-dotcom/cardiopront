"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import DrugSearch from "@/components/prescricao/DrugSearch";
import InteractionAlert from "@/components/prescricao/InteractionAlert";
import type { MedicamentoCatalogo } from "@/components/prescricao/DrugSearch";

interface Patient { id: string; nome: string; }
interface PrescriptionItem {
  medicamento: MedicamentoCatalogo;
  dose: string;
  unidade: string;
  frequencia: string;
  posologia: string;
  via: string;
  advertencias: string;
}

const frequencias = ["1x/dia", "2x/dia (12/12h)", "3x/dia (8/8h)", "4x/dia (6/6h)", "A cada 4h", "A cada 6h", "A cada 8h", "A cada 12h", "Semanal", "Se necessario"];
const vias = ["Oral", "EV", "IM", "SC", "Topica", "Inalatoria"];

export default function NovaPrescricaoPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [interactions, setInteractions] = useState<Array<{ drug1: string; drug2: string; severity: "leve" | "moderada" | "grave"; description: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/pacientes", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setPatients(data.pacientes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function addDrug(drug: MedicamentoCatalogo) {
    if (items.find((i) => i.medicamento.id === drug.id)) return;
    setItems([...items, { medicamento: drug, dose: drug.dose_padrao || "", unidade: drug.unidade || "mg", frequencia: "", posologia: "", via: drug.via || "Oral", advertencias: drug.ajuste_renal ? "Ajustar dose em insuficiencia renal" : "" }]);
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
    if (!selectedPatient || items.length === 0) { alert("Selecione um paciente e pelo menos um medicamento."); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      for (const item of items) {
        const res = await fetch("/api/prescricao", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ consulta_id: null, paciente_id: selectedPatient, medicamento: item.medicamento.principio_ativo, principio_ativo: item.medicamento.principio_ativo, dose: item.dose, unidade: item.unidade, frequencia: item.frequencia, posologia: item.posologia, via: item.via, advertencias: item.advertencias || null }),
        });
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Erro"); }
      }
      alert("Prescricao salva!");
      router.push("/app/prescricao");
    } catch (error) { alert(error instanceof Error ? error.message : "Erro ao salvar"); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="max-w-4xl"><div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div></div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/app/prescricao" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4"><ArrowLeft className="w-4 h-4" />Voltar</Link>
        <h1 className="text-2xl font-bold text-surface-900">Nova prescricao</h1>
        <p className="text-surface-600 mt-1">Selecione o paciente e os medicamentos.</p>
      </div>
      {interactions.length > 0 && <div className="mb-6"><InteractionAlert interactions={interactions} onDismiss={() => setInteractions([])} /></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <label className="label">Paciente</label>
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="input-field">
              <option value="">Selecione...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <button onClick={() => setShowSearch(!showSearch)} className="btn-primary w-full">+ Adicionar medicamento</button>
          {showSearch && <div className="card border-primary-200"><DrugSearch onSelectDrug={addDrug} /></div>}
          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.medicamento.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                      <div><p className="font-medium text-sm">{item.medicamento.principio_ativo}</p>{item.medicamento.nome_comercial && <p className="text-xs text-surface-500">{item.medicamento.nome_comercial}</p>}</div>
                    </div>
                    <button onClick={() => removeDrug(item.medicamento.id)} className="text-surface-400 hover:text-red-500">X</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div><label className="label text-xs">Dose</label><input type="text" value={item.dose} onChange={(e) => updateItem(item.medicamento.id, "dose", e.target.value)} className="input-field text-sm" /></div>
                    <div><label className="label text-xs">Unidade</label><select value={item.unidade} onChange={(e) => updateItem(item.medicamento.id, "unidade", e.target.value)} className="input-field text-sm"><option value="mg">mg</option><option value="g">g</option><option value="mcg">mcg</option><option value="UI">UI</option><option value="mL">mL</option><option value="gotas">gotas</option><option value="cp">comprimido</option></select></div>
                    <div><label className="label text-xs">Via</label><select value={item.via} onChange={(e) => updateItem(item.medicamento.id, "via", e.target.value)} className="input-field text-sm">{vias.map((v) => <option key={v} value={v}>{v}</option>)}</select></div>
                    <div><label className="label text-xs">Frequencia</label><select value={item.frequencia} onChange={(e) => updateItem(item.medicamento.id, "frequencia", e.target.value)} className="input-field text-sm"><option value="">Selecione...</option>{frequencias.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
                  </div>
                  <div className="mt-3"><label className="label text-xs">Posologia</label><textarea value={item.posologia} onChange={(e) => updateItem(item.medicamento.id, "posologia", e.target.value)} className="input-field text-sm min-h-[60px]" placeholder="Instrucoes de uso..." /></div>
                  {item.advertencias && <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">{item.advertencias}</div>}
                </div>
              ))}
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
                <button onClick={handleSave} disabled={saving || !selectedPatient} className="btn-primary w-full text-sm"><Save className="w-4 h-4" />{saving ? "Salvando..." : "Salvar prescricao"}</button>
                <button onClick={() => { setItems([]); setInteractions([]); }} className="btn-secondary w-full text-sm">Limpar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
