# SPEC-020 — Histórico de Documentos

**ID:** SPEC-020  
**Backlog:** BL-0072, BL-0043  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Documentos)

---

## Objetivo

Criar tabela `documentos` para rastrear todos os PDFs gerados (receitas, pedidos de exame, resumos, orientações) e permitir re-download.

## Contexto

O Escopo Técnico solicita tabela `documentos` para tracking de PDFs gerados. Atualmente PDFs são gerados on-the-fly e não há registro. O médico não consegue ver o histórico de documentos gerados para um paciente ou re-download um documento sem regerar.

## Regras de negócio

- **RN-020.1:** Tabela `documentos` registra: tipo (receita, pedido_exame, resumo_consulta, orientacoes, encaminhamento, relatorio), paciente_id, consulta_id (se aplicável), medico_id, data_geracao, arquivo_url (Storage).
- **RN-020.2:** Todo PDF gerado cria um registro na tabela.
- **RN-020.3:** O médico pode listar documentos por paciente ou por consulta.
- **RN-020.4:** O médico pode re-download um documento existente.
- **RN-020.5:** Documentos são imutáveis — não podem ser editados, apenas regerados.
- **RN-020.6:** Exclusão de documento requer justificativa e log de auditoria.

## Fluxo esperado

1. Médico gera PDF (receita, exame, resumo, etc.).
2. Sistema salva PDF no Supabase Storage.
3. Sistema cria registro na tabela `documentos`.
4. Médico pode listar documentos na página do paciente.
5. Médico pode re-download a qualquer momento.

## Critérios de aceite

- [ ] Tabela `documentos` criada (migration).
- [ ] PDFs salvos no Storage com URL persistida.
- [ ] API GET `/api/documentos?paciente_id=X` lista documentos.
- [ ] API GET `/api/documentos/[id]/download` retorna PDF.
- [ ] Componente de histórico de documentos na página do paciente.
- [ ] Tipos atualizados em `src/types/index.ts`.
- [ ] Testes unitários.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Nova tabela `documentos` |
| API | Novas rotas GET `/api/documentos` e `/api/documentos/[id]/download` |
| Tipos | Nova interface `Documento` |
| Componente | `DocumentoList` na página do paciente |
| Lib | Modificar geradores de PDF para salvar no Storage |

## Testes necessários

- Validar criação de registro ao gerar PDF.
- Validar listagem por paciente.
- Validar listagem por consulta.
- Validar re-download.

## Riscos

- **Risco:** Acúmulo de PDFs no Storage.  
  **Mitigação:** Política de retenção (similar a SPEC-005 para áudios).

## Dependências

- SPEC-008, SPEC-009, SPEC-010 (PDFs) — para que haja documentos a rastrear.
- SPEC-002 (Auditoria) — para registrar exclusão.
