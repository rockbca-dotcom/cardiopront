# SPEC-008 — PDF de Pedido de Exames

**ID:** SPEC-008  
**Backlog:** BL-0038  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: PDFs)

---

## Objetivo

Gerar PDF de pedido de exames cardiológicos com dados do médico, paciente e exames solicitados.

## Contexto

O Escopo Técnico solicita 6 tipos de PDF. Atualmente apenas receita (prescrição) tem PDF. Pedido de exames é a segunda prioridade. O médico precisa de um documento formal para entregar ao paciente ou enviar ao laboratório.

## Regras de negócio

- **RN-008.1:** PDF deve conter cabeçalho com dados do médico (nome, CRM, UF, especialidade, telefone).
- **RN-008.2:** PDF deve conter dados do paciente (nome, idade, data de nascimento).
- **RN-008.3:** PDF deve listar exames solicitados com nome, categoria, prioridade e indicação clínica.
- **RN-008.4:** PDF deve conter data da emissão e assinatura do médico.
- **RN-008.5:** PDF só pode ser gerado se o exame tiver `aprovado_pelo_medico = true` (depende de SPEC-003).
- **RN-008.6:** PDF deve ser gerado com `@react-pdf/renderer` (mesma lib da receita).

## Fluxo esperado

1. Médico aprova exame(s) na consulta.
2. Médico clica em "Gerar PDF de Pedido".
3. Sistema gera PDF com dados formatados.
4. PDF é exibido para download/impressão.

## Critérios de aceite

- [ ] Lib `src/lib/generateExamPdf.tsx` criada.
- [ ] API POST `/api/exames/[id]/pdf` gera e retorna PDF.
- [ ] Componente de botão "Gerar PDF" na página de exames.
- [ ] PDF contém cabeçalho, dados do paciente, exames, data e assinatura.
- [ ] Testes unitários para formatação do PDF.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Lib | `src/lib/generateExamPdf.tsx` |
| API | Nova rota POST `/api/exames/[id]/pdf` |
| Componente | Botão no `ExamBuilder` ou página de exames |

## Testes necessários

- Validar formatação do PDF com 1 exame.
- Validar formatação do PDF com múltiplos exames.
- Validar que PDF não é gerado sem aprovação.

## Riscos

- **Risco:** Layout do PDF quebrado em diferentes navegadores.  
  **Mitigação:** `@react-pdf/renderer` gera PDF server-side, independente de navegador.

## Dependências

- SPEC-003 (Aprovação médica) — para bloquear PDF não aprovado.
