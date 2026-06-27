"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConsultationForm from "@/components/consulta/ConsultationForm";
import ScoreCalculator from "@/components/consulta/ScoreCalculator";

interface Patient { id: number; nome: string; }

export default function NovaConsultaPage() {
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

  async function handleSave(data: Record<string, unknown>) {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("/api/consultas", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      alert("Consulta salva com sucesso!");
      router.push("/app/consultas");
    } else {
      const err = await res.json();
      alert(err.error || "Erro ao salvar consulta");
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link href="/app/consultas" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">Nova consulta</h1>
        <p className="text-surface-600 mt-1">Preencha os dados da consulta ou grave e deixe a IA sintetizar.</p>
      </div>

      {loading ? (
        <div className="card text-center py-12"><p className="text-surface-500">Carregando...</p></div>
      ) : patients.length === 0 ? (
        <div className="card text-center py-12"><p className="text-surface-500">Cadastre um paciente primeiro.</p></div>
      ) : (
        <>
          <div className="mb-6">
            <ConsultationForm patients={patients} onSave={handleSave} />
          </div>
          <ScoreCalculator />
        </>
      )}
    </div>
  );
}
