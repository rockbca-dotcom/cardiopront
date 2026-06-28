# SPEC-017 — Endereço e Convênio no Cadastro de Paciente

**ID:** SPEC-017  
**Backlog:** BL-0054, BL-0055  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Campos do paciente)

---

## Objetivo

Adicionar campos de endereço e convênio de saúde no cadastro de paciente.

## Contexto

O Escopo Técnico solicita campos de endereço e convênio. Atualmente o cadastro de paciente tem: nome, data de nascimento, sexo, CPF, telefone, email, peso, altura, tipo sanguíneo. Faltam endereço (para correspondência e referência geográfica) e convênio de saúde (para pedidos de exame e faturamento).

## Regras de negócio

- **RN-017.1:** Endereço: `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `cep` — todos opcionais.
- **RN-017.2:** Convênio: `convenio_nome` (texto), `convenio_numero` (texto) — opcionais.
- **RN-017.3:** Endereço e convênio devem aparecer no PDF de pedido de exames.
- **RN-017.4:** A IA pode sugerir endereço e convênio na síntese se mencionados na consulta.

## Fluxo esperado

1. Médico cadastra ou edita paciente.
2. Formulário tem seção "Endereço" e "Convênio".
3. Médico preenche (opcional).
4. Dados são salvos.
5. PDF de pedido de exames inclui convênio.

## Critérios de aceite

- [ ] Migration adiciona campos de endereço e convênio em `pacientes`.
- [ ] Campos no formulário de paciente.
- [ ] Convênio aparece no PDF de pedido de exames.
- [ ] Tipos atualizados em `src/types/index.ts`.
- [ ] Testes unitários.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | 9 colunas em `pacientes` (7 endereço + 2 convênio) |
| Tipos | Atualizar interface `Paciente` |
| Componente | Formulário de paciente — novos campos |
| Lib | `generateExamPdf.tsx` — incluir convênio |

## Testes necessários

- Validar cadastro com endereço completo.
- Validar cadastro sem endereço (campos opcionais).
- Validar exibição de convênio no PDF.

## Riscos

- Nenhum risco significativo.

## Dependências

- SPEC-008 (PDF de pedido de exames) — para incluir convênio no PDF.
