import {
  PdfBulletList,
  PdfInfoGrid,
  PdfSection,
  StandardPdfDocument,
  formatDatePtBr,
  formatDateTimePtBr,
  formatSex,
  textOrDash,
  type PdfDoctor,
  type PdfPatient,
  registerStandardPdfFonts,
  pdfStyles,
} from "@/lib/pdf-standard";

registerStandardPdfFonts();

export interface ExamDocumentItem {
  id: string;
  consulta_id: string;
  paciente_id: string;
  tipo_exame_id: string;
  prioridade: "rotina" | "urgente" | "eletiva" | string;
  indicacao_clinica: string | null;
  data_pedido: string;
  data_resultado: string | null;
  resultado_texto: string | null;
  resultado_valores: unknown;
  status: "pendente" | "resultado_enviado" | "lido" | string;
  tipo_exame_nome: string;
  tipo_exame_categoria: string;
  tipo_exame_descricao?: string | null;
  tipo_exame_codigo_tus?: string | null;
}

export interface ExamDocumentConsultation {
  id: string;
  data_consulta: string;
  tipo: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  diagnostico: string | null;
  conduta: string | null;
  orientacoes: string | null;
  pacientes?: PdfPatient | null;
}

interface ExamPdfProps {
  doctor: PdfDoctor;
  consultation: ExamDocumentConsultation;
  exams: ExamDocumentItem[];
}

function formatType(value?: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatPriority(value?: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function stringifyResult(value: unknown) {
  if (!value) return "—";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function ExamPdf({ doctor, consultation, exams }: ExamPdfProps) {
  const patient = consultation.pacientes || { nome: "Paciente não informado" };
  const doctorLines = [
    `CRM ${doctor.crm}/${doctor.crmUf}`,
    doctor.especialidade || null,
    doctor.telefone ? `Contato: ${doctor.telefone}` : null,
  ];
  const patientLines = [
    patient.nascimento ? `Nascimento: ${formatDatePtBr(patient.nascimento)}` : null,
    patient.sexo ? `Sexo: ${formatSex(patient.sexo)}` : null,
    patient.cpf ? `CPF: ${patient.cpf}` : null,
    patient.telefone ? `Telefone: ${patient.telefone}` : null,
    patient.email ? `E-mail: ${patient.email}` : null,
  ];

  return (
    <StandardPdfDocument
      title="Pedido de Exames"
      subtitle="Solicitação padronizada e detalhada para envio"
      dateLabel={formatDateTimePtBr(consultation.data_consulta)}
      doctor={doctor}
      patient={patient}
      doctorLines={doctorLines}
      patientLines={patientLines}
      footerLeft="Pedido de exames eletrônico"
      footerRight="CardioPront"
    >
      <PdfSection title="Contexto clínico">
        <PdfInfoGrid
          items={[
            { label: "Tipo da consulta", value: formatType(consultation.tipo) },
            { label: "Motivo", value: textOrDash(consultation.motivo_consulta), wide: true },
            { label: "Queixa principal", value: textOrDash(consultation.queixa_principal), wide: true },
            { label: "Diagnóstico", value: textOrDash(consultation.diagnostico) },
            { label: "Conduta", value: textOrDash(consultation.conduta), wide: true },
            { label: "Orientações", value: textOrDash(consultation.orientacoes), wide: true },
          ]}
        />
      </PdfSection>

      <PdfSection title="Exames solicitados">
        {exams.map((exam, index) => (
          <PdfSection key={exam.id} title={`${index + 1}. ${exam.tipo_exame_nome}`} wrap={false}>
            <PdfInfoGrid
              items={[
                { label: "Categoria", value: textOrDash(exam.tipo_exame_categoria) },
                { label: "Código TUSS", value: textOrDash(exam.tipo_exame_codigo_tus) },
                { label: "Prioridade", value: formatPriority(exam.prioridade) },
                { label: "Status", value: formatPriority(exam.status) },
                { label: "Data do pedido", value: formatDatePtBr(exam.data_pedido) },
                { label: "Data do resultado", value: exam.data_resultado ? formatDatePtBr(exam.data_resultado) : "—" },
                { label: "Indicação clínica", value: textOrDash(exam.indicacao_clinica), wide: true },
                { label: "Resultado textual", value: textOrDash(exam.resultado_texto), wide: true },
                { label: "Dados do resultado", value: stringifyResult(exam.resultado_valores), wide: true },
              ]}
            />
          </PdfSection>
        ))}
      </PdfSection>

      {exams.some((exam) => exam.indicacao_clinica || exam.resultado_texto || exam.resultado_valores) && (
        <PdfSection title="Observações adicionais">
          <PdfBulletList
            items={exams.map((exam) => {
              const parts = [exam.tipo_exame_nome, exam.indicacao_clinica, exam.resultado_texto]
                .filter(Boolean)
                .map((item) => String(item).trim());
              return parts.join(" — ");
            })}
          />
        </PdfSection>
      )}
    </StandardPdfDocument>
  );
}
