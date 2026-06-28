import type { ReactNode } from "react";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

let fontsRegistered = false;

export function registerStandardPdfFonts() {
  if (fontsRegistered) return;

  Font.register({
    family: "Inter",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff",
        fontWeight: 600,
      },
      {
        src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff",
        fontWeight: 700,
      },
    ],
  });

  fontsRegistered = true;
}

export interface PdfDoctor {
  nome: string;
  crm: string;
  crmUf: string;
  especialidade?: string | null;
  telefone?: string | null;
  assinatura_data_url?: string | null;
}

export interface PdfPatient {
  nome: string;
  nascimento?: string | null;
  sexo?: string | null;
  cpf?: string | null;
  telefone?: string | null;
  email?: string | null;
}

export interface PdfInfoItem {
  label: string;
  value: string;
  wide?: boolean;
}

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 36,
    paddingBottom: 66,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: "#002740",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#002740",
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#475569",
    marginTop: 3,
    maxWidth: 360,
  },
  dateBox: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 9,
    color: "#64748b",
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#dbe3ea",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  doctorCard: {
    backgroundColor: "#f0f6fb",
  },
  patientCard: {
    backgroundColor: "#f8fafc",
  },
  cardLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
  },
  cardLine: {
    fontSize: 9,
    color: "#334155",
    marginTop: 2,
  },
  content: {
    marginTop: 4,
  },
  section: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#002740",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
    width: "48.5%",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbe3ea",
    backgroundColor: "#f8fafc",
    marginBottom: 8,
  },
  infoCardWide: {
    width: "100%",
  },
  infoLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9.5,
    color: "#0f172a",
    lineHeight: 1.45,
  },
  paragraph: {
    fontSize: 9.5,
    color: "#0f172a",
    lineHeight: 1.55,
  },
  subCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#dbe3ea",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  subCardTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  subCardMeta: {
    fontSize: 9,
    color: "#475569",
    marginTop: 1,
    lineHeight: 1.45,
  },
  bulletList: {
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: "#002740",
    lineHeight: 1.3,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#0f172a",
    lineHeight: 1.45,
  },
  warningCard: {
    borderWidth: 1,
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  warningText: {
    fontSize: 9,
    color: "#92400e",
    lineHeight: 1.4,
  },
  signatureWrap: {
    marginTop: 18,
    paddingTop: 14,
    alignItems: "center",
  },
  signatureImage: {
    width: 160,
    height: 60,
    objectFit: "contain",
    marginBottom: 4,
  },
  signatureSpacer: {
    width: 160,
    height: 54,
  },
  signatureLine: {
    width: 240,
    borderTopWidth: 1,
    borderTopColor: "#64748b",
    marginTop: 2,
    paddingTop: 5,
    textAlign: "center",
    fontSize: 9,
    color: "#334155",
  },
  signatureMeta: {
    fontSize: 8.5,
    color: "#64748b",
    marginTop: 1,
    textAlign: "center",
  },
  signatureHint: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 1,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
});

function parseDateForPdf(value?: string | null) {
  if (!value) return null;
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsed = isDateOnly ? new Date(`${value}T12:00:00`) : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDatePtBr(value?: string | null) {
  const parsed = parseDateForPdf(value);
  if (!parsed) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export function formatTimePtBr(value?: string | null) {
  const parsed = parseDateForPdf(value);
  if (!parsed) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function formatDateTimePtBr(value?: string | null) {
  const date = formatDatePtBr(value);
  const time = formatTimePtBr(value);
  return date === "—" || time === "—" ? "—" : `${date} ${time}`;
}

export function formatSex(value?: string | null) {
  if (!value) return "—";
  if (value === "M") return "Masculino";
  if (value === "F") return "Feminino";
  if (value === "O") return "Outro";
  return value;
}

export function textOrDash(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function cleanLines(lines: Array<string | null | undefined>) {
  return lines.map((line) => (line ?? "").trim()).filter(Boolean);
}

function PersonCard({
  tone,
  label,
  name,
  lines,
}: {
  tone: "doctor" | "patient";
  label: string;
  name: string;
  lines: Array<string | null | undefined>;
}) {
  return (
    <View style={[pdfStyles.card, tone === "doctor" ? pdfStyles.doctorCard : pdfStyles.patientCard]}>
      <Text style={pdfStyles.cardLabel}>{label}</Text>
      <Text style={pdfStyles.cardName}>{name}</Text>
      {cleanLines(lines).map((line) => (
        <Text key={line} style={pdfStyles.cardLine}>{line}</Text>
      ))}
    </View>
  );
}

export function PdfSection({
  title,
  children,
  wrap = true,
}: {
  title: string;
  children: ReactNode;
  wrap?: boolean;
}) {
  return (
    <View style={pdfStyles.section} wrap={wrap}>
      <Text style={pdfStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function PdfInfoGrid({ items }: { items: PdfInfoItem[] }) {
  return (
    <View style={pdfStyles.infoGrid}>
      {items.map((item, index) => (
        <View
          key={`${item.label}-${index}`}
          style={item.wide ? [pdfStyles.infoCard, pdfStyles.infoCardWide] : pdfStyles.infoCard}
        >
          <Text style={pdfStyles.infoLabel}>{item.label}</Text>
          <Text style={pdfStyles.infoValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function PdfBulletList({ items }: { items: Array<string | null | undefined> }) {
  const cleanItems = cleanLines(items);
  if (cleanItems.length === 0) return null;

  return (
    <View style={pdfStyles.bulletList}>
      {cleanItems.map((item) => (
        <View key={item} style={pdfStyles.bulletRow}>
          <Text style={pdfStyles.bulletDot}>•</Text>
          <Text style={pdfStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function PdfSignatureBlock({ doctor }: { doctor: PdfDoctor }) {
  return (
    <View style={pdfStyles.signatureWrap} wrap={false}>
      {doctor.assinatura_data_url ? (
        <Image src={doctor.assinatura_data_url} style={pdfStyles.signatureImage} />
      ) : (
        <View style={pdfStyles.signatureSpacer} />
      )}
      <Text style={pdfStyles.signatureLine}>{doctor.nome}</Text>
      <Text style={pdfStyles.signatureMeta}>
        CRM {doctor.crm}/{doctor.crmUf}
        {doctor.especialidade ? ` • ${doctor.especialidade}` : ""}
      </Text>
      <Text style={pdfStyles.signatureHint}>Assinatura eletrônica do médico</Text>
    </View>
  );
}

export interface StandardPdfDocumentProps {
  title: string;
  subtitle: string;
  dateLabel?: string;
  doctor: PdfDoctor;
  patient: PdfPatient;
  doctorLines?: Array<string | null | undefined>;
  patientLines?: Array<string | null | undefined>;
  footerLeft?: string;
  footerRight?: string;
  children: ReactNode;
}

export function StandardPdfDocument({
  title,
  subtitle,
  dateLabel,
  doctor,
  patient,
  doctorLines = [],
  patientLines = [],
  footerLeft = "Documento gerado eletronicamente",
  footerRight = "CardioPront",
  children,
}: StandardPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page} wrap>
        <View style={pdfStyles.header}>
          <View>
            <Text style={pdfStyles.headerTitle}>{title}</Text>
            <Text style={pdfStyles.headerSubtitle}>{subtitle}</Text>
          </View>

          <View style={pdfStyles.dateBox}>
            <Text style={pdfStyles.dateLabel}>{dateLabel || ""}</Text>
          </View>
        </View>

        <PersonCard tone="doctor" label="Médico" name={doctor.nome} lines={doctorLines} />
        <PersonCard tone="patient" label="Paciente" name={patient.nome} lines={patientLines} />

        <View style={pdfStyles.content}>{children}</View>

        <PdfSignatureBlock doctor={doctor} />

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>{footerLeft}</Text>
          <Text style={pdfStyles.footerText}>{footerRight}</Text>
        </View>
      </Page>
    </Document>
  );
}
