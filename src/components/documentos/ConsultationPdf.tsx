import { Text } from "@react-pdf/renderer";

import type { ConsultationAIDraft } from "@/lib/consultation-ai";
import {
  PdfBulletList,
  PdfInfoGrid,
  PdfSection,
  StandardPdfDocument,
  formatDatePtBr,
  formatDateTimePtBr,
  formatSex,
  pdfStyles,
  textOrDash,
  type PdfDoctor,
  type PdfPatient,
  registerStandardPdfFonts,
  } from "@/lib/pdf-standard";

registerStandardPdfFonts();

export interface ConsultationDocumentData {
  id: string;
  data_consulta: string;
  tipo: string;
  motivo_consulta: string | null;
  queixa_principal: string | null;
  historia_doenca_atual: string | null;
  historia_familiar_cardiovascular: string | null;
  pa_sistolica: number | null;
  pa_diastolica: number | null;
  fc: number | null;
  fr: number | null;
  temp_celsius: number | null;
  saturacao_o2: number | null;
  peso_kg: number | null;
  altura_cm: number | null;
  imc: number | null;
  exame_fisico_geral: string | null;
  diagnostico: string | null;
  cid10: string | null;
  conduta: string | null;
  orientacoes: string | null;
  audio_url: string | null;
  transcricao_completa: string | null;
  sintese_ia: ConsultationAIDraft | null;
  pacientes?: PdfPatient | null;
}

interface ConsultationPdfProps {
  doctor: PdfDoctor;
  consultation: ConsultationDocumentData;
}

function yesNo(value: number | null) {
  return value === null || Number.isNaN(Number(value)) ? "—" : String(value);
}

function formatList(items: Array<string | null | undefined>) {
  return items.map((item) => (item ?? "").trim()).filter(Boolean);
}

function formatType(value?: string | null) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ConsultationPdf({ doctor, consultation }: ConsultationPdfProps) {
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

  const synthesis = consultation.sintese_ia;

  return (
    <StandardPdfDocument
      title="Consulta Cardiológica"
      subtitle="Resumo clínico, transcrição e síntese IA"
      dateLabel={formatDateTimePtBr(consultation.data_consulta)}
      doctor={doctor}
      patient={patient}
      doctorLines={doctorLines}
      patientLines={patientLines}
      footerLeft="Consulta médica registrada eletronicamente"
      footerRight="CardioPront"
    >
      <PdfSection title="Resumo clínico">
        <PdfInfoGrid
          items={[
            { label: "Tipo", value: formatType(consultation.tipo) },
            { label: "Motivo da consulta", value: textOrDash(consultation.motivo_consulta), wide: true },
            { label: "Queixa principal", value: textOrDash(consultation.queixa_principal), wide: true },
            { label: "História da doença atual", value: textOrDash(consultation.historia_doenca_atual), wide: true },
            { label: "História familiar cardiovascular", value: textOrDash(consultation.historia_familiar_cardiovascular), wide: true },
            { label: "Exame físico geral", value: textOrDash(consultation.exame_fisico_geral), wide: true },
            { label: "Diagnóstico", value: textOrDash(consultation.diagnostico) },
            { label: "CID-10", value: textOrDash(consultation.cid10) },
            { label: "Conduta", value: textOrDash(consultation.conduta), wide: true },
            { label: "Orientações", value: textOrDash(consultation.orientacoes), wide: true },
          ]}
        />
      </PdfSection>

      <PdfSection title="Sinais vitais">
        <PdfInfoGrid
          items={[
            { label: "PA", value: consultation.pa_sistolica && consultation.pa_diastolica ? `${consultation.pa_sistolica}/${consultation.pa_diastolica} mmHg` : "—" },
            { label: "FC", value: yesNo(consultation.fc) === "—" ? "—" : `${consultation.fc} bpm` },
            { label: "FR", value: yesNo(consultation.fr) === "—" ? "—" : `${consultation.fr} irpm` },
            { label: "Temperatura", value: consultation.temp_celsius === null ? "—" : `${consultation.temp_celsius} °C` },
            { label: "SpO2", value: consultation.saturacao_o2 === null ? "—" : `${consultation.saturacao_o2}%` },
            { label: "Peso", value: consultation.peso_kg === null ? "—" : `${consultation.peso_kg} kg` },
            { label: "Altura", value: consultation.altura_cm === null ? "—" : `${consultation.altura_cm} cm` },
            { label: "IMC", value: consultation.imc === null ? "—" : `${consultation.imc}` },
          ]}
        />
      </PdfSection>

      <PdfSection title="Áudio da consulta">
        <PdfInfoGrid
          items={[
            { label: "Arquivo de áudio", value: consultation.audio_url || "Não anexado", wide: true },
          ]}
        />
      </PdfSection>

      {consultation.transcricao_completa && (
        <PdfSection title="Transcrição completa">
          <Text style={pdfStyles.paragraph}>{consultation.transcricao_completa}</Text>
        </PdfSection>
      )}

      {synthesis && (
        <PdfSection title="Síntese por IA">
          <PdfInfoGrid
            items={[
              { label: "Motivo", value: textOrDash(synthesis.motivo_consulta), wide: true },
              { label: "Queixa principal", value: textOrDash(synthesis.queixa_principal), wide: true },
              { label: "História da doença atual", value: textOrDash(synthesis.historia_doenca_atual), wide: true },
              { label: "Conduta", value: textOrDash(synthesis.conduta), wide: true },
              { label: "Orientações ao paciente", value: textOrDash(synthesis.orientacoes_paciente), wide: true },
            ]}
          />

          {formatList(synthesis.achados_relevantes).length > 0 && (
            <PdfSection title="Achados relevantes" wrap={false}>
              <PdfBulletList items={formatList(synthesis.achados_relevantes)} />
            </PdfSection>
          )}

          {formatList(synthesis.diagnosticos_suspeitos).length > 0 && (
            <PdfSection title="Diagnósticos suspeitos" wrap={false}>
              <PdfBulletList items={formatList(synthesis.diagnosticos_suspeitos)} />
            </PdfSection>
          )}

          {synthesis.exames_pedidos.length > 0 && (
            <PdfSection title="Exames pedidos" wrap={false}>
              <PdfBulletList
                items={synthesis.exames_pedidos.map((item) => `${item.tipo || "Exame"}${item.indicacao ? ` — ${item.indicacao}` : ""}`)}
              />
            </PdfSection>
          )}

          {synthesis.medicamentos_ajustados.length > 0 && (
            <PdfSection title="Medicamentos ajustados" wrap={false}>
              <PdfBulletList
                items={synthesis.medicamentos_ajustados.map((item) => `${item.nome || "Medicamento"}${item.dose ? ` ${item.dose}` : ""}${item.acao ? ` — ${item.acao}` : ""}`)}
              />
            </PdfSection>
          )}

          {synthesis.encaminhamentos_sugeridos.length > 0 && (
            <PdfSection title="Encaminhamentos sugeridos" wrap={false}>
              <PdfBulletList
                items={synthesis.encaminhamentos_sugeridos.map(
                  (item) => `${item.especialidade || "Especialidade"}${item.prioridade ? ` • ${item.prioridade}` : ""}${item.justificativa ? ` — ${item.justificativa}` : ""}`,
                )}
              />
            </PdfSection>
          )}

          {formatList(synthesis.sinais_de_alerta).length > 0 && (
            <PdfSection title="Sinais de alerta" wrap={false}>
              <PdfBulletList items={formatList(synthesis.sinais_de_alerta)} />
            </PdfSection>
          )}

          {formatList(synthesis.trechos_suporte).length > 0 && (
            <PdfSection title="Trechos de suporte" wrap={false}>
              <PdfBulletList items={formatList(synthesis.trechos_suporte)} />
            </PdfSection>
          )}
        </PdfSection>
      )}
    </StandardPdfDocument>
  );
}
