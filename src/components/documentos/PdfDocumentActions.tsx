"use client";

import { useState } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { Download, Loader2, Printer } from "lucide-react";
import type { ReactElement } from "react";

interface PdfDocumentActionsProps {
  document: ReactElement;
  fileName: string;
  downloadLabel?: string;
  printLabel?: string;
  className?: string;
}

export default function PdfDocumentActions({
  document,
  fileName,
  downloadLabel = "Baixar PDF",
  printLabel = "Imprimir",
  className = "btn-secondary text-sm inline-flex items-center gap-2",
}: PdfDocumentActionsProps) {
  const [printing, setPrinting] = useState(false);

  async function handlePrint() {
    setPrinting(true);
    try {
      const blob = await pdf(document as any).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank", "noopener,noreferrer");

      if (!win) {
        URL.revokeObjectURL(url);
        return;
      }

      const tryPrint = () => {
        try {
          win.focus();
          win.print();
        } catch {
          // The browser PDF viewer will still be open for manual print.
        }
      };

      if (win.document?.readyState === "complete") {
        window.setTimeout(tryPrint, 250);
      } else {
        win.addEventListener("load", () => window.setTimeout(tryPrint, 250), { once: true });
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } finally {
      setPrinting(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <PDFDownloadLink document={document as any} fileName={fileName} className={className}>
        {({ loading }) =>
          loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {downloadLabel}
            </>
          )
        }
      </PDFDownloadLink>

      <button type="button" onClick={handlePrint} className={className}>
        {printing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Abrindo...
          </>
        ) : (
          <>
            <Printer className="w-4 h-4" />
            {printLabel}
          </>
        )}
      </button>
    </div>
  );
}
