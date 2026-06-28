# CONTEXTO.md — Contexto Vivo do Projeto

**Projeto:** CardioPront  
**Atualizado em:** 2026-06-28  
**Responsável pela atualização:** Agente IA / Desenvolvedor  
**Especificação de origem:** `Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (Arcane Tecnologia, v1.0, 28/06/2026)

---

## 1. Resumo Executivo

O CardioPront é um prontuário eletrônico inteligente para cardiologistas brasileiros, construído com Next.js 15, React 19, Supabase (PostgreSQL) e OpenAI (Whisper + GPT-4o-mini). O sistema está em fase de **MVP funcional**: cadastro, login, pacientes, consultas com IA, exames, prescrição com alerta renal, escores cardiovasculares e configurações estão implementados. O principal objetivo técnico atual é **endurecer segurança e qualidade** para preparação de produção. Os principais riscos são: bucket de áudio público, rota de debug exposta, fallback hardcoded de credenciais Supabase, ausência de RLS e falta de testes de API.

A **especificação de origem** (`Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md`, Arcane Tecnologia, v1.0) define o escopo completo do projeto, incluindo módulos, entidades de banco, pipeline de IA, requisitos de segurança, cuidados com IA, riscos e critérios de aceite do MVP. A documentação de governança foi atualizada para refletir o gap entre o spec e a implementação atual.

---

## 2. Estado Atual do Projeto

| Área | Status | Observações |
|---|---|---|
| Backend | Funcional | Route Handlers com auth via cookie, acesso direto ao Supabase |
| Frontend | Funcional | App Shell com Sidebar, componentes por feature, TailwindCSS |
| Banco de dados | Funcional | PostgreSQL via Supabase, 9 tabelas ativas, 2 migrations aplicadas |
| Testes | Parcial | 7 arquivos de teste unitário em `src/lib/`, sem testes de API ou UI |
| Infraestrutura | Parcial | Vercel configurado, sem CI/CD, sem monitoramento |
| Documentação | Completo | 7 arquivos de governança criados nesta sessão |
| Segurança | Crítico | Bucket público, debug route, fallback hardcoded, sem RLS |
| LGPD | Parcial | Dados de saúde sem mecanismo de exportação/exclusão |

---

## 3. Histórico de Desenvolvimento

### 2026-06-28 — Atualização da Governança com Escopo Técnico da Arcane Tecnologia
- **O que foi analisado:** Documento `Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (Arcane Tecnologia, v1.0, 28/06/2026).
- **O que foi decidido:** Atualizar todos os 7 arquivos de governança para refletir o gap entre o Escopo Técnico e a implementação atual.
- **O que foi alterado:** `ESCOPO.md`, `ARQUITETURA.md`, `BANCO_DADOS.md`, `ROADMAP.md`, `CONTEXTO.md`, `RELATORIO.md` — nenhum código foi alterado.
- **Principais gaps identificados:**
  - 3 perfis não implementados (secretária, admin clínica, admin sistema).
  - 7 entidades de banco não implementadas (Usuários, Clínicas, Gravações, Transcrições, Documentos, Logs de Auditoria, Consentimentos).
  - 5 tipos de PDF não implementados (pedido de exames, resumo, orientações, encaminhamento, relatório).
  - Auditoria e logs não implementados.
  - Consentimento do paciente não implementado.
  - 2FA não implementado.
  - Criptografia de dados sensíveis e áudios não implementada.
  - Política de retenção de áudios não implementada.
  - Termos de uso e política de privacidade não formalizados.
  - Campo `aprovado_pelo_medico` não implementado.
  - Pausa/retomada de gravação, upload manual, separação médico/paciente, processamento em tempo real não implementados.
  - Destaque de baixa confiança e registro de alterações do médico na síntese não implementados.
  - Alerta de alergia, campos duração/quantidade, endereço e convênio do paciente não implementados.
  - Backlog expandido de 30 para 74 itens.
- **Evidências no repositório:** Atualizações em `ESCOPO.md`, `ARQUITETURA.md`, `BANCO_DADOS.md`, `ROADMAP.md`, `CONTEXTO.md`, `RELATORIO.md`.

### 2026-06-28 — Criação da Governança do Repositório
- **O que foi analisado:** Estrutura completa do repositório, stack tecnológica, todas as rotas de API, bibliotecas de domínio, testes, schema SQL, migrations, seeds, componentes React, páginas Next.js.
- **O que foi decidido:** Criar 7 arquivos de governança (`AGENTS.md`, `ARQUITETURA.md`, `BANCO_DADOS.md`, `ESCOPO.md`, `ROADMAP.md`, `CONTEXTO.md`, `RELATORIO.md`) na raiz do repositório, em pt-BR, baseados exclusivamente em evidências do código.
- **O que foi criado:** Os 7 arquivos de governança acima.
- **O que foi alterado:** Nenhum código foi alterado.
- **O que ficou pendente:**
  - Validar build e testes (não executados nesta sessão).
  - Remover rota `/api/debug` antes de produção.
  - Tornar bucket `consultation-audio` privado.
  - Remover fallback hardcoded de URL/chave Supabase em `src/lib/db.ts`.
  - Remover credenciais demo do código.
  - Ativar RLS no Supabase.
  - Implementar paginação, testes de API, CI/CD, monitoramento.
  - Alinhar landing page com escopo real (features prometidas não implementadas).
- **Evidências no repositório:** `AGENTS.md`, `ARQUITETURA.md`, `BANCO_DADOS.md`, `ESCOPO.md`, `ROADMAP.md`, `CONTEXTO.md`, `RELATORIO.md`.

### Anterior a 2026-06-28 — Desenvolvimento do MVP
- **O que foi implementado (inferido do `CHANGELOG.md` e código):**
  - Landing page pública com SEO.
  - Cadastro e login de médicos com PBKDF2-SHA256.
  - Dashboard com estatísticas.
  - CRUD de pacientes com histórico.
  - CRUD de consultas com gravação de áudio, transcrição Whisper e síntese GPT-4o-mini.
  - Prefill de formulário a partir da síntese IA.
  - Plano de follow-up pós-consulta.
  - Detalhe da consulta com áudio reproduzível.
  - Catálogo e CRUD de exames cardiológicos.
  - Catálogo e CRUD de prescrição com alerta renal.
  - Escores cardiovasculares (CHA₂DS₂-VASc, HAS-BLED, Framingham, NYHA, Killip).
  - Configurações de perfil do médico.
  - Geração de PDF de receita.
  - Bucket de áudio no Supabase Storage.
  - 7 arquivos de teste unitário.
  - 2 migrations no Supabase.
- **Evidências:** `CHANGELOG.md`, código-fonte em `src/`, migrations em `supabase/migrations/`.

---

## 4. Decisões Técnicas e Arquiteturais

| Data | Decisão | Motivo | Impacto | Status |
|---|---|---|---|---|
| A CONFIRMAR | Next.js App Router como monolito full-stack | Stack moderna, SSR + API unificados | Toda a arquitetura | Ativo |
| A CONFIRMAR | Supabase como PostgreSQL + Storage | BaaS, reduz overhead de infra | Banco e storage | Ativo |
| A CONFIRMAR | Autenticação custom (PBKDF2 + cookie) | Controle total do fluxo | Camada de auth | Ativo |
| A CONFIRMAR | OpenAI Whisper + GPT-4o-mini | Qualidade pt-BR e síntese estruturada | Módulo IA | Ativo |
| A CONFIRMAR | Node.js native test runner | Sem dependência extra | Testes | Ativo |
| A CONFIRMAR | Zod para validação | Type-safe | Configurações e IA | Ativo |
| A CONFIRMAR | @react-pdf/renderer para receitas | Geração de PDF server-side | Prescrição | Ativo |
| 2026-06-28 | `sintese_ia` como objeto estruturado (não string) | Facilitar prefill e follow-up | Types e API | Ativo |
| 2026-06-28 | Criar governança completa do repositório | Rastreabilidade e padronização | 7 arquivos .md | Ativo |
| 2026-06-28 | IA como assistente de preenchimento, não responsável final | Princípio do Escopo Técnico (Arcane Tecnologia) | Toda a camada de IA | Ativo |
| 2026-06-28 | Aprovação obrigatória do médico antes de documento final | Princípio do Escopo Técnico (Arcane Tecnologia) | Prescrição, exames, documentos | Ativo |
| 2026-06-28 | Atualizar governança com Escopo Técnico da Arcane Tecnologia | Alinhar documentação com especificação formal | 6 arquivos .md atualizados | Ativo |

---

## 5. Decisões de Produto e Escopo

| Data | Decisão | Motivo | Impacto |
|---|---|---|---|
| A CONFIRMAR | Foco exclusivo em cardiologia | Diferencial competitivo | Catálogos, escores e templates especializados |
| A CONFIRMAR | 3 planos: Trial, Profissional, Clínica | Monetização | Landing page e tabela `medicos.plano` |
| A CONFIRMAR | Trial de 14 dias sem cartão | Reduzir barreira de entrada | `trial_fim` no cadastro |
| A CONFIRMAR | Landing page promete features não implementadas | Marketing antecipado | Risco de expectativa não atendida |

---

## 6. Pendências Atuais

| Pendência | Área | Prioridade | Próxima ação |
|---|---|---|---|
| Remover rota `/api/debug` | Segurança | Alta | Remover arquivo ou proteger com auth |
| Tornar bucket `consultation-audio` privado | Segurança | Alta | Alterar migration + usar URLs assinadas |
| Remover fallback hardcoded Supabase em `db.ts` | Segurança | Alta | Exigir env vars sem fallback |
| Remover credenciais demo do código | Segurança | Média | Mover para env vars ou remover |
| Ativar RLS no Supabase | Segurança | Alta | Criar policies por `medico_id` |
| Implementar paginação | Performance | Média | Usar `range()` no Supabase |
| Testes para rotas de API | Qualidade | Média | Criar testes de integração |
| Testes para cardioScores.ts | Qualidade | Média | Criar `cardioScores.test.ts` |
| Configurar CI/CD | Infra | Média | GitHub Actions ou Vercel CI |
| Configurar monitoramento (Sentry) | Infra | Média | Integrar Sentry |
| Alinhar landing page com escopo | Produto | Alta | Remover ou marcar features não implementadas |
| Implementar LGPD (exportação/exclusão) | Conformidade | Alta | Criar rotas e UI para direitos do titular |
| Validar build e testes | Qualidade | Alta | Executar `npm run build` e `npx tsx --test` |
| Schema SQL em MySQL mas banco em Postgres | Débito técnico | Média | Criar DDL PostgreSQL canônico |
| CRUD de comorbidades e medicamentos ativos | Feature | Média | Implementar API e UI |
| Editar/excluir registros (pacientes, consultas, etc.) | Feature | Média | Implementar PUT/DELETE nas rotas |
| Implementar 2FA | Segurança | Média | Avaliar TOTP |
| Criptografar dados sensíveis no banco | Segurança | Alta | Avaliar pgcrypto |
| Criptografar áudios armazenados | Segurança | Alta | Avaliar encryption at rest |
| Política de retenção de áudios | Segurança | Alta | Definir regra e implementar purge |
| Termos de uso e política de privacidade | Legal | Alta | Redigir e publicar |
| Consentimento do paciente | Conformidade | Alta | Criar tabela `consentimentos` e fluxo |
| Campo `aprovado_pelo_medico` em prescrições e exames | Feature | Alta | Adicionar coluna booleana |
| PDF de pedido de exames | Feature | Média | Criar template PDF |
| PDF de resumo da consulta | Feature | Média | Criar template PDF |
| PDF de orientações ao paciente | Feature | Média | Criar template PDF |
| Logs de acesso e alteração | Segurança | Alta | Criar tabela `logs_auditoria` |
| Trilha de auditoria por consulta | Segurança | Alta | Registrar ações por consulta |
| Perfis: secretária, admin clínica, admin sistema | Feature | Média | Planejar modelo de usuários |
| Cadastro de clínica/consultório | Feature | Média | Criar tabela `clinicas` |
| Pausa e retomada da gravação | Feature | Média | Implementar no RecordingButton |
| Upload manual de áudio | Feature | Média | Adicionar opção de upload |
| Separação médico/paciente na transcrição | Feature | Baixa | Avaliar viabilidade com Whisper |
| Destaque de trechos com baixa confiança | Feature | Média | Avaliar confidence do Whisper |
| Registro de alterações do médico na síntese | Feature | Média | Criar log de diff |
| Alerta de alergia do paciente na prescrição | Feature | Média | Cruzar alergias com medicamento |
| Campos duração e quantidade na prescrição | Feature | Média | Adicionar campos |
| Campo endereço no paciente | Feature | Média | Adicionar coluna |
| Campo convênio no paciente | Feature | Baixa | Adicionar coluna |
| Histórico de documentos gerados | Feature | Média | Criar tabela `documentos` |

---

## 7. Bloqueios

| Bloqueio | Severidade | Descrição | Dependência |
|---|---|---|---|
| Nenhum bloqueio ativo | — | — | — |

---

## 8. Riscos Técnicos

| Risco | Impacto | Mitigação |
|---|---|---|
| Bucket de áudio público | Vazamento de dados de saúde | Tornar privado + URLs assinadas |
| Sem RLS no Supabase | Acesso indevido se app comprometida | Ativar RLS |
| Rota `/api/debug` expõe ambiente | Vazamento de informações | Remover antes de produção |
| Fallback hardcoded de credenciais | Misconfiguration mascarada | Remover fallback |
| Sem paginação | Degradação de performance | Implementar paginação |
| Sem testes de API/UI | Regressões não detectadas | Adicionar testes |
| Landing page promete features inexistentes | Expectativa não atendida | Alinhar marketing com escopo |
| Dependência OpenAI | Indisponibilidade de IA | Implementar retry/fallback |
| Schema MySQL vs Postgres | Divergências de tipos | Criar DDL Postgres canônico |

---

## 9. Próximos Passos

1. Validar build (`npm run build`) e testes (`npx tsx --test src/lib/*.test.ts`).
2. Remover ou proteger rota `/api/debug`.
3. Tornar bucket `consultation-audio` privado com URLs assinadas.
4. Remover fallback hardcoded de URL/chave Supabase em `src/lib/db.ts`.
5. Ativar RLS no Supabase com policies por `medico_id`.
6. Implementar paginação nas listagens.
7. Adicionar testes para `cardioScores.ts` e rotas de API.
8. Configurar CI/CD e monitoramento.
9. Alinhar landing page com escopo real.
10. Implementar mecanismo LGPD de exportação/exclusão de dados.
11. Implementar consentimento do paciente (tabela `consentimentos`).
12. Implementar auditoria (tabela `logs_auditoria`).
13. Implementar campo `aprovado_pelo_medico` em prescrições e exames.
14. Redigir termos de uso e política de privacidade.
15. Implementar 2FA.
16. Implementar criptografia de dados sensíveis no banco.
17. Implementar política de retenção de áudios.
18. Criar PDFs de pedido de exames, resumo, orientações, encaminhamento e relatório.

---

## 10. Notas Importantes para Próximos Agentes

- Sempre ler este arquivo antes de trabalhar.
- Sempre atualizar este arquivo ao final da sessão.
- Não remover histórico antigo.
- Registrar decisões, bloqueios e mudanças de direção.
- O `prisma/schema.sql` é DDL MySQL — o banco real é PostgreSQL via Supabase.
- O `supabaseAdmin` em `src/lib/db.ts` tem fallback hardcoded — não confiar apenas em env vars.
- A landing page em `src/app/page.tsx` promete features não implementadas (ICP-Brasil, AES-256, BI, API para laboratórios).
- Tabelas `comorbidades` e `medicamentos_ativos` existem no schema mas não têm CRUD/API.
- `EuroSCORE2` está no enum de tipos de score mas não tem implementação.
- O dashboard usa `localStorage.getItem("token")` para stats, enquanto o restante usa cookie httpOnly — inconsistência.
- **Escopo Técnico da Arcane Tecnologia** é a especificação formal do projeto — sempre consultar ao planejar novas features.
- O spec sugere 4 perfis (médico, secretária, admin clínica, admin sistema) — apenas médico implementado.
- O spec especifica 7 entidades de banco não implementadas: Usuários, Clínicas, Gravações, Transcrições, Documentos, Logs de Auditoria, Consentimentos.
- O spec solicita 6 tipos de PDF — apenas receita implementada.
- O spec solicita auditoria, consentimento, 2FA, criptografia de dados e áudios, política de retenção, termos de uso — nenhum implementado.
- O spec define princípios da IA: assistente de preenchimento, rascunho assistido, aprovação obrigatória, não inventar informações, destacar incertezas.
- O backlog do ROADMAP.md foi expandido para 74 itens refletindo o gap entre spec e implementação.
