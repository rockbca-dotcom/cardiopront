# SPEC-009 — PDF de Resumo da Consulta

**ID:** SPEC-009  
**Backlog:** BL-0039  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: PDFs)

---

## Objetivo

Gerar PDF de resumo/evolução da consulta com dados clínicos, síntese e conduta.

## Contexto

O Escopo Técnico solicita PDF de resumo da consulta. Atualmente a síntese IA fica apenas no sistema — o médico não tem um documento formal para arquivar ou compartilhar com o paciente.

## Regras de negócio

- **RN-009.1:** PDF deve conter cabeçalho com dados do médico e paciente.
- **RN-009.2:** PDF deve conter: motivo da consulta, queixa principal, história atual, exame físico, diagnósticos, conduta, exames pedidos, prescrições, orientações.
- **RN-009.3:** PDF deve conter data da consulta.
- **RN-009.4:** PDF deve ser gerado a partir dos dados salvos na consulta (não da síntese IA bruta).
- **RN-009.5:** PDF deve ter opção de incluir ou excluir dados sensíveis.

## Fluxo esperado

1. Médico finaliza consulta.
2. Médico clica em "Gerar Resumo da Consulta".
3. Sistema gera PDF com dados estruturados.
4. PDF é exibido para download/impressão.

## Critérios de aceite

- [ ] Lib `src/lib/generateConsultationSummaryPdf.tsx` criada.
- [ ] API POST `/api/consultas/[id]/pdf` gera e retorna PDF.
- [ ] Componente de botão na página de detalhe da consulta.
- [ ] PDF contém todas as seções clínicas.
- [ ] Testes unitários para formatação.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Lib | `src/lib/generateConsultationSummaryPdf.tsx` |
| API | Nova rota POST `/api/consultas/[id]/pdf` |
| Componente | Botão na página de detalhe da consulta |

## Testes necessários

- Validar formatação com consulta completa.
- Validar formatação com consulta parcial (campos vazios).
- Validar opção de excluir dados sensíveis.

## Riscos

- **Risco:** PDF muito longo em consultas complexas.  
  **Mitigação:** Paginação automática do `@react-pdf/renderer`.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
