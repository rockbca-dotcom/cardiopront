# SPEC-015 — Alerta de Alergia do Paciente na Prescrição

**ID:** SPEC-015  
**Backlog:** BL-0052  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Alerta de alergia)

---

## Objetivo

Exibir alerta quando o médico prescreve um medicamento ao qual o paciente tem alergia registrada.

## Contexto

O Escopo Técnico solicita alerta de alergia na prescrição. Atualmente o sistema tem alerta de interação medicamentosa e ajuste renal, mas não verifica alergias do paciente. Isso é um risco clínico crítico.

## Regras de negócio

- **RN-015.1:** O cadastro de paciente deve ter campo `alergias` (texto ou lista).
- **RN-015.2:** Ao prescrever medicamento, sistema cruza nome/princípio ativo com alergias do paciente.
- **RN-015.3:** Se houver match, exibir alerta vermelho bloqueante.
- **RN-015.4:** O médico pode sobrescrever o alerta com justificativa (texto obrigatório).
- **RN-015.5:** A sobrescrita deve ser registrada no log de auditoria.

## Fluxo esperado

1. Médico seleciona medicamento na prescrição.
2. Sistema verifica alergias do paciente.
3. Se match: alerta vermelho "Paciente tem alergia a [X]".
4. Médico pode escolher outro medicamento ou sobrescrever com justificativa.
5. Se sobrescrito: justificativa é salva e registrada no log.

## Critérios de aceite

- [ ] Campo `alergias` adicionado ao cadastro de paciente (migration).
- [ ] Lib `src/lib/alergia-check.ts` — verificar cruzamento.
- [ ] Componente de alerta no `PrescriptionForm`.
- [ ] Campo de justificativa ao sobrescrever.
- [ ] Sobrescrita registrada no log de auditoria.
- [ ] Testes unitários para cruzamento de alergias.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Campo `alergias` (text ou jsonb) em `pacientes` |
| Lib | `src/lib/alergia-check.ts` |
| Componente | Alerta no `PrescriptionForm` |
| Tipos | Atualizar interface `Paciente` |

## Testes necessários

- Validar alerta quando alergia match.
- Validar ausência de alerta quando sem match.
- Validar sobrescrita com justificativa.
- Validar sobrescrita sem justificativa (bloquear).

## Riscos

- **Risco:** Falso negativo — alergia registrada com nome diferente do medicamento.  
  **Mitigação:** Cruzar por princípio ativo + nome comercial + classe.

## Dependências

- SPEC-002 (Auditoria e logs) — para registrar sobrescrita.
