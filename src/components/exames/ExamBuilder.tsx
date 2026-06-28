"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, FileText } from "lucide-react";

interface TipoExame {
  id: string;
  categoria: string;
  nome: string;
  descricao: string | null;
  codigo_tus: string | null;
}

interface ExamItem {
  tipo_exame_id: string;
  nome: string;
  categoria: string;
  prioridade: "rotina" | "urgente" | "eletiva";
  indicacao_clinica: string;
}

interface Patient {
  id: string;
  nome: string;
}

interface ExamBuilderProps {
  patients: Patient[];
  onSave: (data: {
    consulta_id: string | null;
    paciente_id: string;
    exams: ExamItem[];
  }) => Promise<void>;
  initialSearch?: string;
  initialCategory?: string;
  initialPatientId?: string;
}

const categorias = [
  { id: "cardiovascular", label: "Cardiovascular" },
  { id: "laboratorial", label: "Laboratorial" },
  { id: "imagem", label: "Imagem" },
  { id: "outros", label: "Outros" },
];

export default function ExamBuilder({ patients, onSave, initialSearch = "", initialCategory = "cardiovascular", initialPatientId = "" }: ExamBuilderProps) {
  const [tipos, setTipos] = useState<TipoExame[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("cardiovascular");
  const [selectedExams, setSelectedExams] = useState<ExamItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExamTypes();
  }, []);

  useEffect(() => {
    setSearch(initialSearch.trim());
  }, [initialSearch]);

  useEffect(() => {
    setActiveCategory(initialCategory || "cardiovascular");
  }, [initialCategory]);

  useEffect(() => {
    if (initialPatientId) {
      setSelectedPatient(initialPatientId);
    }
  }, [initialPatientId]);

  async function fetchExamTypes() {
    try {
      const res = await fetch("/api/exames/catalogo", { credentials: "include" });
      const data = await res.json();
      setTipos(data.tipos || []);
    } catch { /* ignore */ }
  }

  function addExam(tipo: TipoExame) {
    if (selectedExams.find((e) => e.tipo_exame_id === tipo.id)) return;
    setSelectedExams([
      ...selectedExams,
      { tipo_exame_id: tipo.id, nome: tipo.nome, categoria: tipo.categoria, prioridade: "rotina", indicacao_clinica: "" },
    ]);
  }

  function removeExam(id: string) {
    setSelectedExams(selectedExams.filter((e) => e.tipo_exame_id !== id));
  }

  function updateExam(id: string, field: string, value: string) {
    setSelectedExams(selectedExams.map((e) => (e.tipo_exame_id === id ? { ...e, [field]: value } : e)));
  }

  async function handleSave() {
    if (!selectedPatient || selectedExams.length === 0) return;
    setSaving(true);
    try {
      await onSave({ consulta_id: null, paciente_id: selectedPatient, exams: selectedExams });
    } finally {
      setSaving(false);
    }
  }

  const filteredExames = tipos.filter(
    (t) => t.categoria === activeCategory && t.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="card">
        <label className="label">Paciente</label>
        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="input-field">
          <option value="">Selecione o paciente...</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>
      <div className="flex gap-2 flex-wrap">
        {categorias.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"}`}>
            {cat.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Buscar exame..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredExames.map((tipo) => {
          const isSelected = selectedExams.find((e) => e.tipo_exame_id === tipo.id);
          return (
            <div key={tipo.id} className={`card-hover cursor-pointer flex items-start justify-between gap-3 ${isSelected ? "border-primary-500 bg-primary-50" : ""}`} onClick={() => addExam(tipo)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-surface-400 shrink-0" />
                  <p className="font-medium text-surface-900 text-sm truncate">{tipo.nome}</p>
                </div>
                {tipo.descricao && <p className="text-xs text-surface-500 mt-1 line-clamp-2">{tipo.descricao}</p>}
                {tipo.codigo_tus && <span className="text-xs text-surface-400 mt-1 inline-block">TUS: {tipo.codigo_tus}</span>}
              </div>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-400 hover:bg-primary-100 hover:text-primary-600"}`}>
                {isSelected ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>
      {selectedExams.length > 0 && (
        <div className="card border-primary-200">
          <h2 className="font-semibold text-surface-900 mb-3">Exames selecionados ({selectedExams.length})</h2>
          <div className="space-y-2">
            {selectedExams.map((exam) => (
              <div key={exam.tipo_exame_id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">{exam.nome}</p>
                </div>
                <select value={exam.prioridade} onChange={(e) => updateExam(exam.tipo_exame_id, "prioridade", e.target.value)} className="input-field w-28 text-xs py-1.5" onClick={(e) => e.stopPropagation()}>
                  <option value="rotina">Rotina</option>
                  <option value="urgente">Urgente</option>
                  <option value="eletiva">Eletiva</option>
                </select>
                <input type="text" value={exam.indicacao_clinica} onChange={(e) => updateExam(exam.tipo_exame_id, "indicacao_clinica", e.target.value)} className="input-field flex-1 text-xs py-1.5" placeholder="Indicação clínica..." onClick={(e) => e.stopPropagation()} />
                <button onClick={(e) => { e.stopPropagation(); removeExam(exam.tipo_exame_id); }} className="text-surface-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setSelectedExams([])} className="btn-secondary text-sm">Limpar</button>
            <button onClick={handleSave} disabled={saving || !selectedPatient} className="btn-primary text-sm">{saving ? "Salvando..." : "Salvar pedido"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
