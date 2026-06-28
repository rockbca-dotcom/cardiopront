"use client";

import { useEffect, useMemo, useState } from "react";

import PdfDocumentActions from "@/components/documentos/PdfDocumentActions";
import PrescriptionPdf, {
  type PrescriptionDocumentConsultation,
  type PrescriptionDocumentItem,
} from "@/components/documentos/PrescriptionPdf";
import { getSession } from "@/lib/auth";

interface PrintPrescriptionProps {
  prescriptionId: string;
  patientNome: string;
  items: Array<{
    medicamento: string;
    principio_ativo: string;
    dose: string | null;
    unidade: string | null;
    frequencia: string | null;
    via: string | null;
    posologia: string | null;
    advertencias: string | null;
  }>;
}

interface DoctorProfile {
  nome: string;
  crm: string;
  crmUf: string;
  especialidade?: string | null;
  telefone?: string | null;
  assinatura_data_url?: string | null;
}

interface PrescriptionBundleResponse {
  consulta: PrescriptionDocumentConsultation;
  prescricoes: Array<PrescriptionDocumentItem & { data_prescricao?: string | null; validade_dias?: number | null }>;
}

export default function PrintPrescription({ prescriptionId }: PrintPrescriptionProps) {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [bundle, setBundle] = useState<PrescriptionBundleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadBundle();
  }, [prescriptionId]);

  async function loadBundle() {
    setLoading(true);

    try {
      const [session, response] = await Promise.all([
        getSession(),
        fetch(`/api/prescricao/${prescriptionId}`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar prescrição");
      }

      setDoctor(
        session?.user?.medico
          ? {
              nome: session.user.medico.nome,
              crm: session.user.medico.crm,
              crmUf: session.user.medico.crm_uf,
              especialidade: session.user.medico.especialidade,
              telefone: session.user.medico.telefone,
              assinatura_data_url: session.user.medico.assinatura_data_url,
            }
          : null,
      );
      setBundle(data as PrescriptionBundleResponse);
    } catch (error) {
      console.error("Error loading prescription bundle:", error);
      setBundle(null);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  }

  const fileName = useMemo(() => {
    const date = bundle?.prescricoes?.[0]?.data_prescricao || new Date().toISOString().split("T")[0];
    return `prescricao-${prescriptionId}-${date}.pdf`;
  }, [bundle?.prescricoes, prescriptionId]);

  if (loading) {
    return (
      <button className="btn-secondary text-sm inline-flex items-center gap-2" disabled>
        Gerando PDF...
      </button>
    );
  }

  if (!doctor || !bundle?.consulta || !bundle.prescricoes.length) {
    return null;
  }

  return (
    <PdfDocumentActions
      document={<PrescriptionPdf doctor={doctor} consultation={bundle.consulta} prescriptions={bundle.prescricoes} />}
      fileName={fileName}
    />
  );
}
