import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";

// Register font that supports Portuguese characters
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

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#2563eb",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  doctorInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e3a5f",
  },
  doctorDetail: {
    fontSize: 9,
    color: "#4b5563",
    marginTop: 2,
  },
  patientSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1e3a5f",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  patientName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  prescriptionList: {
    marginBottom: 16,
  },
  prescriptionItem: {
    marginBottom: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
    backgroundColor: "#fafbff",
    borderRadius: 4,
  },
  medicineName: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  medicineDetail: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 2,
  },
  medicineInstructions: {
    fontSize: 9,
    color: "#374151",
    marginTop: 4,
    fontStyle: "italic",
  },
  warning: {
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    fontSize: 8,
    color: "#92400e",
  },
  signatureSection: {
    marginTop: 40,
    alignItems: "center",
  },
  signatureLine: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: "#9ca3af",
    marginTop: 30,
    textAlign: "center",
    fontSize: 9,
    color: "#6b7280",
    paddingTop: 6,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  dateSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 10,
    color: "#4b5563",
  },
});

interface PrescriptionPdfProps {
  doctor: {
    nome: string;
    crm: string;
    crmUf: string;
    especialidade?: string;
  };
  patient: {
    nome: string;
  };
  prescriptions: Array<{
    medicamento: string;
    dose: string | null;
    unidade: string | null;
    frequencia: string | null;
    via: string | null;
    posologia: string | null;
    advertencias: string | null;
  }>;
  date?: string;
}

function PrescriptionPdf({ doctor, patient, prescriptions, date }: PrescriptionPdfProps) {
  const currentDate = date || new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Receituário Médico</Text>
            <Text style={styles.subtitle}>Prescrição Eletrônica - ICP-Brasil</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 9, color: "#6b7280" }}>
              {currentDate}
            </Text>
          </View>
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.nome}</Text>
          <Text style={styles.doctorDetail}>
            CRM: {doctor.crm}/{doctor.crmUf}
            {doctor.especialidade && ` — ${doctor.especialidade}`}
          </Text>
        </View>

        {/* Patient */}
        <View style={styles.patientSection}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <Text style={styles.patientName}>{patient.nome}</Text>
        </View>

        {/* Prescriptions */}
        {prescriptions.length > 0 && (
          <View style={styles.prescriptionList}>
            <Text style={{ ...styles.sectionTitle, marginBottom: 12 }}>
              Prescrição
            </Text>
            {prescriptions.map((presc, index) => (
              <View key={index} style={styles.prescriptionItem} wrap={false}>
                <Text style={styles.medicineName}>
                  {index + 1}. {presc.medicamento}
                </Text>
                <Text style={styles.medicineDetail}>
                  {presc.dose} {presc.unidade || "mg"} — Via {presc.via || "oral"} —{" "}
                  {presc.frequencia || "Conforme orientação"}
                </Text>
                {presc.posologia && (
                  <Text style={styles.medicineInstructions}>
                    {presc.posologia}
                  </Text>
                )}
                {presc.advertencias && (
                  <View style={styles.warning}>
                    <Text>⚠ {presc.advertencias}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Date */}
        <View style={styles.dateSection} wrap={false}>
          <Text style={styles.dateText}>São Paulo, {currentDate}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureSection} wrap={false}>
          <Text style={styles.signatureLine}>
            {doctor.nome}
          </Text>
          <Text style={{ fontSize: 9, color: "#6b7280" }}>
            CRM {doctor.crm}/{doctor.crmUf}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Documento gerado eletronicamente - Validade juridica ICP-Brasil
          </Text>
          <Text style={styles.footerText}>
            CardioPront — Prontuário Inteligente
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default PrescriptionPdf;

export function generatePrescriptionPdfData(
  doctorData: { nome: string; crm: string; crmUf: string; especialidade?: string } | null,
  patientData: { nome: string } | null,
  prescriptions: Array<{
    medicamento: string;
    dose: string | null;
    unidade: string | null;
    frequencia: string | null;
    via: string | null;
    posologia: string | null;
    advertencias: string | null;
  }>
) {
  if (!doctorData || !patientData) {
    return null;
  }

  return {
    doctor: doctorData,
    patient: patientData,
    prescriptions,
  };
}
