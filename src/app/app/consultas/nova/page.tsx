"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ConsultationForm from "@/components/consulta/ConsultationForm";
import ScoreCalculator from "@/components/consulta/ScoreCalculator";

interface Patient {
  id: number;
  nome: string;
}

export default function NovaConsultaPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    setError("");

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
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Erro ao carregar pacientes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(data: Record<string, unknown>) {
    const res = await fetch("/api/consultas", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Consulta salva com sucesso!");
      router.push("/app/consultas");
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Erro ao salvar consulta");
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href="/app/consultas" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">Nova consulta</h1>
        <p className="text-surface-600 mt-1">Preencha os dados da consulta ou grave e deixe a IA sintetizar.</p>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando pacientes...</p>
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 text-center py-12">
          <p className="text-red-700 font-medium">{error}</p>
          <button type="button" onClick={fetchPatients} className="btn-secondary mt-4 inline-flex">
            Tentar novamente
          </button>
        </div>
      ) : patients.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Cadastre um paciente primeiro.</p>
          <Link href="/app/pacientes" className="btn-primary mt-4 inline-flex">
            Ir para pacientes
          </Link>
        </div>
      ) : (
        <>
          <ConsultationForm patients={patients} onSave={handleSave} />
          <ScoreCalculator />
        </>
      )}
    </div>
  );
}
