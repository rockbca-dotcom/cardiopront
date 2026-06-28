# AGENTS.md — Regras de Execução de Agentes no Repositório

**Projeto:** CardioPront  
**Atualizado em:** 2026-06-28  
**Status:** Ativo  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (Arcane Tecnologia, v1.0, 28/06/2026)

---

## 1. Objetivo

Este arquivo é a **fonte de verdade operacional** para qualquer agente de IA, automação ou colaborador técnico que atue no repositório CardioPront. Define:

- Onde encontrar cada coisa no projeto.
- Como escrever código no padrão existente.
- Como implementar uma feature ponta a ponta.
- Como corrigir um bug sem introduzir regressão.
- Como usar SDD e TDD.
- Como padronizar commits.
- Como manter a documentação de governança atualizada.

---

## 2. Princípios obrigatórios

- **Buscar contexto antes de alterar.** Ler `docs/CONTEXTO.md`, `docs/ARQUITETURA.md`, `docs/BANCO_DADOS.md` e `docs/ESCOPO.md` antes de qualquer mudança.
- **Mudanças pequenas e rastreáveis.** Um commit por tarefa concluída.
- **Atualizar documentação junto com código.** Toda alteração funcional exige atualização do arquivo de governança correspondente em `docs/`.
- **Nunca inventar** comportamento, endpoints, schemas ou regras de negócio. Se não estiver no código, marcar como `A CONFIRMAR`.
- **Nunca mascarar erro** com mock, stub ou fallback falso sem documentação.
- **Nunca expor** secrets, tokens ou credenciais. Usar apenas valores fictícios em exemplos.
- **Nunca fazer commit ou push** sem autorização explícita do usuário.
- **Nunca deixar o projeto em estado quebrado.** Validar build e testes antes de finalizar.
- **Registrar decisões relevantes** em `docs/CONTEXTO.md`.
- **Atualizar `docs/RELATORIO.md`** ao final de cada sessão.

---

## 3. Mapa do projeto

```
cardiopront/
├── AGENTS.md                    # Este arquivo — regras para agentes
├── README.md                    # Apresentação comercial/executiva
├── docs/                        # Documentação de governança e specs
│   ├── ARQUITETURA.md           # Arquitetura do sistema
│   ├── BANCO_DADOS.md           # Arquitetura do banco de dados
│   ├── CONTEXTO.md              # Contexto vivo do projeto
│   ├── ESCOPO.md                # Escopo completo do projeto
│   ├── RELATORIO.md             # Registro diário de desenvolvimento
│   ├── ROADMAP.md               # Roadmap de desenvolvimento
│   └── Escopo_Tecnico_..._.md   # Especificação técnica original (Arcane Tecnologia)
├── prisma/
│   ├── schema.sql               # DDL MySQL de referência (banco real é PostgreSQL)
│   ├── seed-drugs.sql           # Seed de medicamentos cardiovasculares
│   └── seed-exams.sql           # Seed de tipos de exame
├── supabase/
│   └── migrations/              # Migrations do Supabase (PostgreSQL)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout raiz (SEO, fontes, SchemaOrg)
│   │   ├── page.tsx             # Landing page pública
│   │   ├── globals.css          # Estilos globais TailwindCSS
│   │   ├── SchemaOrg.tsx        # Dados estruturados SEO
│   │   ├── cadastro/            # Página de cadastro
│   │   ├── login/               # Página de login
│   │   ├── app/                 # App autenticada
│   │   │   ├── layout.tsx       # Layout com AppShell
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── configuracoes/   # Configurações do médico
│   │   │   ├── consultas/       # Listagem, nova consulta, detalhe
│   │   │   ├── exames/          # Listagem, novo exame
│   │   │   ├── pacientes/       # Listagem, detalhe
│   │   │   └── prescricao/      # Listagem, nova prescrição
│   │   └── api/                 # Route Handlers (API)
│   │       ├── ai/              # transcrever (Whisper), sintetizar (GPT-4o-mini)
│   │       ├── auth/            # login, register, logout, me
│   │       ├── bootstrap/       # Conta demo
│   │       ├── configuracoes/   # GET/PUT perfil do médico
│   │       ├── consultas/       # GET/POST consultas, GET por id
│   │       ├── create-demo-user/# Credenciais demo
│   │       ├── dashboard/       # GET stats
│   │       ├── debug/           # ⚠️ Remover antes de produção
│   │       ├── exames/          # GET/POST exames, GET catálogo
│   │       ├── pacientes/       # GET/POST pacientes, GET por id
│   │       ├── prescricao/      # GET/POST prescrições, GET catálogo
│   │       └── scores/          # GET/POST escores cardiovasculares
│   ├── components/
│   │   ├── consulta/            # ConsultationForm, RecordingButton, PrefillPanel, etc.
│   │   ├── exames/              # ExamBuilder
│   │   ├── layout/              # AppShell, Sidebar
│   │   └── prescricao/          # PrescriptionForm, InteractionAlert, PrintPrescription
│   ├── lib/                     # Lógica de domínio (funções puras, testáveis)
│   │   ├── auth-server.ts       # getServerUser() — auth server-side
│   │   ├── auth-session.ts      # Hash/verify senha, cookie, formatAuthUser
│   │   ├── auth.ts              # signUp/signIn/signOut client-side
│   │   ├── cardioScores.ts      # CHA₂DS₂-VASc, HAS-BLED, Framingham, NYHA, Killip
│   │   ├── configuracoes.ts     # Normalização de perfil
│   │   ├── consultation-ai.ts   # Schema Zod + prompt da síntese IA
│   │   ├── consultation-followup.ts # Plano de follow-up
│   │   ├── consultation-media.ts    # Upload de áudio para Supabase Storage
│   │   ├── consultation-prefill.ts  # Prefill de formulário
│   │   ├── db.ts                # Cliente Supabase admin
│   │   ├── generatePrescriptionPdf.tsx # PDF de receita
│   │   ├── openai.ts            # Cliente OpenAI
│   │   ├── patient-history.ts   # Idade, IMC, datas
│   │   ├── renal-function.ts    # CKD-EPI 2021, Cockcroft-Gault, ajuste renal
│   │   └── *.test.ts            # Testes unitários (7 arquivos)
│   └── types/
│       └── index.ts             # Interfaces TypeScript das entidades
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example
```

---

## 4. Stack e dependências

| Dependência | Versão | Quando usar |
|---|---|---|
| `next` | ^15.0.0 | Framework full-stack (App Router, SSR, Route Handlers) |
| `react` / `react-dom` | ^19.0.0 | UI |
| `@supabase/supabase-js` | ^2.49.0 | Banco de dados e Storage |
| `openai` | ^4.70.0 | Whisper (transcrição) e GPT-4o-mini (síntese) |
| `zod` | ^3.23.0 | Validação de schemas (input de API, síntese IA) |
| `tailwindcss` | ^3.4.0 | Estilização |
| `lucide-react` | ^0.460.0 | Ícones |
| `react-hot-toast` | ^2.4.1 | Notificações |
| `@react-pdf/renderer` | ^4.5.1 | Geração de PDF (receitas) |
| `chart.js` / `react-chartjs-2` | ^4.4.0 / ^5.2.0 | Gráficos (instalado, não usado ativamente) |
| `date-fns` | ^4.1.0 | Manipulação de datas |
| `tsx` | ^4.19.0 | Executar testes (dev) |
| `typescript` | ^5.6.0 | Linguagem (estrito) |

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

## 5. Padrões de código

### Route Handler (API)

Toda rota de API usa `getServerUser()` para autenticação, `zod` para validação e `supabaseAdmin` para acesso ao banco:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("tabela")
    .insert({ ...parsed.data, medico_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

### Componente client

```typescript
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { IconName } from "lucide-react";

export function MeuComponente() {
  // ...
}
```

### Lib de domínio

Funções puras, sem side-effects, testáveis isoladamente em `src/lib/`:

```typescript
export function calcularAlgo(input: number): number {
  return input * 2;
}
```

### Tipos

Todas as interfaces de entidades ficam em `src/types/index.ts`.

### Imports

Usar sempre o alias `@/` para imports dentro de `src/`:

```typescript
import { getServerUser } from "@/lib/auth-server";
import type { Paciente } from "@/types";
```

---

## 6. Fluxo de implementação de feature

1. **Especificar** — Ler `docs/ESCOPO.md` e `docs/ARQUITETURA.md`. Confirmar requisito. Registrar em `docs/CONTEXTO.md`.
2. **Banco** — Se precisar, criar migration em `supabase/migrations/`. Atualizar `docs/BANCO_DADOS.md`.
3. **Tipos** — Adicionar/atualizar interfaces em `src/types/index.ts`.
4. **Lib de domínio** — Criar lógica em `src/lib/`. Escrever teste em `src/lib/*.test.ts`.
5. **API** — Criar Route Handler em `src/app/api/`. Usar `getServerUser()` + Zod + `supabaseAdmin`.
6. **Componente** — Criar em `src/components/`. Usar `"use client"`, TailwindCSS, Lucide.
7. **Página** — Criar em `src/app/app/`. Usar `AppShell` para páginas autenticadas.
8. **Testar** — `npx tsx --test src/lib/*.test.ts`.
9. **Buildar** — `npm run build`.
10. **Documentar** — Atualizar `docs/ARQUITETURA.md`, `docs/ROADMAP.md`, `docs/CONTEXTO.md`, `docs/RELATORIO.md`.

---

## 7. Fluxo de correção de bug

1. **Reproduzir** — Confirmar o bug localmente ou descrever passos para reproduzir.
2. **Identificar causa raiz** — Investigar no código, não tratar sintoma.
3. **Escrever teste de regressão** — Criar teste que falha com o bug atual.
4. **Corrigir** — Fazer a mudança mínima necessária.
5. **Validar** — Testes passam, build OK.
6. **Documentar** — Registrar bug e correção em `docs/RELATORIO.md` e `docs/CONTEXTO.md` se relevante.

---

## 8. Regras de commit em pt-BR usando Conventional Commits

Todo commit deve ser em **português do Brasil** e seguir o padrão Conventional Commits adaptado.

### Tipos permitidos

| Tipo | Descrição |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `test:` | Testes |
| `refactor:` | Refatoração sem mudança funcional |
| `style:` | Formatação sem mudança lógica |
| `chore:` | Tarefas auxiliares, scripts, configurações simples |
| `ci:` | Pipeline, deploy e integração contínua |
| `perf:` | Melhoria de performance |
| `build:` | Mudanças de build, dependências ou empacotamento |
| `revert:` | Reversão de alteração anterior |

### Formato obrigatório

```text
<tipo>(<escopo>): <descrição curta em pt-BR>

<corpo opcional explicando o motivo, impacto e arquivos principais>
```

### Escopos reconhecidos no projeto

`api`, `auth`, `frontend`, `backend`, `banco`, `docs`, `infra`, `tests`, `dashboard`, `consulta`, `paciente`, `exame`, `prescricao`, `scores`, `ia`, `configuracoes`, `governanca`

### Exemplos

```text
feat(auth): adiciona autenticação com JWT
fix(api): corrige validação de payload no cadastro de cliente
docs(arquitetura): atualiza fluxo de autenticação
test(banco): adiciona testes para migrations de usuários
refactor(frontend): reorganiza componentes do dashboard
feat(ia): adiciona síntese estruturada de consulta com GPT-4o-mini
fix(prescricao): corrige alerta de ajuste renal para medicamentos
```

### Regras adicionais

- Um commit por tarefa concluída.
- Não misturar mudanças não relacionadas no mesmo commit.
- Descrição curta no imperativo ou presente.
- Escopo deve refletir a área alterada.
- Antes de commit, validar testes, build e documentação.
- **Commit e push só podem ser feitos quando o usuário autorizar explicitamente.**

---

## 9. SDD — Specification-Driven Development

Toda funcionalidade deve começar por especificação, não por código.

### Fluxo obrigatório

1. Ler documentação existente (`docs/ARQUITETURA.md`, `docs/BANCO_DADOS.md`, `docs/ESCOPO.md`, `docs/CONTEXTO.md`).
2. Confirmar o requisito com o usuário ou com a documentação.
3. Criar ou atualizar especificação em documentação.
4. Definir critérios de aceite.
5. Mapear impacto em:
   - Arquitetura
   - Banco de dados
   - API
   - Frontend
   - Testes
   - Infraestrutura
   - Segurança
6. Registrar decisões relevantes em `docs/CONTEXTO.md`.
7. Atualizar `docs/ROADMAP.md` se a tarefa fizer parte de fase, épico ou história.

### Toda especificação deve conter

- **Objetivo:** o que será entregue.
- **Contexto:** por que é necessário.
- **Regras de negócio:** lógica envolvida.
- **Fluxo esperado:** passo a passo do comportamento.
- **Critérios de aceite:** condições mensuráveis para considerar pronto.
- **Impacto técnico:** arquivos, módulos e tabelas afetados.
- **Testes necessários:** o que deve ser testado.
- **Riscos:** o que pode dar errado.
- **Dependências:** o que precisa existir antes.

---

## 10. TDD — Test-Driven Development

O projeto utiliza o **Node.js native test runner** (`node:test` + `node:assert/strict`).

### Fluxo obrigatório

1. **RED** — escrever ou ajustar teste que falha.
2. **GREEN** — implementar o mínimo necessário para passar.
3. **REFACTOR** — melhorar mantendo testes verdes.

### Regras

- Toda feature nova precisa de teste.
- Todo bug corrigido precisa de teste de regressão.
- Toda regra de negócio crítica precisa de teste.
- Toda migration relevante precisa ser validada.
- Não reduzir cobertura sem justificativa em `docs/RELATORIO.md`.
- Se a stack não tiver testes configurados para uma área, registrar isso e propor configuração inicial.

### Comandos

```bash
# desenvolvimento
npm run dev          # next dev

# build
npm run build        # next build

# lint
npm run lint         # next lint

# testes (Node.js native test runner via tsx)
npx tsx --test src/lib/*.test.ts

# exemplo executando um teste específico
npx tsx --test src/lib/renal-function.test.ts
```

### Arquivos de teste existentes

| Arquivo | Área testada |
|---|---|
| `src/lib/configuracoes.test.ts` | Normalização de perfil do médico |
| `src/lib/consultation-ai.test.ts` | Parse de síntese IA |
| `src/lib/consultation-followup.test.ts` | Plano de follow-up pós-consulta |
| `src/lib/consultation-media.test.ts` | Upload e path de áudio |
| `src/lib/consultation-prefill.test.ts` | Prefill de formulário a partir da IA |
| `src/lib/patient-history.test.ts` | Histórico do paciente, idade, IMC, datas |
| `src/lib/renal-function.test.ts` | Função renal, TFGe, Cockcroft-Gault |

---

## 11. Atualização obrigatória de documentação

Toda tarefa técnica deve atualizar a documentação correspondente em `docs/`.

### Arquivos de governança e quando atualizar

| Arquivo | Atualizar quando... |
|---|---|
| `docs/ARQUITETURA.md` | Houver mudança estrutural, módulo, fluxo ou integração. |
| `docs/BANCO_DADOS.md` | Houver mudança em tabelas, models, migrations, índices, constraints ou seeds. |
| `docs/ESCOPO.md` | Houver mudança de requisito, regra de negócio ou limite do projeto. |
| `docs/ROADMAP.md` | Houver mudança de fase, épico, prioridade ou tarefa. |
| `docs/CONTEXTO.md` | Houver decisão técnica, bloqueio, mudança importante ou estado novo. |
| `docs/RELATORIO.md` | Ao final de cada sessão/dia de trabalho. |

### Checklist obrigatório por tarefa

```markdown
- [ ] Requisito compreendido
- [ ] Especificação criada/atualizada
- [ ] Teste criado/atualizado
- [ ] Implementação validada
- [ ] Documentação atualizada
- [ ] Arquitetura atualizada, se aplicável
- [ ] Banco de dados atualizado, se aplicável
- [ ] Roadmap atualizado, se aplicável
- [ ] Contexto atualizado
- [ ] Relatório do dia atualizado
```

---

## 12. Segurança e integridade

- **Nunca expor** `.env`, tokens, senhas, chaves privadas ou credenciais em código ou documentação.
- **Nunca copiar secrets** para documentação. Usar valores fictícios seguros (ex: `sk-your-openai-key`).
- Antes de registrar exemplos, usar valores fictícios seguros.
- Não criar backdoors, bypass de autenticação ou desativar validações sem autorização.
- Validar entradas de usuário em todas as rotas de API.
- Documentar riscos de segurança encontrados em `docs/CONTEXTO.md`.
- Registrar pendências críticas em `docs/CONTEXTO.md`.

### Observações de segurança específicas do projeto

- O projeto lida com **dados de saúde** (LGPD e CFM 1.821/2007 aplicáveis).
- Senhas são hasheadas com PBKDF2-SHA256 (210.000 iterações).
- Autenticação via cookie httpOnly `cp_session`.
- O bucket `consultation-audio` no Supabase Storage é público — revisar política de acesso se necessário.
- A rota `/api/debug` expõe informações de ambiente — remover ou proteger antes de produção.
- **Itens do Escopo Técnico não implementados (críticos):** consentimento do paciente, auditoria/logs, 2FA, criptografia de dados sensíveis no banco, criptografia de áudios, política de retenção, termos de uso e política de privacidade, campo `aprovado_pelo_medico` em prescrições e exames.
- **Princípios da IA (Escopo Técnico):** a IA é assistente de preenchimento, não responsável final; rascunho assistido com aprovação obrigatória do médico; não inventar informações; destacar incertezas; mostrar origem da informação.

---

## 13. Armadilhas conhecidas

| Armadilha | Onde | O que fazer |
|---|---|---|
| `prisma/schema.sql` é DDL MySQL mas o banco é PostgreSQL | `prisma/schema.sql` | Não executar diretamente no Supabase. Usar migrations em `supabase/migrations/`. |
| Bucket `consultation-audio` é público | `supabase/migrations/` | Qualquer um com a URL acessa o áudio. Não armazenar áudios sensíveis sem tornar bucket privado. |
| Fallback hardcoded de URL/chave Supabase em `db.ts` | `src/lib/db.ts` | Não confiar apenas em env vars — o fallback mascara misconfiguration. |
| Dashboard usa `localStorage.getItem("token")` | `src/app/app/page.tsx` | Inconsistência: o restante do app usa cookie httpOnly. Não copiar esse padrão. |
| Rota `/api/debug` expõe ambiente | `src/app/api/debug/route.ts` | Não usar em produção. Remover ou proteger antes de deploy. |
| Credenciais demo no código | `src/app/api/bootstrap/`, `src/app/api/create-demo-user/` | Senha demo visível no source. Não usar em produção. |
| `comorbidades` e `medicamentos_ativos` sem API | `prisma/schema.sql` | Tabelas existem no schema mas não têm CRUD. Não assumir que funcionam. |
| `EuroSCORE2` no enum mas sem implementação | `src/types/index.ts` | Listado no tipo mas sem cálculo em `cardioScores.ts`. |
| Seeds em sintaxe MySQL | `prisma/seed-*.sql` | Pode falhar no PostgreSQL. Adaptar se for executar. |
| Landing page promete features não implementadas | `src/app/page.tsx` | ICP-Brasil, AES-256, BI, API para laboratórios — não assumir que existem. |

---

## 14. Conduta para agentes

- Ser conservador em mudanças.
- Priorizar consistência com padrões existentes.
- Não reescrever o projeto sem necessidade.
- Não substituir bibliotecas principais sem justificativa documentada.
- Não remover testes.
- Não apagar histórico de documentação.
- Em caso de dúvida, investigar antes de perguntar.
- Se ainda houver dúvida, registrar como `A CONFIRMAR`.
- Preservar o estilo de código existente (TypeScript estrito, Next.js App Router, TailwindCSS).
- Usar o alias `@/` para imports dentro de `src/`.
- Componentes client devem ter `"use client"` no topo do arquivo.
- Rotas de API devem usar `getServerUser()` para autenticação.
