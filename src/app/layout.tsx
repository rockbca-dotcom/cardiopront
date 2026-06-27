import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SchemaOrg from "./SchemaOrg";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CardioPront — O prontuário que entende de coração",
  description:
    "Prontuário eletrônico inteligente para cardiologistas: transcrição por voz, pedidos de exames cardiológicos, prescrição com banco de medicamentos e síntese por IA. Sem cartão de crédito.",
  keywords: [
    "prontuário eletrônico cardiologia",
    "software cardiologia",
    "prontuário médico cardiovascular",
    "prescrição cardiológica",
    "pedidos de exames cardiológicos",
    "transcrição por voz cardiologia",
    "prontuário eletrônico com IA",
    "score cardiovascular",
  ],
  authors: [{ name: "CardioPront" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "CardioPront",
    title: "CardioPront — O prontuário que entende de coração",
    description:
      "Prontuário eletrônico inteligente para cardiologistas: transcrição por voz, pedidos de exames, prescrição e síntese por IA.",
    images: [
      {
        url: "https://cardiopront.com.br/og-cover.png",
        width: 1200,
        height: 630,
        alt: "CardioPront — prontuário eletrônico para cardiologistas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CardioPront — O prontuário que entende de coração",
    description:
      "Prontuário eletrônico inteligente para cardiologistas: transcrição por voz, pedidos de exames, prescrição e síntese por IA.",
  },
  alternates: {
    canonical: "https://cardiopront.com.br",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <SchemaOrg />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
