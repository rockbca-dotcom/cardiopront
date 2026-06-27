"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      window.location.href = "/app";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro de conexão";
      setError(message || "E-mail ou senha incorretos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-7 h-7 text-primary-600" />
            <span className="font-bold text-xl text-surface-900">CardioPront</span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Entrar na sua conta</h1>
          <p className="text-surface-600 mt-2">Acesse seu prontuário cardiológico</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="label">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="seu@email.com" required />
          </div>

          <div>
            <label className="label">Senha</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full h-11">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-sm text-surface-600">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-primary-600 font-medium hover:underline">Cadastre-se grátis</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
