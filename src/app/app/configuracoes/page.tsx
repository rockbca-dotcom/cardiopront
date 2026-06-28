"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, CreditCard, Loader2, PenLine, Shield, User } from "lucide-react";

import SignaturePad from "@/components/configuracoes/SignaturePad";

interface ConfiguracoesState {
  nome: string;
  email: string;
  crm: string;
  crm_uf: string;
  especialidade: string;
  telefone: string;
  assinatura_data_url: string;
}

interface ConfiguracoesProfile extends ConfiguracoesState {
  plano: "trial" | "essencial" | "profissional" | "clinica";
  trial_fim: string | null;
  atualizado_em: string | null;
}

const initialState: ConfiguracoesState = {
  nome: "",
  email: "",
  crm: "",
  crm_uf: "",
  especialidade: "",
  telefone: "",
  assinatura_data_url: "",
};

export default function ConfiguracoesPage() {
  const [form, setForm] = useState<ConfiguracoesState>(initialState);
  const [profile, setProfile] = useState<ConfiguracoesProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void loadConfiguracoes();
  }, []);

  const lastUpdated = useMemo(() => {
    if (!profile?.atualizado_em) return "—";
    const date = new Date(profile.atualizado_em);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR");
  }, [profile?.atualizado_em]);

  async function loadConfiguracoes() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/configuracoes", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar configurações");
      }

      const configuracoes = data.configuracoes as ConfiguracoesProfile | undefined;
      if (configuracoes) {
        setProfile(configuracoes);
        setForm({
          nome: configuracoes.nome || "",
          email: configuracoes.email || "",
          crm: configuracoes.crm || "",
          crm_uf: configuracoes.crm_uf || "",
          especialidade: configuracoes.especialidade || "",
          telefone: configuracoes.telefone || "",
          assinatura_data_url: configuracoes.assinatura_data_url || "",
        });
      }
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Erro ao carregar configurações";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "crm_uf" ? value.toUpperCase() : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/configuracoes", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar configurações");
      }

      const configuracoes = data.configuracoes as ConfiguracoesProfile | undefined;
      if (configuracoes) {
        setProfile(configuracoes);
        setForm({
          nome: configuracoes.nome || "",
          email: configuracoes.email || "",
          crm: configuracoes.crm || "",
          crm_uf: configuracoes.crm_uf || "",
          especialidade: configuracoes.especialidade || "",
          telefone: configuracoes.telefone || "",
          assinatura_data_url: configuracoes.assinatura_data_url || "",
        });
      }

      setSuccess(data.message || "Configurações salvas com sucesso");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Erro ao salvar configurações";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Configurações</h1>
        <p className="text-surface-600 mt-1">
          Atualize seus dados profissionais. Essas informações são usadas nas receitas, no cabeçalho e na identificação do médico.
        </p>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <Loader2 className="w-5 h-5 mx-auto mb-3 animate-spin text-primary-600" />
          <p className="text-surface-500">Carregando suas configurações...</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card space-y-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                    <User className="w-3.5 h-3.5" />
                    Perfil profissional
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-surface-900">Dados do médico</h2>
                  <p className="text-sm text-surface-500 mt-1">Esses dados aparecem nas prescrições e nos documentos da consulta.</p>
                </div>

                {success && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {success}
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Nome completo" required>
                  <input name="nome" value={form.nome} onChange={handleChange} className="input-field" placeholder="Dr. Fulano de Tal" required />
                </Field>
                <Field label="E-mail de login" required>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="voce@clinica.com" required />
                </Field>
                <Field label="CRM" required>
                  <input name="crm" value={form.crm} onChange={handleChange} className="input-field" placeholder="123456" required />
                </Field>
                <Field label="UF do CRM" required>
                  <input name="crm_uf" maxLength={2} value={form.crm_uf} onChange={handleChange} className="input-field uppercase" placeholder="SP" required />
                </Field>
                <Field label="Especialidade">
                  <input name="especialidade" value={form.especialidade} onChange={handleChange} className="input-field" placeholder="Cardiologia" />
                </Field>
                <Field label="Telefone / WhatsApp">
                  <input name="telefone" value={form.telefone} onChange={handleChange} className="input-field" placeholder="(11) 99999-9999" />
                </Field>
              </div>
            </div>

            <div className="card space-y-4">
              <div className="flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary-600" />
                <div>
                  <h2 className="font-semibold text-surface-900">Assinatura eletrônica</h2>
                  <p className="text-sm text-surface-500">Desenhe sua assinatura para usar nos PDFs padronizados.</p>
                </div>
              </div>

              <SignaturePad
                value={form.assinatura_data_url}
                onChange={(assinatura_data_url) =>
                  setForm((current) => ({
                    ...current,
                    assinatura_data_url,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-xs text-surface-500 leading-5">
                Ao salvar, seu cadastro é atualizado imediatamente e os próximos documentos passam a usar os novos dados.
              </p>
              <button type="submit" disabled={saving} className="btn-primary min-w-[180px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar alterações"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-surface-900">Plano atual</h2>
              </div>
              <div className="space-y-3 text-sm text-surface-700">
                <InfoRow label="Plano" value={profile?.plano || "trial"} />
                <InfoRow label="Trial até" value={profile?.trial_fim ? new Date(profile.trial_fim).toLocaleDateString("pt-BR") : "—"} />
                <InfoRow label="Última atualização" value={lastUpdated} />
              </div>
            </div>

            <div className="card border-amber-200 bg-amber-50/60">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-amber-700" />
                <h2 className="font-semibold text-surface-900">Segurança</h2>
              </div>
              <p className="text-sm text-surface-700 leading-6">
                O acesso continua protegido pela sessão autenticada. Se você alterar o e-mail, ele passa a ser o novo login do sistema.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="label">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
      <span className="text-xs uppercase tracking-wide text-surface-500">{label}</span>
      <span className="text-sm font-medium text-surface-900 text-right">{value}</span>
    </div>
  );
}
