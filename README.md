# CardioPront

**Prontuário eletrônico inteligente para cardiologistas brasileiros.**

Plataforma digital especializada em cardiologia que substitui papel, PDFs e sistemas genéricos por um prontuário com transcrição por voz, pedidos de exames cardiológicos, prescrição inteligente com alertas de interação e ajuste renal, cálculo de escores cardiovasculares validados e síntese automática de consultas por IA.

---

## Por que o CardioPront?

O cardiologista brasileiro enfrenta prontuários genéricos que não contemplam especificidades da cardiologia, perda de tempo com registro manual de consultas complexas, risco de erro em prescrições sem alertas e dificuldade de acompanhar a evolução cardiovascular do paciente.

O CardioPront resolve essas dores com:

- **Transcrição por voz** — grava a consulta e transcreve automaticamente em português brasileiro via Whisper.
- **Síntese por IA** — GPT-4o-mini gera um resumo estruturado da consulta (motivo, queixa, diagnóstico, conduta, exames, orientações).
- **Prescrição inteligente** — catálogo de 30 medicamentos cardiovasculares com alerta de interação medicamentosa e ajuste renal automático (CKD-EPI 2021 + Cockcroft-Gault).
- **Pedidos de exames** — catálogo de 24 tipos de exame cardiológico em 4 categorias.
- **Escores cardiovasculares** — CHA₂DS₂-VASc, HAS-BLED, Framingham, NYHA, Killip.
- **Geração de PDF** — receitas em PDF prontas para impressão.
- **Conformidade** — LGPD e CFM 1.821/2007.

---

## Funcionalidades

| Módulo | O que faz |
|---|---|
| **Autenticação** | Cadastro de médico com CRM/UF, login seguro, sessão via cookie httpOnly |
| **Dashboard** | Estatísticas de pacientes, consultas e exames com atalhos rápidos |
| **Pacientes** | Cadastro, histórico completo (consultas, exames, prescrições), cálculo de idade e IMC |
| **Consultas** | Formulário clínico completo, gravação de áudio, transcrição, síntese IA, prefill automático, follow-up |
| **Exames** | Catálogo cardiológico, pedidos com prioridade e indicação clínica |
| **Prescrição** | Catálogo de medicamentos, alerta de interação, ajuste renal, PDF de receita |
| **Escores** | CHA₂DS₂-VASc, HAS-BLED, Framingham, NYHA, Killip — persistidos por paciente |
| **Configurações** | Perfil do médico (nome, CRM, UF, especialidade, telefone) |

---

## Como funciona a consulta com IA

```
Médico seleciona paciente
        │
        ▼
Inicia gravação de áudio no navegador
        │
        ▼
Whisper transcreve a consulta (pt-BR)
        │
        ▼
GPT-4o-mini gera síntese estruturada (JSON validado)
        │
        ▼
Sistema sugere prefill de campos + plano de follow-up
        │
        ▼
Médico revisa, edita e aprova
        │
        ▼
Consulta salva com áudio, transcrição e síntese
```

> **A IA é assistente de preenchimento, não responsável final.** Todo rascunho é revisado e aprovado pelo médico antes de ser salvo.

---

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15, React 19, TailwindCSS, Lucide React |
| Backend | Next.js Route Handlers (TypeScript estrito) |
| Banco de dados | PostgreSQL via Supabase |
| Storage | Supabase Storage (áudios de consulta) |
| IA | OpenAI Whisper (transcrição) + GPT-4o-mini (síntese) |
| Autenticação | Custom com PBKDF2-SHA256, cookie httpOnly |
| Testes | Node.js native test runner via tsx |
| Deploy | Vercel |

---

## Planos

| Plano | Preço | Para quem |
|---|---|---|
| **Trial** | R$ 0 (14 dias) | Médicos que querem testar |
| **Profissional** | R$ 199/mês | Cardiologistas individuais |
| **Clínica** | R$ 499/mês | Clínicas multi-profissionais |

---

## Documentação

A documentação técnica e de governança está em [`docs/`](./docs):

| Documento | Descrição |
|---|---|
| [`docs/ESCOPO.md`](./docs/ESCOPO.md) | Escopo completo do projeto |
| [`docs/ARQUITETURA.md`](./docs/ARQUITETURA.md) | Arquitetura do sistema |
| [`docs/BANCO_DADOS.md`](./docs/BANCO_DADOS.md) | Arquitetura do banco de dados |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Roadmap de desenvolvimento |
| [`docs/CONTEXTO.md`](./docs/CONTEXTO.md) | Contexto vivo do projeto |
| [`docs/RELATORIO.md`](./docs/RELATORIO.md) | Registro diário de desenvolvimento |
| [`docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md`](./docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md) | Especificação técnica original (Arcane Tecnologia) |

Regras para agentes de IA e colaboradores: [`AGENTS.md`](./AGENTS.md)

---

## Quick start

```bash
# Instalar dependências
npm install

# Ambiente de desenvolvimento
npm run dev

# Build de produção
npm run build

# Lint
npm run lint

# Testes
npx tsx --test src/lib/*.test.ts
```

### Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CardioPront
```

---

## Conformidade

- **LGPD** — Lei Geral de Proteção de Dados (dados de saúde).
- **CFM 1.821/2007** — Resolução do Conselho Federal de Medicina sobre prontuário eletrônico.
- **Segurança** — Senhas hasheadas com PBKDF2-SHA256 (210.000 iterações), cookie httpOnly, isolamento de dados por médico, HTTPS em trânsito.

---

## Licença

Proprietária. Todos os direitos reservados.
