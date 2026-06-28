# SPEC-011 — Pausa e Retomada da Gravação

**ID:** SPEC-011  
**Backlog:** BL-0046  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Gravação)

---

## Objetivo

Permitir pausar e retomar a gravação de áudio durante a consulta.

## Contexto

O Escopo Técnico solicita controle de pausa na gravação. Atualmente o `RecordingButton` apenas inicia e para. O médico pode precisar pausar durante atendimento (conversa paralela, exame físico, etc.) sem gerar múltiplos arquivos.

## Regras de negócio

- **RN-011.1:** O médico pode pausar a gravação a qualquer momento.
- **RN-011.2:** O médico pode retomar a gravação sem criar novo arquivo.
- **RN-011.3:** O áudio final deve ser um único arquivo concatenado.
- **RN-011.4:** O tempo de pausa não deve contar na duração total.
- **RN-011.5:** O componente deve exibir status visual: gravando, pausado, parado.

## Fluxo esperado

1. Médico inicia gravação (status: gravando).
2. Médico clica em pausar (status: pausado).
3. Médico clica em retomar (status: gravando).
4. Médico clica em finalizar (status: parado).
5. Sistema concatena segmentos em um único áudio.
6. Áudio é enviado para transcrição.

## Critérios de aceite

- [ ] `RecordingButton` atualizado com estados: gravando, pausado, parado.
- [ ] Botão de pausar/retomar visível durante gravação.
- [ ] Segmentos de áudio concatenados em arquivo único.
- [ ] Indicador visual de tempo gravado (excluindo pausas).
- [ ] Testes unitários para lógica de concatenação.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Componente | `RecordingButton` em `src/components/consulta/` |
| Lib | Lógica de concatenação de áudio (MediaRecorder API) |

## Testes necessários

- Validar concatenação de segmentos.
- Validar cálculo de duração excluindo pausas.
- Validar estados do componente.

## Riscos

- **Risco:** Concatenação de áudio pode ter gaps ou sobreposições.  
  **Mitigação:** Usar timestamps precisos e validar formato final.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
