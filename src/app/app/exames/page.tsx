"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import ExamHistory from "@/components/exames/ExamHistory";

export default function ExamesPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Exames</h1>
          <p className="text-surface-600 mt-1">Pedidos de exames cardiológicos</p>
        </div>
        <button onClick={() => setShowBuilder(!showBuilder)} className="btn-primary">
          <Plus className="w-4 h-4" /> Novo pedido
        </button>
      </div>

      {showBuilder ? (
        <div className="mb-6">
          <Link href="/app/exames/novo" className="text-sm text-primary-600 hover:underline mb-4 inline-block">
            ← Voltar para a lista
          </Link>
          <ExamBuilderInline />
        </div>
      ) : (
        <ExamHistory />
      )}
    </div>
  );
}

function ExamBuilderInline() {
  const [patients, setPatients] = useState<Array<{ id: string; nome: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/pacientes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPatients(data.pacientes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(data: { consulta_id: string | null; paciente_id: string; exams: Array<{ tipo_exame_id: string; prioridade: string; indicacao_clinica: string }> }) {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Save each exam as a separate request
    for (const exam of data.exams) {
      await fetch("/api/exames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consulta_id: data.consulta_id,
          paciente_id: data.paciente_id,
          tipo_exame_id: exam.tipo_exame_id,
          prioridade: exam.prioridade,
          indicacao_clinica: exam.indicacao_clinica || null,
        }),
      });
    }

    alert("Exames salvos com sucesso!");
    window.location.reload();
  }

  if (loading) {
    return <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>;
  }

  // Inline the ExamBuilder
  return <ExamBuilderInlineUI patients={patients} onSave={handleSave} />;
}

function ExamBuilderInlineUI({ patients, onSave }: { patients: Array<{ id: string; nome: string }>; onSave: (data: { consulta_id: string | null; paciente_id: string; exams: Array<{ tipo_exame_id: string; prioridade: string; indicacao_clinica: string }> }) => Promise<void> }) {
  const [tipos, setTipos] = useState<Array<{ id: string; categoria: string; nome: string; descricao: string | null; codigo_tus: string | null }>>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("cardiovascular");
  const [selectedExams, setSelectedExams] = useState<Array<{ tipo_exame_id: string; nome: string; categoria: string; prioridade: string; indicacao_clinica: string }>>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExamTypes();
  }, []);

  async function fetchExamTypes() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("/api/exames/catalogo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTipos(data.tipos || []);
  }

  function addExam(tipo: { id: string; categoria: string; nome: string; descricao: string | null; codigo_tus: string | null }) {
    if (selectedExams.find((e) => e.tipo_exame_id === tipo.id)) return;
    setSelectedExams([...selectedExams, { tipo_exame_id: tipo.id, nome: tipo.nome, categoria: tipo.categoria, prioridade: "rotina", indicacao_clinica: "" }]);
  }

  function removeExam(id: string) {
    setSelectedExams(selectedExams.filter((e) => e.tipo_exame_id !== id));
  }

  function updateExam(id: string, field: string, value: string) {
    setSelectedExams(selectedExams.map((e) => e.tipo_exame_id === id ? { ...e, [field]: value } : e));
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

  const categorias = [
    { id: "cardiovascular", label: "Cardiovascular" },
    { id: "laboratorial", label: "Laboratorial" },
    { id: "imagem", label: "Imagem" },
    { id: "outros", label: "Outros" },
  ];

  const filteredExames = tipos.filter((t) => t.categoria === activeCategory && t.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-semibold text-surface-900 mb-3">Paciente</h2>
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
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" placeholder="Buscar exame..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredExames.map((tipo) => {
          const isSelected = selectedExams.find((e) => e.tipo_exame_id === tipo.id);
          return (
            <div key={tipo.id} className={`card-hover cursor-pointer flex items-start justify-between gap-3 ${isSelected ? "border-primary-500 bg-primary-50" : ""}`} onClick={() => addExam(tipo)}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-surface-900 text-sm truncate">{tipo.nome}</p>
                {tipo.descricao && <p className="text-xs text-surface-500 mt-1 line-clamp-2">{tipo.descricao}</p>}
                {tipo.codigo_tus && <span className="text-xs text-surface-400 mt-1 inline-block">TUS: {tipo.codigo_tus}</span>}
              </div>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-400"}`}>
                {isSelected ? "✓" : "+"}
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
                <button onClick={(e) => { e.stopPropagation(); removeExam(exam.tipo_exame_id); }} className="text-surface-400 hover:text-red-500">✕</button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setSelectedExams([])} className="btn-secondary text-sm">Limpar</button>
            <button onClick={handleSave} disabled={saving || !selectedPatient} className="btn-primary text-sm">
              {saving ? "Salvando..." : "Salvar pedido"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
