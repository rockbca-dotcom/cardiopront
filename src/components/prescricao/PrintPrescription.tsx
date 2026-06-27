"use client";

import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Printer, Loader2 } from "lucide-react";
import PrescriptionPdf from "@/lib/generatePrescriptionPdf";

interface PrescriptionItem {
  medicamento: string;
  principio_ativo: string;
  dose: string | null;
  unidade: string | null;
  frequencia: string | null;
  via: string | null;
  posologia: string | null;
  advertencias: string | null;
}

interface PrintPrescriptionProps {
  prescriptionId: string;
  patientNome: string;
  items: PrescriptionItem[];
}

export default function PrintPrescription({
  prescriptionId,
  patientNome,
  items,
}: PrintPrescriptionProps) {
  const [doctor, setDoctor] = useState<{
    nome: string;
    crm: string;
    crmUf: string;
    especialidade?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  async function fetchDoctorData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user?.medico) {
        setDoctor({
          nome: data.user.medico.nome,
          crm: data.user.medico.crm,
          crmUf: data.user.medico.crm_uf,
          especialidade: data.user.medico.especialidade,
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <button className="btn-secondary text-sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  if (!doctor) {
    return null;
  }

  const pdfData = {
    doctor,
    patient: { nome: patientNome },
    prescriptions: items,
  };

  return (
    <PDFDownloadLink
      document={<PrescriptionPdf {...pdfData} />}
      fileName={`receita-${prescriptionId}-${new Date().toISOString().split("T")[0]}.pdf`}
      className="btn-secondary text-sm inline-flex items-center gap-2"
    >
      {({ loading }) =>
        loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Printer className="w-4 h-4" />
            Imprimir
          </>
        )
      }
    </PDFDownloadLink>
  );
}
