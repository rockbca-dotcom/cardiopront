"use client";
import { User, Shield, CreditCard } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Configurações</h1>
      
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-surface-900">Perfil</h2>
          </div>
          <p className="text-surface-500 text-sm">Dados do médico, CRM e especialidade</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-surface-900">Plano</h2>
          </div>
          <p className="text-surface-500 text-sm">Gerencie seu plano e assinatura</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-surface-900">Segurança</h2>
          </div>
          <p className="text-surface-500 text-sm">Senha, autenticação e logs de acesso</p>
        </div>
      </div>
    </div>
  );
}
