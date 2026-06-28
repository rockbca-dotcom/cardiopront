"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Printer, Loader2 } from "lucide-react";

import { getSession } from "@/lib/auth";
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
    void fetchDoctorData();
  }, []);

  async function fetchDoctorData() {
    try {
      const session = await getSession();
      const medico = session?.user?.medico;

      if (medico) {
        setDoctor({
          nome: medico.nome,
          crm: medico.crm,
          crmUf: medico.crm_uf,
          especialidade: medico.especialidade,
        });
      } else {
        setDoctor(null);
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
      setDoctor(null);
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
