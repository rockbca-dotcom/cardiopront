"use client";

import { useEffect, useState } from "react";
import { Plus, Search, User } from "lucide-react";
import Link from "next/link";

interface Patient {
  id: number;
  nome: string;
  nascimento: string;
  sexo: string;
  cpf: string | null;
  telefone: string | null;
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    nascimento: "",
    sexo: "",
    cpf: "",
    telefone: "",
    email: "",
    tipo_sanguineo: "",
    peso_kg: "",
    altura_cm: "",
    alergias: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatients(data.pacientes || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/pacientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null,
        altura_cm: form.altura_cm ? parseFloat(form.altura_cm) : null,
      }),
    });

    if (res.ok) {
      setShowForm(false);
      setForm({ nome: "", nascimento: "", sexo: "", cpf: "", telefone: "", email: "", tipo_sanguineo: "", peso_kg: "", altura_cm: "", alergias: "" });
      fetchPatients();
    } else {
      const err = await res.json();
      alert(err.error || "Erro ao cadastrar paciente");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const filteredPatients = patients.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Pacientes</h1>
          <p className="text-surface-600 mt-1">{patients.length} paciente{patients.length !== 1 ? "s" : ""} cadastrado{patients.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Novo paciente
        </button>
      </div>

      {/* New Patient Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-surface-900 mb-4">Cadastrar paciente</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="label">Nome completo *</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange} className="input-field" placeholder="Nome do paciente" required />
              </div>
              <div>
                <label className="label">Nascimento *</label>
                <input type="date" name="nascimento" value={form.nascimento} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">Sexo</label>
                <select name="sexo" value={form.sexo} onChange={handleChange} className="input-field">
                  <option value="">--</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>
              <div>
                <label className="label">CPF</label>
                <input type="text" name="cpf" value={form.cpf} onChange={handleChange} className="input-field" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="input-field" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="label">Tipo sanguíneo</label>
                <select name="tipo_sanguineo" value={form.tipo_sanguineo} onChange={handleChange} className="input-field">
                  <option value="">--</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Peso (kg)</label>
                <input type="number" step="0.1" name="peso_kg" value={form.peso_kg} onChange={handleChange} className="input-field" placeholder="70" />
              </div>
              <div>
                <label className="label">Altura (cm)</label>
                <input type="number" step="0.1" name="altura_cm" value={form.altura_cm} onChange={handleChange} className="input-field" placeholder="175" />
              </div>
            </div>
            <div>
              <label className="label">Alergias</label>
              <textarea name="alergias" value={form.alergias} onChange={handleChange} className="input-field min-h-[60px]" placeholder="Medicamentos, alimentos, outros..." />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">Cadastrar</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Buscar paciente..."
        />
      </div>

      {/* Patient List */}
      {loading ? (
        <div className="card text-center py-12">
          <p className="text-surface-500">Carregando...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="card text-center py-12">
          <User className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500">
            {search ? "Nenhum paciente encontrado." : "Nenhum paciente cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((p) => (
            <div key={p.id} className="card-hover flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
                  {p.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-surface-900">{p.nome}</p>
                  <p className="text-sm text-surface-500">
                    {p.nascimento && new Date(p.nascimento).toLocaleDateString("pt-BR")}
                    {p.sexo && ` · ${p.sexo === "M" ? "Masculino" : p.sexo === "F" ? "Feminino" : "Outro"}`}
                    {p.telefone && ` · ${p.telefone}`}
                  </p>
                </div>
              </div>
              <Link href={`/app/pacientes/${p.id}`} className="btn-secondary text-xs">
                Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
