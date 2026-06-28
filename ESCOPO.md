# ESCOPO.md — Escopo do Projeto

**Projeto:** CardioPront  
**Atualizado em:** 2026-06-28  
**Fase:** Desenvolvimento (MVP funcional)  
**Especificação de origem:** `Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (Arcane Tecnologia, v1.0, 28/06/2026)

---

## 1. Objetivo do Projeto

O CardioPront é um prontuário eletrônico inteligente voltado exclusivamente para cardiologistas brasileiros. O objetivo é substituir papel, PDFs e sistemas genéricos por uma plataforma digital especializada em cardiologia, com transcrição por voz, pedidos de exames cardiológicos, prescrição inteligente com alertas de interação e ajuste renal, cálculo de escores cardiovasculares validados e síntese automática de consultas por IA.

---

## 2. Problema que o Sistema Resolve

O cardiologista brasileiro enfrenta:

- **Prontuários genéricos** que não contemplam especificidades da cardiologia (escores, exames cardiológicos, medicamentos cardiovasculares).
- **Perda de tempo com registro manual** de consultas longas e complexas.
- **Risco de erro em prescrições** sem alertas de interação e ajuste renal.
- **Dificuldade de acompanhar a evolução cardiovascular** do paciente ao longo do tempo.
- **Falta de conformidade com LGPD e CFM 1.821/2007** em sistemas informais.

O CardioPront resolve essas dores com uma plataforma feita sob medida, com IA que transcreve e sintetiza consultas, catálogos especializados e alertas clínicos automáticos.

---

## 3. Público-Alvo / Usuários

| Perfil | Descrição | Permissões | Status no código |
|---|---|---|---|
| Médico (cardiologista) | Profissional que atende pacientes, registra consultas, prescreve e pede exames | Acesso total aos seus próprios pacientes, consultas, exames, prescrições e escores | Implementado |
| Médico (plano trial) | Médico em período de teste (14 dias) | Mesmas permissões funcionais, sem cobrança | Implementado |
| Médico (plano profissional) | Médico assinante individual | Mesmas permissões funcionais | Implementado (sem enforcement) |
| Médico (plano clínica) | Médico de clínica multi-profissional | A CONFIRMAR — modelo multi-médico não implementado | Pendente |
| Secretária/assistente | Perfil sugerido pelo Escopo Técnico para gestão administrativa | A CONFIRMAR | Não implementado |
| Administrador da clínica | Perfil sugerido pelo Escopo Técnico para gestão da clínica | A CONFIRMAR | Não implementado |
| Administrador do sistema | Perfil sugerido pelo Escopo Técnico para gestão global | A CONFIRMAR | Não implementado |

> **Observação:** O Escopo Técnico (Arcane Tecnologia) sugere 4 perfis (médico, secretária/assistente, administrador da clínica, administrador do sistema). Apenas o perfil médico está implementado.

---

## 4. Escopo Funcional

### Módulo Auth
- [x] Cadastro de médico com CRM e UF
- [x] Login com e-mail e senha
- [x] Logout
- [x] Sessão via cookie httpOnly
- [x] Guard de rotas (client-side e server-side)
- [x] Conta demo (bootstrap)

### Módulo Dashboard
- [x] Estatísticas: total de pacientes, consultas e exames
- [x] Atalhos rápidos para cadastro e novas ações

### Módulo Pacientes
- [x] Listar pacientes do médico
- [x] Cadastrar paciente (nome, nascimento, sexo, CPF, contato, tipo sanguíneo, peso, altura, alergias)
- [x] Detalhe do paciente com histórico completo (consultas, exames, prescrições)
- [x] Cálculo de idade e IMC
- [ ] Editar paciente — A CONFIRMAR
- [ ] Excluir paciente — A CONFIRMAR
- [ ] Gerenciar comorbidades — definido no schema mas sem CRUD
- [ ] Gerenciar medicamentos em uso — definido no schema mas sem CRUD
- [ ] Campo endereço — solicitado pelo Escopo Técnico, não implementado
- [ ] Campo convênio — solicitado pelo Escopo Técnico, não implementado
- [ ] Termo de consentimento para gravação e uso de IA — solicitado pelo Escopo Técnico, não implementado

### Módulo Consultas
- [x] Listar consultas do médico
- [x] Nova consulta com formulário completo (sinais vitais, exame físico, diagnóstico, conduta)
- [x] Gravação de áudio no navegador
- [x] Upload de áudio para Supabase Storage
- [x] Transcrição via Whisper (pt-BR)
- [x] Síntese estruturada via GPT-4o-mini
- [x] Prefill automático de campos a partir da síntese
- [x] Plano de follow-up (medicamentos, exames, encaminhamentos)
- [x] Detalhe da consulta com áudio reproduzível, transcrição e síntese
- [x] Cálculo automático de IMC ao salvar
- [ ] Pausa e retomada da gravação — solicitado pelo Escopo Técnico, não implementado
- [ ] Separação aproximada entre médico e paciente na transcrição — solicitado pelo Escopo Técnico, não implementado
- [ ] Processamento em tempo real — solicitado pelo Escopo Técnico, não implementado (após finalizar)
- [ ] Upload manual de áudio — solicitado pelo Escopo Técnico, não implementado
- [ ] Editar consulta — A CONFIRMAR
- [ ] Excluir consulta — A CONFIRMAR

### Módulo Exames
- [x] Listar exames pedidos
- [x] Catálogo de 24 tipos de exame cardiológico
- [x] Pedir novo exame com prioridade e indicação clínica
- [x] Histórico de exames por paciente
- [ ] Registrar resultado de exame — A CONFIRMAR
- [ ] Editar/excluir exame — A CONFIRMAR

### Módulo Prescrição
- [x] Listar prescrições
- [x] Catálogo de 30 medicamentos cardiovasculares
- [x] Busca de medicamentos no catálogo
- [x] Criar prescrição com dose, frequência, via, posologia
- [x] Alerta de interação medicamentosa
- [x] Cálculo de função renal (CKD-EPI 2021 + Cockcroft-Gault)
- [x] Alerta de ajuste renal para medicamentos sensíveis
- [x] Geração de PDF de receita
- [ ] Alerta de alergia do paciente — solicitado pelo Escopo Técnico, não implementado
- [ ] Campo duração — solicitado pelo Escopo Técnico, não implementado
- [ ] Campo quantidade — solicitado pelo Escopo Técnico, não implementado
- [ ] Campo `aprovado_pelo_medico` — solicitado pelo Escopo Técnico, não implementado
- [ ] Editar/excluir prescrição — A CONFIRMAR

### Módulo Escores Cardiovasculares
- [x] CHA₂DS₂-VASc (risco de AVC em fibrilação atrial)
- [x] HAS-BLED (risco de sangramento em anticoagulação)
- [x] Framingham (risco cardiovascular 10 anos)
- [x] Classificação NYHA (insuficiência cardíaca)
- [x] Classificação Killip (pós-IAM)
- [x] Persistência de escores por paciente/consulta
- [x] Histórico de escores por paciente
- [ ] EuroSCORE2 — definido no enum mas sem implementação

### Módulo Configurações
- [x] Carregar perfil do médico
- [x] Salvar nome, e-mail, CRM, UF, especialidade, telefone
- [x] Validação com Zod e normalização de inputs

### Módulo IA
- [x] Transcrição de áudio (Whisper, pt-BR)
- [x] Síntese estruturada de consulta (GPT-4o-mini, JSON)
- [x] Validação do contrato de saída com Zod
- [x] Extração de JSON de respostas com markdown fences
- [ ] Destaque de trechos com baixa confiança na transcrição — solicitado pelo Escopo Técnico, não implementado
- [ ] Campos "não informado" quando não houver evidência — solicitado pelo Escopo Técnico, parcial (defaults via Zod)
- [ ] Registro de alterações feitas pelo médico na síntese — solicitado pelo Escopo Técnico, não implementado

### Módulo Geração de Documentos PDF
- [x] PDF de receita simples
- [ ] PDF de pedido de exames — solicitado pelo Escopo Técnico, não implementado
- [ ] PDF de resumo da consulta — solicitado pelo Escopo Técnico, não implementado
- [ ] PDF de orientações ao paciente — solicitado pelo Escopo Técnico, não implementado
- [ ] PDF de encaminhamento — solicitado pelo Escopo Técnico, não implementado
- [ ] PDF de relatório médico simples — solicitado pelo Escopo Técnico, não implementado
- [ ] Histórico de documentos gerados — solicitado pelo Escopo Técnico, não implementado
- [ ] Impressão direta — solicitado pelo Escopo Técnico, não implementado
- [ ] Envio por WhatsApp ou e-mail — solicitado pelo Escopo Técnico, não implementado

### Módulo Auditoria e Logs
- [ ] Logs de acesso — solicitado pelo Escopo Técnico, não implementado
- [ ] Logs de alteração — solicitado pelo Escopo Técnico, não implementado
- [ ] Trilha de auditoria por consulta — solicitado pelo Escopo Técnico, não implementado
- [ ] Registro de IP nas ações — solicitado pelo Escopo Técnico, não implementado

### Módulo Consentimento
- [ ] Termo de consentimento do paciente para gravação — solicitado pelo Escopo Técnico, não implementado
- [ ] Termo de consentimento para uso de IA — solicitado pelo Escopo Técnico, não implementado
- [ ] Registro de versão do termo e forma de aceite — solicitado pelo Escopo Técnico, não implementado

### Módulo Marketing/Landing Page
- [x] Landing page pública com SEO (metadata, OpenGraph, SchemaOrg)
- [x] Seções: hero, funcionalidades, como funciona, preços, FAQ, CTA
- [x] Página de login
- [x] Página de cadastro

---

## 5. Escopo Não Funcional

### Segurança
- Senhas hasheadas com PBKDF2-SHA256 (210.000 iterações)
- Cookie httpOnly, sameSite lax, secure em produção
- Isolamento de dados por médico (filtro `medico_id`)
- Validação de entrada com Zod
- Conformidade LGPD e CFM 1.821/2007 (parcial — ver pendências)

#### Requisitos de segurança do Escopo Técnico (status de implementação)
- [x] Login seguro
- [x] Senha criptografada (PBKDF2-SHA256)
- [ ] Autenticação em dois fatores (2FA) — solicitado, não implementado
- [ ] Controle de acesso por perfil — apenas perfil médico implementado
- [x] Criptografia em trânsito via HTTPS (Vercel + Supabase)
- [ ] Criptografia de dados sensíveis no banco — não implementado
- [ ] Criptografia de áudios armazenados — não implementado (bucket público)
- [ ] Logs de acesso — não implementado
- [ ] Logs de alteração — não implementado
- [ ] Trilha de auditoria por consulta — não implementado
- [ ] Consentimento do paciente para gravação — não implementado
- [ ] Política de retenção dos áudios — não implementado
- [ ] Exclusão ou anonimização de dados — não implementado
- [ ] Backup automático — dependente do Supabase, A CONFIRMAR
- [ ] Segregação por clínica — não implementado (sem tabela de clínicas)
- [x] Isolamento de dados entre usuários (por médico)
- [ ] Termos de uso — não implementado
- [ ] Política de privacidade — não implementado

### Performance
- NÃO IDENTIFICADO requisito de resposta definido
- Sem cache implementado
- Sem paginação nas listagens (risco de degradação)

### Disponibilidade
- Depende de Vercel (frontend) e Supabase (banco + storage)
- Sem SLA definido

### Escalabilidade
- Arquitetura serverless (Vercel) escala horizontalmente
- Supabase escala verticalmente
- Sem rate limiting

### Usabilidade
- Interface em português brasileiro
- Design system com TailwindCSS (cores primárias, surface, badges, cards)
- Navegação via Sidebar com ícones Lucide
- Notificações via react-hot-toast

### Acessibilidade
- NÃO IDENTIFICADO conformidade com WCAG

### Observabilidade
- `console.error` nas rotas de API
- Sem sistema de logs estruturado
- Sem monitoramento de erros (ex: Sentry)

### Manutenibilidade
- TypeScript estrito
- Lógica de domínio separada em `src/lib/` com testes unitários
- Componentes organizados por feature em `src/components/`

### Compatibilidade
- Navegadores modernos (MediaRecorder API necessária para gravação de áudio)
- Responsivo (TailwindCSS breakpoints)

### LGPD
- Dados de saúde armazenados em Supabase (cloud)
- Sem mecanismo de anonimização
- Sem mecanismo de exportação/exclusão de dados do titular
- Sem consentimento explícito registrado
- Sem termos de uso e política de privacidade formalizados
- Sem política de retenção de áudios
- **Pontos sensíveis identificados pelo Escopo Técnico:** áudio da consulta, transcrição, dados pessoais do paciente, diagnóstico, prescrição, exames, histórico médico, documentos gerados

---

## 6. Fora do Escopo (MVP atual)

- **Perfil de paciente** (acesso do paciente ao próprio prontuário) — não implementado.
- **Perfil de secretária/assistente** — sugerido pelo Escopo Técnico, não implementado.
- **Perfil de administrador da clínica** — sugerido pelo Escopo Técnico, não implementado.
- **Perfil de administrador do sistema** — sugerido pelo Escopo Técnico, não implementado.
- **Multi-médico por clínica** — mencionado na landing page e no Escopo Técnico, não implementado.
- **Business Intelligence** — mencionado na landing page, não implementado.
- **API para laboratórios** — mencionado na landing page e no Escopo Técnico, não implementado.
- **Assinatura digital ICP-Brasil** — mencionado na landing page e no Escopo Técnico, não implementado.
- **Criptografia AES-256 ponta a ponto** — mencionado na landing page, não implementado.
- **Aplicativo mobile** — não implementado.
- **Integração com sistemas de laboratório** — não implementado.
- **Integração com convênios** — solicitado pelo Escopo Técnico, não implementado.
- **Telemedicina com vídeo** — não implementado (apenas gravação de áudio).
- **Cobrança/recorrente (gateway de pagamento)** — não implementado.
- **Notificações por e-mail/SMS/push** — não implementado.
- **Agendamento de consultas** — solicitado pelo Escopo Técnico, não implementado.
- **Lembretes de retorno** — solicitado pelo Escopo Técnico, não implementado.
- **Histórico longitudinal cardiovascular** — solicitado pelo Escopo Técnico, não implementado.
- **Gráficos de evolução** — solicitado pelo Escopo Técnico, não implementado.
- **Integração com wearable** — solicitado pelo Escopo Técnico, não implementado.
- **OCR de exames enviados pelo paciente** — solicitado pelo Escopo Técnico, não implementado.
- **Chatbot para pré-consulta** — solicitado pelo Escopo Técnico, não implementado.
- **Integração com plataforma de prescrição eletrônica** — solicitado pelo Escopo Técnico, não implementado.
- **Prontuário eletrônico completo** — solicitado pelo Escopo Técnico, não implementado.

---

## 7. Regras de Negócio

| Código | Regra | Módulo | Status |
|---|---|---|---|
| RN-001 | O médico precisa estar autenticado para acessar o painel | Auth | Confirmado |
| RN-002 | O e-mail do médico deve ser único (case-insensitive) | Auth | Confirmado |
| RN-003 | A senha deve ter no mínimo 6 caracteres | Auth | Confirmado |
| RN-004 | O médico recebe plano `trial` com 14 dias ao se cadastrar | Auth | Confirmado |
| RN-005 | O médico só vê seus próprios pacientes, consultas, exames e prescrições | Todos | Confirmado |
| RN-006 | O IMC é calculado automaticamente se peso e altura forem informados | Consulta | Confirmado |
| RN-007 | A síntese IA deve retornar um JSON estruturado validado por Zod | IA | Confirmado |
| RN-008 | O prefill só preenche campos vazios; não sobrescreve texto manual | Consulta | Confirmado |
| RN-009 | Medicamentos com `ajuste_renal = true` exigem alerta se clearance < 60 mL/min | Prescrição | Confirmado |
| RN-010 | A função renal é estimada via CKD-EPI 2021 e Cockcroft-Gault, usando o menor valor | Prescrição | Confirmado |
| RN-011 | O áudio da consulta é armazenado no Supabase Storage e vinculado via `audio_url` | Consulta | Confirmado |
| RN-012 | A transcrição usa Whisper configurado para português brasileiro | IA | Confirmado |
| RN-013 | A síntese usa GPT-4o-mini com temperature 0.2 e max_tokens 1500 | IA | Confirmado |
| RN-014 | Escores cardiovasculares são persistidos por consulta e paciente | Scores | Confirmado |
| RN-015 | O catálogo de exames possui 24 tipos pré-cadastrados em 4 categorias | Exame | Confirmado |
| RN-016 | O catálogo de medicamentos possui 30 medicamentos cardiovasculares | Prescrição | Confirmado |
| RN-017 | A landing page apresenta 3 planos: Trial (R$ 0), Profissional (R$ 199/mês), Clínica (R$ 499/mês) | Marketing | Confirmado |
| RN-018 | Planos não têm enforcement de features no código | Auth | Confirmado |
| RN-019 | Comorbidades e medicamentos ativos do paciente são definidos no schema mas sem CRUD | Paciente | Pendente |
| RN-020 | EuroSCORE2 está definido no enum de tipos de score mas sem implementação | Scores | Pendente |
| RN-021 | A IA deve ser tratada como assistente de preenchimento, não como responsável final pela prescrição | IA | Confirmado (princípio do Escopo Técnico) |
| RN-022 | A IA deve trabalhar em modo rascunho assistido, com aprovação obrigatória do médico | IA | Confirmado (princípio do Escopo Técnico) |
| RN-023 | A IA não deve emitir diagnóstico final sozinha | IA | Confirmado (princípio do Escopo Técnico) |
| RN-024 | A IA não deve prescrever sem validação médica | IA | Confirmado (princípio do Escopo Técnico) |
| RN-025 | A IA não deve enviar receita automaticamente | IA | Confirmado (princípio do Escopo Técnico) |
| RN-026 | A IA deve destacar incertezas e mostrar origem da informação | IA | Parcial (trechos_suporte no schema) |
| RN-027 | A IA deve usar apenas dados da consulta, sem inventar informações | IA | Confirmado (prompt restritivo) |
| RN-028 | Documentos gerados pela IA devem ter campo `aprovado_pelo_medico` | Prescrição/Exame | Pendente (não implementado) |
| RN-029 | Consentimento do paciente é obrigatório para gravação e uso de IA | Consentimento | Pendente (não implementado) |
| RN-030 | Política de retenção dos áudios deve ser definida | Consulta | Pendente (não implementado) |
| RN-031 | Backup automático deve estar configurado | Infra | Pendente (dependente do Supabase) |
| RN-032 | Termos de uso e política de privacidade devem ser formalizados | Legal | Pendente (não implementado) |

---

## 8. Critérios de Aceite

### Critérios gerais
- [x] Sistema executa localmente com `npm run dev`
- [x] Variáveis de ambiente documentadas em `.env.example`
- [x] Funcionalidades principais documentadas em `ARQUITETURA.md`
- [x] Banco de dados documentado em `BANCO_DADOS.md`
- [x] Fluxos principais validados (cadastro, login, consulta, prescrição, exames)
- [ ] Testes principais passam — A CONFIRMAR (não executados nesta sessão)
- [ ] Sem credenciais expostas — **PENDENTE**: fallback hardcoded em `src/lib/db.ts`, credenciais demo em código
- [ ] Relatório diário atualizado em `RELATORIO.md`

### Critérios de aceite do MVP (Escopo Técnico — Arcane Tecnologia)
- [x] O médico consegue cadastrar paciente
- [x] Iniciar consulta
- [x] Gravar áudio
- [x] Gerar transcrição
- [x] Receber resumo estruturado
- [x] Gerar rascunho de prescrição
- [x] Gerar rascunho de exames
- [x] Editar manualmente
- [ ] Aprovar documentos (campo `aprovado_pelo_medico`) — não implementado
- [x] Gerar PDF (apenas receita)
- [ ] Gerar PDF de pedido de exames — não implementado
- [ ] Gerar PDF de resumo da consulta — não implementado
- [x] Visualizar histórico da consulta
- [x] Acessar dados com segurança (auth + isolamento)
- [ ] Registrar logs básicos de uso — não implementado
- [ ] Backup automático — A CONFIRMAR
- [ ] Controle de acesso por perfil — apenas médico

---

## 9. Entregáveis

- **Código-fonte:** Next.js 15 + TypeScript + TailwindCSS
- **Documentação:** `AGENTS.md`, `ARQUITETURA.md`, `BANCO_DADOS.md`, `ESCOPO.md`, `ROADMAP.md`, `CONTEXTO.md`, `RELATORIO.md`
- **Scripts:** `prisma/schema.sql`, `prisma/seed-*.sql`, `supabase/migrations/*.sql`
- **Testes:** 7 arquivos de teste unitário em `src/lib/*.test.ts`
- **Migrations:** 2 migrations em `supabase/migrations/`
- **Deploy:** Vercel (configurado)
- **Manual de execução:** Comandos em `ARQUITETURA.md` seção 11

---

## 10. Premissas

- O médico tem acesso a um navegador moderno com suporte a MediaRecorder API.
- O Supabase está configurado e acessível (URL e chave anon).
- A OpenAI API está configurada e acessível (`OPENAI_API_KEY`).
- O médico possui CRM e UF válidos.
- O sistema será usado por um médico por vez (sem concorrência multi-usuário no mesmo registro).
- Os seeds (medicamentos e exames) foram aplicados no Supabase.

---

## 11. Restrições

- **Dados de saúde:** LGPD e CFM 1.821/2007 aplicáveis — exige cuidado com armazenamento, acesso e auditoria.
- **OpenAI:** Dependência externa para transcrição e síntese — indisponibilidade afeta funcionalidades de IA.
- **Supabase:** Dependência externa para banco e storage — indisponibilidade afeta todo o sistema.
- **Vercel:** Dependência para deploy — sem configuração de CI/CD alternativa.
- **Sem RLS:** Segurança depende inteiramente da camada de aplicação.
- **Bucket público:** Áudios de consulta acessíveis via URL pública.

---

## 12. Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Bucket de áudio público | Vazamento de dados de saúde | Alta | Tornar bucket privado + URLs assinadas |
| Sem RLS no Supabase | Acesso indevido a dados se app comprometida | Alta | Ativar RLS com policy por `medico_id` |
| Rota `/api/debug` expõe ambiente | Vazamento de informações sensíveis | Média | Remover ou proteger rota antes de produção |
| Credenciais demo no código | Acesso não autorizado à conta demo | Média | Remover em produção ou proteger com auth |
| Fallback hardcoded de URL/chave Supabase | Misconfiguration mascarada | Média | Remover fallback e exigir env vars |
| Sem paginação | Degradação de performance | Média | Implementar paginação |
| Dependência OpenAI | Indisponibilidade de IA | Baixa | Implementar fallback ou retry |
| Sem auditoria | Impossível rastrear alterações | Média | Criar tabela de auditoria |
| Landing page promete features não implementadas | Expectativa não atendida | Alta | Alinhar landing page com escopo real |
