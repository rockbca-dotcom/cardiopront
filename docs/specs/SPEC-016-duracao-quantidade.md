# SPEC-016 — Duração e Quantidade na Prescrição

**ID:** SPEC-016  
**Backlog:** BL-0053  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Campos da prescrição)

---

## Objetivo

Adicionar campos `duracao` e `quantidade` na prescrição de medicamentos.

## Contexto

O Escopo Técnico solicita campos de duração do tratamento e quantidade do medicamento. Atualmente a prescrição tem posologia mas não tem duração explícita (ex: "por 30 dias") nem quantidade a ser dispensada (ex: "2 caixas").

## Regras de negócio

- **RN-016.1:** Campo `duracao` (texto livre ou numérico + unidade) — ex: "30 dias", "6 meses", "uso contínuo".
- **RN-016.2:** Campo `quantidade` (texto ou numérico) — ex: "2 caixas", "30 comprimidos".
- **RN-016.3:** Ambos os campos são opcionais (médico pode não preencher).
- **RN-016.4:** Os campos devem aparecer no PDF da receita.
- **RN-016.5:** A IA pode sugerir duração e quantidade na síntese.

## Fluxo esperado

1. Médico prescreve medicamento.
2. Formulário tem campos "Duração do tratamento" e "Quantidade".
3. Médico preenche (opcional).
4. Dados são salvos na prescrição.
5. PDF da receita inclui duração e quantidade.

## Critérios de aceite

- [ ] Migration adiciona `duracao` e `quantidade` em `prescricoes`.
- [ ] Campos no `PrescriptionForm`.
- [ ] Campos no PDF da receita.
- [ ] Tipos atualizados em `src/types/index.ts`.
- [ ] Testes unitários.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | 2 colunas em `prescricoes` |
| Tipos | Atualizar interface `Prescricao` |
| Componente | `PrescriptionForm` — 2 novos campos |
| Lib | `generatePrescriptionPdf.tsx` — incluir no PDF |

## Testes necessários

- Validar prescrição com duração e quantidade.
- Validar prescrição sem duração e quantidade (campos opcionais).
- Validar exibição no PDF.

## Riscos

- Nenhum risco significativo.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
