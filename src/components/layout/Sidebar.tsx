"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Pill,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth";

const navItems = [
  { href: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/pacientes", icon: Users, label: "Pacientes" },
  { href: "/app/consultas", icon: Stethoscope, label: "Consultas" },
  { href: "/app/exames", icon: FileText, label: "Exames" },
  { href: "/app/prescricao", icon: Pill, label: "Prescrições" },
  { href: "/app/configuracoes", icon: Settings, label: "Configurações" },
];

export default function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut();
    window.location.href = "/login";
  }

  return (
    <aside className="w-64 bg-white border-r border-surface-200 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-surface-200">
        <Link href="/app" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg text-surface-900">CardioPront</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
