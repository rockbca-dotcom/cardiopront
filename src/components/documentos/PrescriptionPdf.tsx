import { StandardPdfDocument, PdfBulletList, PdfInfoGrid, PdfSection, formatDatePtBr, formatDateTimePtBr, textOrDash, type PdfDoctor, type PdfPatient, registerStandardPdfFonts } from "@/lib/pdf-standard";

registerStandardPdfFonts();

export interface PrescriptionDocumentItem {
  medicamento: string;
  principio_ativo: string | null;
  dose: string | null;
  unidade: string | null;
  frequencia: string | null;
  via: string | null;
  posologia: string | null;
  advertencias: string | null;
}

export interface PrescriptionDocumentConsultation {
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

interface PrescriptionPdfProps {
  doctor: PdfDoctor;
  consultation: PrescriptionDocumentConsultation;
  prescriptions: Array<PrescriptionDocumentItem & { data_prescricao?: string | null; validade_dias?: number | null }>;
}

function formatType(value?: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function PrescriptionPdf({ doctor, consultation, prescriptions }: PrescriptionPdfProps) {
  const patient = consultation.pacientes || { nome: "Paciente não informado" };
  const dateLabel = prescriptions[0]?.data_prescricao
    ? formatDatePtBr(prescriptions[0].data_prescricao)
    : formatDateTimePtBr(consultation.data_consulta);

  const doctorLines = [
    `CRM ${doctor.crm}/${doctor.crmUf}`,
    doctor.especialidade || null,
    doctor.telefone ? `Contato: ${doctor.telefone}` : null,
  ];

  const patientLines = [
    patient.nascimento ? `Nascimento: ${formatDatePtBr(patient.nascimento)}` : null,
    patient.sexo ? `Sexo: ${patient.sexo}` : null,
    patient.cpf ? `CPF: ${patient.cpf}` : null,
    patient.telefone ? `Telefone: ${patient.telefone}` : null,
    patient.email ? `E-mail: ${patient.email}` : null,
  ];

  const warningLines = prescriptions
    .map((item) => item.advertencias?.trim())
    .filter((item): item is string => Boolean(item));

  return (
    <StandardPdfDocument
      title="Receita Médica"
      subtitle="Prescrição eletrônica padronizada para envio e impressão"
      dateLabel={dateLabel}
      doctor={doctor}
      patient={patient}
      doctorLines={doctorLines}
      patientLines={patientLines}
      footerLeft="Prescrição eletrônica"
      footerRight="CardioPront"
    >
      <PdfSection title="Contexto clínico">
        <PdfInfoGrid
          items={[
            { label: "Consulta", value: formatType(consultation.tipo) },
            { label: "Motivo", value: textOrDash(consultation.motivo_consulta), wide: true },
            { label: "Queixa principal", value: textOrDash(consultation.queixa_principal), wide: true },
            { label: "Diagnóstico", value: textOrDash(consultation.diagnostico) },
            { label: "Conduta", value: textOrDash(consultation.conduta), wide: true },
            { label: "Orientações", value: textOrDash(consultation.orientacoes), wide: true },
          ]}
        />
      </PdfSection>

      <PdfSection title="Medicamentos prescritos">
        {prescriptions.map((item, index) => (
          <PdfSection key={`${item.medicamento}-${index}`} title={`${index + 1}. ${item.medicamento}`} wrap={false}>
            <PdfInfoGrid
              items={[
                { label: "Princípio ativo", value: textOrDash(item.principio_ativo) },
                { label: "Dose", value: [textOrDash(item.dose), item.unidade || ""].filter(Boolean).join(" ") || "—" },
                { label: "Frequência", value: textOrDash(item.frequencia) },
                { label: "Via", value: textOrDash(item.via) },
                { label: "Posologia", value: textOrDash(item.posologia), wide: true },
              ]}
            />

            {item.advertencias && (
              <PdfSection title="Advertências" wrap={false}>
                <PdfBulletList items={[item.advertencias]} />
              </PdfSection>
            )}
          </PdfSection>
        ))}
      </PdfSection>

      {warningLines.length > 0 && (
        <PdfSection title="Resumo de advertências">
          <PdfBulletList items={warningLines} />
        </PdfSection>
      )}
    </StandardPdfDocument>
  );
}
