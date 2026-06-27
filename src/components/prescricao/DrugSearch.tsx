"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Pill } from "lucide-react";

export interface MedicamentoCatalogo {
  id: string;
  classe: string;
  principio_ativo: string;
  nome_comercial: string | null;
  apresentacao: string | null;
  dose_padrao: string | null;
  dose_maxima: number | null;
  unidade: string | null;
  via: string | null;
  ajuste_renal: boolean;
  principais_interacoes: string | null;
  contraindicacoes: string | null;
}

interface DrugSearchProps {
  onSelectDrug: (drug: MedicamentoCatalogo) => void;
}

export default function DrugSearch({ onSelectDrug }: DrugSearchProps) {
  const [drugs, setDrugs] = useState<MedicamentoCatalogo[]>([]);
  const [search, setSearch] = useState("");
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDrugs(); }, []);

  async function fetchDrugs() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/prescricao/catalogo", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDrugs(data.medicamentos || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  const classes = Array.from(new Set(drugs.map((d) => d.classe))).sort();
  const filteredDrugs = drugs.filter((d) => {
    const matchClass = !activeClass || d.classe === activeClass;
    const matchSearch = !search || d.principio_ativo.toLowerCase().includes(search.toLowerCase()) || d.nome_comercial?.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  if (loading) return <div className="text-center py-8"><p className="text-surface-500">Carregando medicamentos...</p></div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Buscar medicamento..." />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setActiveClass(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!activeClass ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"}`}>Todos</button>
        {classes.map((cls) => (
          <button key={cls} onClick={() => setActiveClass(cls)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeClass === cls ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"}`}>{cls}</button>
        ))}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredDrugs.map((drug) => (
          <div key={drug.id} className="card-hover cursor-pointer flex items-start justify-between gap-3" onClick={() => onSelectDrug(drug)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><Pill className="w-3.5 h-3.5 text-primary-500 shrink-0" /><p className="font-medium text-surface-900 text-sm truncate">{drug.principio_ativo}</p></div>
              {drug.nome_comercial && <p className="text-xs text-surface-500 mt-0.5 ml-5.5">{drug.nome_comercial}</p>}
              <div className="flex items-center gap-3 mt-1 ml-5.5">
                {drug.apresentacao && <span className="text-xs text-surface-400">{drug.apresentacao}</span>}
                {drug.ajuste_renal && <span className="text-xs text-amber-600 font-medium">Ajuste renal</span>}
              </div>
            </div>
            <div className="shrink-0 w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-surface-400 hover:bg-primary-100 hover:text-primary-600"><Plus className="w-3.5 h-3.5" /></div>
          </div>
        ))}
        {filteredDrugs.length === 0 && <p className="text-center text-surface-500 py-8 text-sm">Nenhum medicamento encontrado.</p>}
      </div>
    </div>
  );
}
