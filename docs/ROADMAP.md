# ROADMAP.md — Roadmap de Desenvolvimento

**Projeto:** CardioPront  
**Atualizado em:** 2026-06-28  
**Metodologia:** Specification-Driven Development (SDD) + Test-Driven Development (TDD)  
**Especificação de origem:** `Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (Arcane Tecnologia, v1.0, 28/06/2026)

---

## 1. Visão Geral do Roadmap

O projeto CardioPront é evoluído em fases, cada uma contendo épicos, histórias e tarefas. Toda funcionalidade nova segue o fluxo SDD (especificação antes de código) e TDD (teste antes de implementação). O roadmap reflete o estado atual do projeto e planeja a evolução futura.

---

## 2. Convenções de Status

- `PENDENTE` — não iniciado
- `EM ESPECIFICAÇÃO` — especificação em andamento
- `ESPECIFICADO` — especificação concluída, aguardando implementação
- `EM TESTE` — teste escrito (RED), aguardando implementação
- `EM DESENVOLVIMENTO` — implementação em andamento (GREEN)
- `EM REVISÃO` — implementação concluída, em revisão
- `CONCLUÍDO` — validado, testado, documentado
- `BLOQUEADO` — impedido por dependência
- `CANCELADO` — descartado

---

## 3. Fases do Projeto

### Fase 0 — Diagnóstico e Governança
**Objetivo:** entender o projeto, documentar arquitetura, banco e escopo.  
**Status:** CONCLUÍDO

Épicos:
- EP-0001 — Criar governança do repositório. **CONCLUÍDO**
- EP-0002 — Mapear arquitetura. **CONCLUÍDO**
- EP-0003 — Mapear banco de dados. **CONCLUÍDO**
- EP-0004 — Definir escopo inicial. **CONCLUÍDO**
- EP-0005 — Definir estratégia de testes. **CONCLUÍDO**

Critérios de aceite:
- [x] `AGENTS.md` criado.
- [x] `ARQUITETURA.md` criado.
- [x] `BANCO_DADOS.md` criado.
- [x] `ESCOPO.md` criado.
- [x] `ROADMAP.md` criado.
- [x] `CONTEXTO.md` criado.
- [x] `RELATORIO.md` criado.

---

### Fase 1 — Base Técnica e Ambiente
**Objetivo:** garantir que o projeto rode localmente, tenha testes e documentação mínima.  
**Status:** EM REVISÃO

Tarefas:
- [x] Validar instalação (`npm install`).
- [x] Validar variáveis de ambiente (`.env.example`).
- [ ] Validar build (`npm run build`) — PENDENTE DE VALIDAÇÃO
- [ ] Validar testes (`npx tsx --test src/lib/*.test.ts`) — PENDENTE DE VALIDAÇÃO
- [x] Documentar comandos em `ARQUITETURA.md`.
- [x] Identificar riscos técnicos em `CONTEXTO.md`.

---

### Fase 2 — Funcionalidades Core
**Objetivo:** implementar ou estabilizar funcionalidades principais.  
**Status:** PARCIALMENTE CONCLUÍDO

#### História: Cadastro e login de médico
- **Como:** médico cardiologista
- **Quero:** me cadastrar e fazer login
- **Para:** acessar o sistema
- **Status:** CONCLUÍDO

##### SDD
- Especificação: Cadastro com nome, e-mail, senha, CRM, UF. Login com e-mail/senha. Sessão via cookie httpOnly.
- Critérios de aceite: e-mail único, senha ≥ 6 caracteres, cookie httpOnly, redirect para /app.
- Impacto técnico: `src/app/api/auth/*`, `src/lib/auth-*.ts`, `src/app/cadastro/`, `src/app/login/`.

##### TDD
- Teste RED: NÃO IDENTIFICADO teste de auth (lógica de hash testada indiretamente).
- Implementação GREEN: CONCLUÍDO.
- Refatoração: NÃO APLICADO.
- Teste de regressão: PENDENTE.

##### Tarefas
- [x] Implementar registro
- [x] Implementar login
- [x] Implementar logout
- [x] Implementar sessão
- [x] Implementar guard client-side
- [ ] Adicionar testes de auth — PENDENTE

---

#### História: CRUD de pacientes
- **Como:** médico
- **Quero:** cadastrar e gerenciar meus pacientes
- **Para:** manter registro organizado
- **Status:** PARCIALMENTE CONCLUÍDO

##### Tarefas
- [x] Listar pacientes
- [x] Cadastrar paciente
- [x] Detalhe com histórico
- [ ] Editar paciente — PENDENTE
- [ ] Excluir paciente — PENDENTE
- [ ] CRUD de comorbidades — PENDENTE
- [ ] CRUD de medicamentos ativos — PENDENTE

---

#### História: Consulta com IA
- **Como:** médico
- **Quero:** registrar consulta com gravação de áudio, transcrição e síntese
- **Para:** economizar tempo e estruturar o registro
- **Status:** CONCLUÍDO

##### TDD
- Teste RED: `src/lib/consultation-ai.test.ts`, `src/lib/consultation-media.test.ts`, `src/lib/consultation-prefill.test.ts`, `src/lib/consultation-followup.test.ts` — CONCLUÍDO
- Implementação GREEN: CONCLUÍDO
- Refatoração: CONCLUÍDO
- Teste de regressão: CONCLUÍDO

##### Tarefas
- [x] Formulário de consulta
- [x] Gravação de áudio
- [x] Upload para Storage
- [x] Transcrição via Whisper
- [x] Síntese via GPT-4o-mini
- [x] Prefill de campos
- [x] Plano de follow-up
- [x] Detalhe da consulta
- [ ] Editar consulta — PENDENTE
- [ ] Excluir consulta — PENDENTE

---

#### História: Pedidos de exames
- **Como:** médico
- **Quero:** solicitar exames cardiológicos do catálogo
- **Para:** padronizar pedidos
- **Status:** CONCLUÍDO

##### Tarefas
- [x] Catálogo de exames (24 tipos)
- [x] Listar exames pedidos
- [x] Pedir novo exame
- [ ] Registrar resultado — PENDENTE
- [ ] Editar/excluir exame — PENDENTE

---

#### História: Prescrição inteligente
- **Como:** médico
- **Quero:** prescrever com alertas de interação e ajuste renal
- **Para:** prescrever com segurança
- **Status:** CONCLUÍDO

##### TDD
- Teste RED: `src/lib/renal-function.test.ts` — CONCLUÍDO
- Implementação GREEN: CONCLUÍDO
- Refatoração: CONCLUÍDO

##### Tarefas
- [x] Catálogo de medicamentos (30)
- [x] Busca de medicamentos
- [x] Formulário de prescrição
- [x] Alerta de interação
- [x] Cálculo de função renal
- [x] Alerta de ajuste renal
- [x] Geração de PDF
- [ ] Editar/excluir prescrição — PENDENTE

---

#### História: Escores cardiovasculares
- **Como:** médico
- **Quero:** calcular e registrar escores cardiovasculares
- **Para:** estratificar risco do paciente
- **Status:** PARCIALMENTE CONCLUÍDO

##### Tarefas
- [x] CHA₂DS₂-VASc
- [x] HAS-BLED
- [x] Framingham
- [x] NYHA
- [x] Killip
- [x] Persistência
- [ ] EuroSCORE2 — PENDENTE
- [ ] Testes unitários de escores — PENDENTE

---

#### História: Configurações de perfil
- **Como:** médico
- **Quero:** editar meus dados de perfil
- **Para:** manter informações atualizadas
- **Status:** CONCLUÍDO

##### TDD
- Teste RED: `src/lib/configuracoes.test.ts` — CONCLUÍDO
- Implementação GREEN: CONCLUÍDO

---

### Fase 3 — Integrações
**Objetivo:** implementar ou estabilizar integrações externas.  
**Status:** PARCIALMENTE CONCLUÍDO

#### História: Integração OpenAI
- **Status:** CONCLUÍDO
- [x] Whisper (transcrição pt-BR)
- [x] GPT-4o-mini (síntese estruturada)
- [ ] Retry/fallback em caso de falha — PENDENTE
- [ ] Rate limiting — PENDENTE

#### História: Integração Supabase Storage
- **Status:** CONCLUÍDO
- [x] Bucket `consultation-audio`
- [x] Upload de áudio
- [ ] URLs assinadas (bucket público hoje) — PENDENTE

#### História: Integração de pagamento
- **Status:** PENDENTE
- [ ] Gateway de pagamento (Stripe/Pagar.me)
- [ ] Cobrança recorrente
- [ ] Enforcement de features por plano

---

### Fase 4 — Segurança, Performance e Qualidade
**Objetivo:** endurecer o sistema para uso real.  
**Status:** PENDENTE

#### Tarefas
- [ ] Remover ou proteger rota `/api/debug`
- [ ] Tornar bucket `consultation-audio` privado + URLs assinadas
- [ ] Remover fallback hardcoded de URL/chave Supabase
- [ ] Remover credenciais demo do código
- [ ] Ativar RLS no Supabase
- [ ] Implementar rate limiting nas rotas de API
- [ ] Implementar paginação nas listagens
- [ ] Adicionar testes para rotas de API
- [ ] Adicionar testes para componentes React
- [ ] Configurar CI/CD
- [ ] Configurar monitoramento de erros (Sentry)
- [ ] Implementar auditoria de alterações (tabela `logs_auditoria`)
- [ ] Implementar logs de acesso
- [ ] Implementar trilha de auditoria por consulta
- [ ] Implementar mecanismo LGPD (exportação/exclusão de dados)
- [ ] Implementar 2FA (autenticação em dois fatores)
- [ ] Implementar criptografia de dados sensíveis no banco
- [ ] Implementar criptografia de áudios armazenados
- [ ] Implementar política de retenção de áudios
- [ ] Redigir termos de uso e política de privacidade
- [ ] Implementar consentimento do paciente (tabela `consentimentos`)
- [ ] Implementar campo `aprovado_pelo_medico` em prescrições e exames
- [ ] Validar conformidade CFM 1.821/2007

---

### Fase 5 — Deploy, Observabilidade e Operação
**Objetivo:** preparar o sistema para ambiente de produção.  
**Status:** PARCIALMENTE CONCLUÍDO

#### Tarefas
- [x] Deploy na Vercel
- [x] Supabase configurado
- [ ] CI/CD automatizado
- [ ] Variáveis de ambiente em produção
- [ ] Monitoramento de uptime
- [ ] Logs estruturados
- [ ] Backup automatizado
- [ ] Plano de rollback

---

### Fase 6 — Evolução Contínua
**Objetivo:** planejar melhorias futuras.  
**Status:** PENDENTE

#### Backlog
- [ ] Multi-médico por clínica (plano Clínica) + tabela `clinicas`
- [ ] Perfis: secretária, admin clínica, admin sistema
- [ ] Cadastro de clínica/consultório
- [ ] Business Intelligence / Dashboard gerencial
- [ ] API para laboratórios
- [ ] Assinatura digital ICP-Brasil
- [ ] Timeline cardiovascular com gráficos
- [ ] Aplicativo mobile
- [ ] Telemedicina com vídeo
- [ ] Notificações por e-mail/SMS/push
- [ ] Migração automatizada de outros sistemas
- [ ] EuroSCORE2
- [ ] CRUD de comorbidades e medicamentos ativos
- [ ] Editar/excluir pacientes, consultas, exames, prescrições
- [ ] Registrar resultado de exames
- [ ] PDF de pedido de exames
- [ ] PDF de resumo da consulta
- [ ] PDF de orientações ao paciente
- [ ] PDF de encaminhamento
- [ ] PDF de relatório médico
- [ ] Histórico de documentos gerados (tabela `documentos`)
- [ ] Impressão direta
- [ ] Envio por WhatsApp ou e-mail
- [ ] Pausa e retomada da gravação
- [ ] Upload manual de áudio
- [ ] Separação médico/paciente na transcrição
- [ ] Processamento em tempo real
- [ ] Destaque de trechos com baixa confiança
- [ ] Registro de alterações do médico na síntese
- [ ] Alerta de alergia do paciente na prescrição
- [ ] Campos duração e quantidade na prescrição
- [ ] Campo endereço no paciente
- [ ] Campo convênio no paciente
- [ ] Agendamento de consultas
- [ ] Lembretes de retorno
- [ ] Histórico longitudinal cardiovascular
- [ ] Gráficos de evolução
- [ ] Integração com wearable
- [ ] OCR de exames enviados pelo paciente
- [ ] Chatbot para pré-consulta
- [ ] Integração com plataforma de prescrição eletrônica
- [ ] Prontuário eletrônico completo
- [ ] Integração com convênios

---

## 4. Backlog Geral

| ID | Tipo | Descrição | Prioridade | Status |
|---|---|---|---|---|
| BL-0001 | Bug | Dashboard usa localStorage token em vez de cookie | Alta | PENDENTE |
| BL-0002 | Segurança | Remover rota `/api/debug` | Alta | PENDENTE |
| BL-0003 | Segurança | Tornar bucket de áudio privado | Alta | PENDENTE |
| BL-0004 | Segurança | Remover fallback hardcoded Supabase | Alta | PENDENTE |
| BL-0005 | Segurança | Remover credenciais demo do código | Média | PENDENTE |
| BL-0006 | Segurança | Ativar RLS no Supabase | Alta | PENDENTE |
| BL-0007 | Performance | Implementar paginação nas listagens | Média | PENDENTE |
| BL-0008 | Teste | Testes para rotas de API | Média | PENDENTE |
| BL-0009 | Teste | Testes para componentes React | Baixa | PENDENTE |
| BL-0010 | Teste | Testes para cardioScores.ts | Média | PENDENTE |
| BL-0011 | Infra | Configurar CI/CD | Média | PENDENTE |
| BL-0012 | Infra | Configurar Sentry/monitoramento | Média | PENDENTE |
| BL-0013 | Feature | Editar paciente | Média | PENDENTE |
| BL-0014 | Feature | Editar/excluir consulta | Média | PENDENTE |
| BL-0015 | Feature | Editar/excluir exame | Baixa | PENDENTE |
| BL-0016 | Feature | Editar/excluir prescrição | Baixa | PENDENTE |
| BL-0017 | Feature | Registrar resultado de exame | Média | PENDENTE |
| BL-0018 | Feature | CRUD de comorbidades | Média | PENDENTE |
| BL-0019 | Feature | CRUD de medicamentos ativos | Média | PENDENTE |
| BL-0020 | Feature | EuroSCORE2 | Baixa | PENDENTE |
| BL-0021 | Feature | Multi-médico por clínica | Baixa | PENDENTE |
| BL-0022 | Feature | Business Intelligence | Baixa | PENDENTE |
| BL-0023 | Feature | API para laboratórios | Baixa | PENDENTE |
| BL-0024 | Feature | Assinatura digital ICP-Brasil | Baixa | PENDENTE |
| BL-0025 | Feature | Timeline cardiovascular com gráficos | Baixa | PENDENTE |
| BL-0026 | Feature | Gateway de pagamento | Média | PENDENTE |
| BL-0027 | Feature | Notificações por e-mail/SMS | Baixa | PENDENTE |
| BL-0028 | Débito técnico | Schema SQL em MySQL mas banco em Postgres | Média | PENDENTE |
| BL-0029 | Débito técnico | Sem repository pattern (acesso direto Supabase) | Baixa | PENDENTE |
| BL-0030 | Documentação | Alinhar landing page com escopo real | Alta | PENDENTE |
| BL-0031 | Segurança | Implementar 2FA | Média | PENDENTE |
| BL-0032 | Segurança | Criptografar dados sensíveis no banco | Alta | PENDENTE |
| BL-0033 | Segurança | Criptografar áudios armazenados | Alta | PENDENTE |
| BL-0034 | Segurança | Política de retenção de áudios | Alta | PENDENTE |
| BL-0035 | Segurança | Termos de uso e política de privacidade | Alta | PENDENTE |
| BL-0036 | Segurança | Consentimento do paciente (tabela `consentimentos`) | Alta | PENDENTE |
| BL-0037 | Segurança | Campo `aprovado_pelo_medico` em prescrições e exames | Alta | PENDENTE |
| BL-0038 | Feature | PDF de pedido de exames | Média | PENDENTE |
| BL-0039 | Feature | PDF de resumo da consulta | Média | PENDENTE |
| BL-0040 | Feature | PDF de orientações ao paciente | Média | PENDENTE |
| BL-0041 | Feature | PDF de encaminhamento | Baixa | PENDENTE |
| BL-0042 | Feature | PDF de relatório médico | Baixa | PENDENTE |
| BL-0043 | Feature | Histórico de documentos gerados (tabela `documentos`) | Média | PENDENTE |
| BL-0044 | Feature | Impressão direta | Baixa | PENDENTE |
| BL-0045 | Feature | Envio por WhatsApp ou e-mail | Baixa | PENDENTE |
| BL-0046 | Feature | Pausa e retomada da gravação | Média | PENDENTE |
| BL-0047 | Feature | Upload manual de áudio | Média | PENDENTE |
| BL-0048 | Feature | Separação médico/paciente na transcrição | Baixa | PENDENTE |
| BL-0049 | Feature | Processamento em tempo real | Baixa | PENDENTE |
| BL-0050 | Feature | Destaque de trechos com baixa confiança | Média | PENDENTE |
| BL-0051 | Feature | Registro de alterações do médico na síntese | Média | PENDENTE |
| BL-0052 | Feature | Alerta de alergia do paciente na prescrição | Média | PENDENTE |
| BL-0053 | Feature | Campos duração e quantidade na prescrição | Média | PENDENTE |
| BL-0054 | Feature | Campo endereço no paciente | Média | PENDENTE |
| BL-0055 | Feature | Campo convênio no paciente | Baixa | PENDENTE |
| BL-0056 | Feature | Perfis: secretária, admin clínica, admin sistema | Média | PENDENTE |
| BL-0057 | Feature | Cadastro de clínica/consultório (tabela `clinicas`) | Média | PENDENTE |
| BL-0058 | Feature | Agendamento de consultas | Baixa | PENDENTE |
| BL-0059 | Feature | Lembretes de retorno | Baixa | PENDENTE |
| BL-0060 | Feature | Histórico longitudinal cardiovascular | Baixa | PENDENTE |
| BL-0061 | Feature | Gráficos de evolução | Baixa | PENDENTE |
| BL-0062 | Feature | Integração com wearable | Baixa | PENDENTE |
| BL-0063 | Feature | OCR de exames enviados pelo paciente | Baixa | PENDENTE |
| BL-0064 | Feature | Chatbot para pré-consulta | Baixa | PENDENTE |
| BL-0065 | Feature | Integração com plataforma de prescrição eletrônica | Baixa | PENDENTE |
| BL-0066 | Feature | Prontuário eletrônico completo | Baixa | PENDENTE |
| BL-0067 | Feature | Integração com convênios | Baixa | PENDENTE |
| BL-0068 | Banco | Criar tabela `usuarios` (separada de médicos) | Baixa | PENDENTE |
| BL-0069 | Banco | Criar tabela `clinicas` | Média | PENDENTE |
| BL-0070 | Banco | Criar tabela `gravacoes` | Baixa | PENDENTE |
| BL-0071 | Banco | Criar tabela `transcricoes` | Baixa | PENDENTE |
| BL-0072 | Banco | Criar tabela `documentos` | Média | PENDENTE |
| BL-0073 | Banco | Criar tabela `logs_auditoria` | Alta | PENDENTE |
| BL-0074 | Banco | Criar tabela `consentimentos` | Alta | PENDENTE |

---

## 5. Matriz SDD/TDD por Tarefa

| ID | Tarefa | Spec criada | Teste criado | Implementado | Documentado |
|---|---|---|---|---|---|
| — | Cadastro/login | Sim (implícita) | Parcial (hash) | Sim | Sim |
| — | CRUD pacientes | Sim (implícita) | Não | Sim | Sim |
| — | Consulta com IA | Sim (implícita) | Sim | Sim | Sim |
| — | Pedidos de exames | Sim (implícita) | Não | Sim | Sim |
| — | Prescrição inteligente | Sim (implícita) | Sim (renal) | Sim | Sim |
| — | Escores cardiovasculares | Sim (implícita) | Não | Sim | Sim |
| — | Configurações | Sim (implícita) | Sim | Sim | Sim |
| — | Governança do repo | Sim | N/A | N/A | Sim |

---

## 6. Definição de Pronto

Uma tarefa só é considerada pronta quando:

- [ ] Requisito documentado.
- [ ] Critérios de aceite definidos.
- [ ] Teste criado ou justificativa registrada.
- [ ] Implementação concluída.
- [ ] Testes passando.
- [ ] Documentação atualizada.
- [ ] `CONTEXTO.md` atualizado.
- [ ] `RELATORIO.md` atualizado.
