# SPEC-014 — Registro de Alterações do Médico na Síntese

**ID:** SPEC-014  
**Backlog:** BL-0051  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Registro de alterações)

---

## Objetivo

Registrar as alterações feitas pelo médico entre a síntese IA original e a versão final aprovada, para trilha de auditoria e melhoria contínua da IA.

## Contexto

O Escopo Técnico solicita registro de alterações do médico na síntese. Isso permite: (1) auditoria — saber o que o médico mudou, (2) feedback — entender onde a IA errou, (3) transparência — distinguir conteúdo da IA vs conteúdo do médico.

## Regras de negócio

- **RN-014.1:** A síntese IA original deve ser preservada imutável.
- **RN-014.2:** A versão final aprovada pelo médico deve ser salva separadamente.
- **RN-014.3:** O sistema deve calcular o diff entre as duas versões.
- **RN-014.4:** O diff deve ser persistido para auditoria.
- **RN-014.5:** O médico deve poder visualizar o que alterou (opcional).

## Fluxo esperado

1. IA gera síntese → salva como `sintese_ia_original`.
2. Médico revisa e edita campos no formulário.
3. Médico aprova → salva como `sintese_ia_final`.
4. Sistema calcula diff campo a campo.
5. Diff é persistido em `logs_auditoria` ou tabela própria.

## Critérios de aceite

- [ ] Campo `sintese_ia_original` (jsonb) e `sintese_ia_final` (jsonb) em `consultas`.
- [ ] Lib `src/lib/sintese-diff.ts` — calcular diff entre versões.
- [ ] Diff persistido no log de auditoria.
- [ ] Componente opcional de visualização de alterações.
- [ ] Testes unitários para cálculo de diff.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Campos `sintese_ia_original` e `sintese_ia_final` em `consultas` |
| Lib | `src/lib/sintese-diff.ts` |
| Componente | `SinteseDiffViewer` (opcional) |

## Testes necessários

- Validar diff entre versões idênticas (vazio).
- Validar diff com campos alterados.
- Validar diff com campos adicionados/removidos.

## Riscos

- **Risco:** Diff muito granular pode gerar muito volume.  
  **Mitigação:** Diff campo a campo (não palavra a palavra).

## Dependências

- SPEC-002 (Auditoria e logs) — para persistir o diff.
