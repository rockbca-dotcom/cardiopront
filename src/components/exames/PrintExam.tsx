"use client";

import { useEffect, useMemo, useState } from "react";
import { getSession } from "@/lib/auth";
import PdfDocumentActions from "@/components/documentos/PdfDocumentActions";
import ExamPdf, { type ExamDocumentConsultation, type ExamDocumentItem } from "@/components/documentos/ExamPdf";

interface DoctorProfile {
  nome: string;
  crm: string;
  crmUf: string;
  especialidade?: string | null;
  telefone?: string | null;
  assinatura_data_url?: string | null;
}

interface ExamBundleResponse {
  consulta: ExamDocumentConsultation;
  exames: ExamDocumentItem[];
}

interface PrintExamProps {
  consultationId: string;
}

export default function PrintExam({ consultationId }: PrintExamProps) {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [bundle, setBundle] = useState<ExamBundleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadBundle();
  }, [consultationId]);

  async function loadBundle() {
    setLoading(true);

    try {
      const [session, response] = await Promise.all([
        getSession(),
        fetch(`/api/exames/${consultationId}`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar exames");
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
      setBundle(data as ExamBundleResponse);
    } catch (error) {
      console.error("Error loading exam bundle:", error);
      setBundle(null);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  }

  const fileName = useMemo(() => {
    const date = bundle?.consulta?.data_consulta ? new Date(bundle.consulta.data_consulta).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
    return `exames-${consultationId}-${date}.pdf`;
  }, [bundle?.consulta?.data_consulta, consultationId]);

  if (loading) {
    return (
      <button className="btn-secondary text-sm inline-flex items-center gap-2" disabled>
        Carregando PDF...
      </button>
    );
  }

  if (!doctor || !bundle?.consulta || !bundle.exames.length) {
    return null;
  }

  return (
    <PdfDocumentActions
      document={<ExamPdf doctor={doctor} consultation={bundle.consulta} exams={bundle.exames} />}
      fileName={fileName}
    />
  );
}
