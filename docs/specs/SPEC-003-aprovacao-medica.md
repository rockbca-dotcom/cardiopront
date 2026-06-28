# SPEC-003 — Aprovação Médica em Prescrições e Exames

**ID:** SPEC-003  
**Backlog:** BL-0037  
**Prioridade:** Alta  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Aprovação obrigatória)

---

## Objetivo

Adicionar campo `aprovado_pelo_medico` em prescrições e exames para registrar aprovação formal do médico antes da geração do documento final.

## Contexto

O Escopo Técnico estabelece que a IA é assistente de preenchimento e o médico é responsável final. Todo documento (receita, pedido de exame) deve ter aprovação explícita do médico. Atualmente prescrições e exames são salvos sem registro de aprovação.

## Regras de negócio

- **RN-003.1:** Toda prescrição deve ter campo `aprovado_pelo_medico` (boolean, default `false`).
- **RN-003.2:** Todo exame deve ter campo `aprovado_pelo_medico` (boolean, default `false`).
- **RN-003.3:** PDF de receita só pode ser gerado se `aprovado_pelo_medico = true`.
- **RN-003.4:** A aprovação deve registrar data e hora (`aprovado_em`).
- **RN-003.5:** Uma vez aprovado, o documento não pode ser editado — apenas cancelado e recriado.
- **RN-003.6:** O médico deve ver um indicador visual de "pendente de aprovação" vs "aprovado".

## Fluxo esperado

1. Médico cria prescrição ou exame (via IA ou manual).
2. Registro é salvo com `aprovado_pelo_medico = false`.
3. Médico revisa o conteúdo.
4. Médico clica em "Aprovar".
5. Sistema atualiza `aprovado_pelo_medico = true` e `aprovado_em = now()`.
6. PDF pode ser gerado.
7. Se médico precisar alterar, deve cancelar e recriar.

## Critérios de aceite

- [ ] Migration adiciona `aprovado_pelo_medico` (boolean) e `aprovado_em` (timestamp) em `prescricoes`.
- [ ] Migration adiciona `aprovado_pelo_medico` (boolean) e `aprovado_em` (timestamp) em `exames`.
- [ ] API POST/PUT define `aprovado_pelo_medico = false` por padrão.
- [ ] API POST `/api/prescricao/[id]/aprovar` marca como aprovado.
- [ ] API POST `/api/exames/[id]/aprovar` marca como aprovado.
- [ ] Geração de PDF bloqueada se não aprovado.
- [ ] Componente exibe badge "Pendente" ou "Aprovado".
- [ ] Testes unitários para regras de aprovação.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Migration: adicionar 2 colunas em `prescricoes` e 2 em `exames` |
| API | Novas rotas: POST aprovar em prescrição e exame |
| Tipos | Atualizar interfaces `Prescricao` e `Exame` em `src/types/index.ts` |
| Lib | `src/lib/aprovacao.ts` — validação de aprovação |
| Componente | Badge de status no `PrescriptionForm` e `ExamBuilder` |

## Testes necessários

- Validar que prescrição nova tem `aprovado_pelo_medico = false`.
- Validar que PDF não é gerado sem aprovação.
- Validar que aprovação registra timestamp.
- Validar que documento aprovado não pode ser editado.

## Riscos

- **Risco:** Médico pode aprovar sem revisar cuidadosamente.  
  **Mitigação:** UX: destacar conteúdo a revisar antes do botão de aprovação.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
