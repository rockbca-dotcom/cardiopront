export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cardiopront.com.br/#org",
        "name": "CardioPront",
        "description": "Prontuário eletrônico inteligente para cardiologistas com transcrição por voz, pedidos de exames cardiológicos e síntese por IA.",
        "url": "https://cardiopront.com.br",
        "logo": "https://cardiopront.com.br/favicon.svg",
        "sameAs": [],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+55-11-XXXX-XXXX",
          "contactType": "sales",
          "areaServed": "BR",
          "availableLanguage": "pt-BR"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "CardioPront",
        "applicationCategory": "MedicalApplication",
        "operatingSystem": "Web",
        "url": "https://cardiopront.com.br",
        "description": "Prontuário eletrônico inteligente para cardiologistas: transcrição por voz com IA, pedidos de exames cardiológicos (ECG, Eco, Holter, MAPA), prescrição com banco de medicamentos cardiovasculares, scores cardiovasculares automáticos (CHA₂DS₂-VASc, Framingham) e síntese de consultas por IA.",
        "featureList": [
          "Transcrição de consultas por voz com IA",
          "Pedidos de exames cardiológicos (25+ tipos)",
          "Prescrição de medicamentos cardiovasculares (30+ medicamentos)",
          "Scores cardiovasculares automáticos",
          "Síntese de consultas por IA",
          "Timeline cardiovascular do paciente",
          "Conformidade LGPD e CFM 1.821/2007",
          "Assinatura digital ICP-Brasil"
        ],
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "BRL",
          "lowPrice": "0",
          "highPrice": "499",
          "offerCount": "3",
          "url": "https://cardiopront.com.br/cadastro"
        },
        "provider": { "@id": "https://cardiopront.com.br/#org" }
      },
      {
        "@type": "WebSite",
        "url": "https://cardiopront.com.br",
        "name": "CardioPront",
        "inLanguage": "pt-BR",
        "publisher": { "@id": "https://cardiopront.com.br/#org" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://cardiopront.com.br/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "O sistema é específico para cardiologia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! O CardioPront foi construído do zero para cardiologistas. Temos templates de anamnese cardiovascular, catálogo de exames cardiológicos, banco de medicamentos cardíacos e escores como CHA₂DS₂-VASc e Framingham."
            }
          },
          {
            "@type": "Question",
            "name": "A transcrição por voz funciona com sotaque?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim. Usamos o Whisper da OpenAI com fine-tuning para vocabulário médico brasileiro, incluindo termos cardiológicos em português."
            }
          },
          {
            "@type": "Question",
            "name": "Meus dados estão seguros?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Totalmente. Servidores no Brasil, criptografia AES-256, conformidade com LGPD e CFM 1.821/2007. Assinatura digital ICP-Brasil em todos os documentos."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
