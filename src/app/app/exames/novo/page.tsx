"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Patient {
  id: string;
  nome: string;
}

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

export default function NovoExamePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [tipos, setTipos] = useState<TipoExame[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("cardiovascular");
  const [selectedExams, setSelectedExams] = useState<ExamItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const [patientRes, examRes] = await Promise.all([
      fetch("/api/pacientes", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("/api/exames/catalogo", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const patientData = await patientRes.json();
    const examData = await examRes.json();

    setPatients(patientData.pacientes || []);
    setTipos(examData.tipos || []);
    setLoading(false);
  }

  function addExam(tipo: TipoExame) {
    if (selectedExams.find((e) => e.tipo_exame_id === tipo.id)) return;
    setSelectedExams([
      ...selectedExams,
      {
        tipo_exame_id: tipo.id,
        nome: tipo.nome,
        categoria: tipo.categoria,
        prioridade: "rotina",
        indicacao_clinica: "",
      },
    ]);
  }

  function removeExam(id: string) {
    setSelectedExams(selectedExams.filter((e) => e.tipo_exame_id !== id));
  }

  function updateExam(id: string, field: string, value: string) {
    setSelectedExams(
      selectedExams.map((e) =>
        e.tipo_exame_id === id ? { ...e, [field]: value } : e
      )
    );
  }

  async function handleSave() {
    if (!selectedPatient || selectedExams.length === 0) {
      alert("Selecione um paciente e pelo menos um exame.");
      return;
    }
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      for (const exam of selectedExams) {
        const res = await fetch("/api/exames", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            consulta_id: null,
            paciente_id: selectedPatient,
            tipo_exame_id: exam.tipo_exame_id,
            prioridade: exam.prioridade,
            indicacao_clinica: exam.indicacao_clinica || null,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao salvar exame");
        }
      }

      alert("Exames salvos com sucesso!");
      router.push("/app/exames");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const filteredExames = tipos.filter(
    (t) =>
      t.categoria === activeCategory &&
      t.nome.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando...</p>
        </div>
      </div>
    );
  }

  const categorias = [
    { id: "cardiovascular", label: "Cardiovascular", count: tipos.filter(t => t.categoria === "cardiovascular").length },
    { id: "laboratorial", label: "Laboratorial", count: tipos.filter(t => t.categoria === "laboratorial").length },
    { id: "imagem", label: "Imagem", count: tipos.filter(t => t.categoria === "imagem").length },
    { id: "outros", label: "Outros", count: tipos.filter(t => t.categoria === "outros").length },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/app/exames" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">Novo pedido de exames</h1>
        <p className="text-surface-600 mt-1">Selecione o paciente e os exames desejados.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Exam catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Patient */}
          <div className="card">
            <label className="label">Paciente</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="input-field"
            >
              <option value="">Selecione...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary-600 text-white"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {cat.label}
                <span className="ml-1 opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            placeholder="Buscar exame..."
          />

          {/* Exam grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredExames.map((tipo) => {
              const isSelected = selectedExams.find((e) => e.tipo_exame_id === tipo.id);
              return (
                <div
                  key={tipo.id}
                  className={`card-hover cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected ? "border-primary-500 bg-primary-50" : ""
                  }`}
                  onClick={() => addExam(tipo)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 text-sm">{tipo.nome}</p>
                    {tipo.descricao && (
                      <p className="text-xs text-surface-500 mt-1 line-clamp-2">{tipo.descricao}</p>
                    )}
                    {tipo.codigo_tus && (
                      <span className="text-xs text-surface-400 mt-1 inline-block">
                        TUS: {tipo.codigo_tus}
                      </span>
                    )}
                  </div>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-primary-600 text-white"
                        : "bg-surface-100 text-surface-400 hover:bg-primary-100 hover:text-primary-600"
                    }`}
                  >
                    {isSelected ? "✓" : "+"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected exams */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="font-semibold text-surface-900 mb-3">
              Pedido ({selectedExams.length})
            </h2>

            {selectedExams.length === 0 ? (
              <p className="text-sm text-surface-500 text-center py-8">
                Selecione exames no catálogo
              </p>
            ) : (
              <div className="space-y-3">
                {selectedExams.map((exam) => (
                  <div key={exam.tipo_exame_id} className="p-3 bg-surface-50 rounded-lg">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-surface-900 flex-1">
                        {exam.nome}
                      </p>
                      <button
                        onClick={() => removeExam(exam.tipo_exame_id)}
                        className="text-surface-400 hover:text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <select
                      value={exam.prioridade}
                      onChange={(e) => updateExam(exam.tipo_exame_id, "prioridade", e.target.value)}
                      className="input-field text-xs py-1.5 mb-2"
                    >
                      <option value="rotina">Rotina</option>
                      <option value="urgente">Urgente</option>
                      <option value="eletiva">Eletiva</option>
                    </select>
                    <input
                      type="text"
                      value={exam.indicacao_clinica}
                      onChange={(e) => updateExam(exam.tipo_exame_id, "indicacao_clinica", e.target.value)}
                      className="input-field text-xs py-1.5"
                      placeholder="Indicação clínica..."
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedExams.length > 0 && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setSelectedExams([])}
                  className="btn-secondary w-full text-sm"
                >
                  Limpar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !selectedPatient}
                  className="btn-primary w-full text-sm"
                >
                  {saving ? "Salvando..." : "Salvar pedido"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
