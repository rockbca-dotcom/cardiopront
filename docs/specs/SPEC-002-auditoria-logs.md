# SPEC-002 — Auditoria e Logs

**ID:** SPEC-002  
**Backlog:** BL-0073  
**Prioridade:** Alta  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Auditoria)

---

## Objetivo

Implementar trilha de auditoria com logs de acesso e alteração para todos os registros do sistema, conforme exigido pelo Escopo Técnico, LGPD e CFM 1.821/2007.

## Contexto

O Escopo Técnico solicita logs de acesso e alteração para trilha de auditoria. Atualmente o sistema usa apenas `console.error` nas rotas de API — não há persistência de logs, impossibilitando rastrear quem acessou ou alterou o quê.

## Regras de negócio

- **RN-002.1:** Toda operação de criação, alteração e exclusão deve gerar log de auditoria.
- **RN-002.2:** Todo login e logout devem gerar log.
- **RN-002.3:** O log deve registrar: usuário, ação, entidade, ID do registro, data, IP e detalhes (antes/depois).
- **RN-002.4:** Logs de auditoria não podem ser editados ou excluídos (append-only).
- **RN-002.5:** O médico deve poder visualizar a trilha de auditoria por consulta.
- **RN-002.6:** Logs devem ser retidos por no mínimo 5 anos (requisito regulatório).
- **RN-002.7:** Acesso aos logs restrito ao médico proprietário dos dados.

## Fluxo esperado

1. Usuário realiza ação (criar, editar, excluir, login, logout).
2. Sistema intercepta a ação (middleware ou wrapper).
3. Sistema cria registro na tabela `logs_auditoria` com dados do usuário, ação, entidade, IP e diff.
4. Logs ficam disponíveis para consulta via API.
5. Médico pode filtrar logs por consulta, paciente, data ou tipo de ação.

## Critérios de aceite

- [ ] Tabela `logs_auditoria` criada no banco (migration).
- [ ] Middleware ou helper de auditoria em `src/lib/auditoria.ts`.
- [ ] Todas as rotas de POST/PUT/DELETE geram log de auditoria.
- [ ] Rotas de login/logout geram log.
- [ ] API GET `/api/auditoria` com filtros (consulta, paciente, data, ação).
- [ ] Componente de visualização de logs na página de detalhe da consulta.
- [ ] Logs são append-only (constraint no banco).
- [ ] Testes unitários para helper de auditoria.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Nova tabela `logs_auditoria` (ver `docs/BANCO_DADOS.md` seção 13.6) |
| API | Nova rota GET `/api/auditoria` |
| Lib | `src/lib/auditoria.ts` — função `registrarLog()` |
| Tipos | Nova interface `LogAuditoria` em `src/types/index.ts` |
| Componente | `AuditoriaTimeline` em `src/components/consulta/` |
| Middleware | Interceptação em todas as rotas mutativas |

## Testes necessários

- Validar criação de log em operação de insert.
- Validar criação de log em operação de update com diff.
- Validar criação de log em operação de delete.
- Validar que logs não podem ser editados.
- Validar filtro por consulta/paciente/data.

## Riscos

- **Risco:** Performance — logging em toda operação pode adicionar latência.  
  **Mitigação:** Avaliar insert assíncrono ou fila.

- **Risco:** Volume de dados — logs podem crescer rapidamente.  
  **Mitigação:** Política de retenção de 5 anos + particionamento por data.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
