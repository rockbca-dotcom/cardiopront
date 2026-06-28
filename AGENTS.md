# AGENTS.md — Regras de Execução de Agentes no Repositório

**Projeto:** CardioPront  
**Atualizado em:** 2026-06-28  
**Status:** Ativo  
**Especificação de origem:** `Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (Arcane Tecnologia, v1.0, 28/06/2026)

---

## 1. Objetivo deste arquivo

O `AGENTS.md` define oficialmente:

- Como agentes de IA, automações e colaboradores técnicos devem operar no projeto.
- Como investigar o repositório antes de modificar qualquer arquivo.
- Como documentar mudanças realizadas.
- Como usar SDD (Specification-Driven Development) e TDD (Test-Driven Development).
- Como padronizar mensagens de commit.
- Como manter contexto, roadmap, arquitetura, banco e relatório sempre atualizados.

Este arquivo é a **fonte de verdade operacional** para qualquer agente que atue no repositório CardioPront.

---

## 2. Princípios obrigatórios

Todo agente deve seguir estes princípios sem exceção:

- **Sempre buscar contexto antes de alterar.** Ler `CONTEXTO.md`, `ARQUITETURA.md`, `BANCO_DADOS.md` e `ESCOPO.md` antes de qualquer mudança.
- **Sempre trabalhar com mudanças pequenas e rastreáveis.** Um commit por tarefa concluída.
- **Sempre atualizar documentação junto com código.** Toda alteração funcional exige atualização do arquivo de governança correspondente.
- **Nunca inventar comportamento, endpoints, schemas ou regras de negócio.** Se não estiver no código, marcar como `A CONFIRMAR`.
- **Nunca mascarar erro com mock, stub ou fallback falso sem documentação.** Todo fallback deve ser explicitamente documentado.
- **Nunca expor secrets, tokens ou credenciais.** Usar apenas valores fictícios em exemplos.
- **Nunca fazer commit ou push sem autorização explícita do usuário.**
- **Nunca deixar o projeto em estado quebrado.** Validar build e testes antes de finalizar.
- **Sempre registrar decisões relevantes no `CONTEXTO.md`.**
- **Sempre atualizar o `RELATORIO.md` ao final de cada sessão.**

---

## 3. Regras de commit em pt-BR usando Conventional Commits

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

## 4. SDD — Specification-Driven Development

Toda funcionalidade deve começar por especificação, não por código.

### Fluxo obrigatório

1. Ler documentação existente (`ARQUITETURA.md`, `BANCO_DADOS.md`, `ESCOPO.md`, `CONTEXTO.md`).
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
6. Registrar decisões relevantes em `CONTEXTO.md`.
7. Atualizar `ROADMAP.md` se a tarefa fizer parte de fase, épico ou história.

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

## 5. TDD — Test-Driven Development

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
- Não reduzir cobertura sem justificativa em `RELATORIO.md`.
- Se a stack não tiver testes configurados para uma área, registrar isso e propor configuração inicial.

### Comandos detectados no projeto

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

## 6. Atualização obrigatória de documentação

Toda tarefa técnica deve atualizar a documentação correspondente.

### Arquivos de governança e quando atualizar

| Arquivo | Atualizar quando... |
|---|---|
| `ARQUITETURA.md` | Houver mudança estrutural, módulo, fluxo ou integração. |
| `BANCO_DADOS.md` | Houver mudança em tabelas, models, migrations, índices, constraints ou seeds. |
| `ESCOPO.md` | Houver mudança de requisito, regra de negócio ou limite do projeto. |
| `ROADMAP.md` | Houver mudança de fase, épico, prioridade ou tarefa. |
| `CONTEXTO.md` | Houver decisão técnica, bloqueio, mudança importante ou estado novo. |
| `RELATORIO.md` | Ao final de cada sessão/dia de trabalho. |

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

## 7. Segurança e integridade

- **Nunca expor** `.env`, tokens, senhas, chaves privadas ou credenciais em código ou documentação.
- **Nunca copiar secrets** para documentação. Usar valores fictícios seguros (ex: `sk-your-openai-key`).
- Antes de registrar exemplos, usar valores fictícios seguros.
- Não criar backdoors, bypass de autenticação ou desativar validações sem autorização.
- Validar entradas de usuário em todas as rotas de API.
- Documentar riscos de segurança encontrados em `CONTEXTO.md`.
- Registrar pendências críticas em `CONTEXTO.md`.

### Observações de segurança específicas do projeto

- O projeto lida com **dados de saúde** (LGPD e CFM 1.821/2007 aplicáveis).
- Senhas são hasheadas com PBKDF2-SHA256 (210.000 iterações).
- Autenticação via cookie httpOnly `cp_session`.
- O bucket `consultation-audio` no Supabase Storage é público — revisar política de acesso se necessário.
- A rota `/api/debug` expõe informações de ambiente — remover ou proteger antes de produção.
- **Itens do Escopo Técnico não implementados (críticos):** consentimento do paciente, auditoria/logs, 2FA, criptografia de dados sensíveis no banco, criptografia de áudios, política de retenção, termos de uso e política de privacidade, campo `aprovado_pelo_medico` em prescrições e exames.
- **Princípios da IA (Escopo Técnico):** a IA é assistente de preenchimento, não responsável final; rascunho assistido com aprovação obrigatória do médico; não inventar informações; destacar incertezas; mostrar origem da informação.

---

## 8. Conduta para agentes

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
