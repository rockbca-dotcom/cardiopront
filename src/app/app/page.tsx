"use client";

import { useEffect, useState } from "react";
import { Users, Stethoscope, FileText, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    pacientes: 0,
    consultas: 0,
    exames: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-600 mt-1">Visão geral do seu consultório</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Pacientes"
          value={stats.pacientes}
          color="blue"
        />
        <StatCard
          icon={<Stethoscope className="w-6 h-6" />}
          label="Consultas"
          value={stats.consultas}
          color="green"
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Exames pedidos"
          value={stats.exames}
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/app/pacientes" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Cadastrar paciente</h3>
            <p className="text-sm text-surface-600">Adicione um novo paciente cardiovascular</p>
          </div>
        </Link>
        <Link href="/app/consultas/nova" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Nova consulta</h3>
            <p className="text-sm text-surface-600">Inicie uma consulta com gravação por IA</p>
          </div>
        </Link>
        <Link href="/app/exames/novo" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Pedir exames</h3>
            <p className="text-sm text-surface-600">ECG, Eco, Holter, MAPA e mais</p>
          </div>
        </Link>
        <Link href="/app/prescricao/nova" className="card-hover flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Nova prescrição</h3>
            <p className="text-sm text-surface-600">Prescreva medicamentos cardiovasculares</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-primary-50 text-primary-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-surface-900">{value}</div>
          <div className="text-sm text-surface-600">{label}</div>
        </div>
      </div>
    </div>
  );
}
