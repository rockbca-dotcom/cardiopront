"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ExamBuilder from "@/components/exames/ExamBuilder";

interface Patient { id: string; nome: string; }

export default function NovoExamePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
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

  async function handleSave(data: { consulta_id: string | null; paciente_id: string; exams: Array<{ tipo_exame_id: string; prioridade: string; indicacao_clinica: string }> }) {
    const token = localStorage.getItem("token");
    if (!token) return;
    for (const exam of data.exams) {
      const res = await fetch("/api/exames", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ consulta_id: data.consulta_id, paciente_id: data.paciente_id, tipo_exame_id: exam.tipo_exame_id, prioridade: exam.prioridade, indicacao_clinica: exam.indicacao_clinica || null }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Erro"); }
    }
    alert("Exames salvos!");
    router.push("/app/exames");
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/app/exames" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4"><ArrowLeft className="w-4 h-4" />Voltar</Link>
        <h1 className="text-2xl font-bold text-surface-900">Novo pedido de exames</h1>
        <p className="text-surface-600 mt-1">Selecione o paciente e os exames.</p>
      </div>
      {loading ? (
        <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>
      ) : patients.length === 0 ? (
        <div className="card text-center py-12"><p className="text-surface-500">Cadastre um paciente primeiro.</p></div>
      ) : (
        <ExamBuilder patients={patients} onSave={handleSave} />
      )}
    </div>
  );
}
