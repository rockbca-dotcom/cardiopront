# SPEC-005 — Política de Retenção de Áudios

**ID:** SPEC-005  
**Backlog:** BL-0034  
**Prioridade:** Alta  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Retenção)

---

## Objetivo

Definir e implementar política de retenção e purge automático de áudios de consulta armazenados no Supabase Storage.

## Contexto

O Escopo Técnico solicita política de retenção de áudios. Atualmente áudios são armazenados indefinidamente no bucket `consultation-audio` sem nenhuma política de expiração. Isso é um risco de segurança e não conformidade com a LGPD (princípio da minimização).

## Regras de negócio

- **RN-005.1:** Áudios devem ser retidos por no máximo 90 dias após a consulta (A CONFIRMAR prazo com jurídico).
- **RN-005.2:** Após o prazo, o áudio deve ser excluído do Storage.
- **RN-005.3:** A transcrição e síntese IA devem ser mantidas (são texto, não áudio).
- **RN-005.4:** O médico deve ser notificado antes da exclusão (7 dias de antecedência).
- **RN-005.5:** O médico pode estender a retenção de um áudio específico por mais 90 dias.
- **RN-005.6:** A exclusão deve ser registrada no log de auditoria.
- **RN-005.7:** O paciente pode solicitar exclusão antecipada (direito do titular LGPD).

## Fluxo esperado

1. Áudio é uploaded após consulta.
2. Sistema registra `data_upload` e calcula `data_expiracao = data_upload + 90 dias`.
3. Job diário verifica áudios próximos da expiração.
4. 7 dias antes, sistema notifica médico (in-app ou e-mail).
5. Médico pode estender ou permitir exclusão.
6. No dia da expiração, áudio é excluído do Storage.
7. `audio_url` em `consultas` é marcada como `expirada`.
8. Exclusão é registrada no log de auditoria.

## Critérios de aceite

- [ ] Campo `data_expiracao` adicionado a `consultas` (ou tabela `gravacoes`).
- [ ] Job de verificação diária (cron ou Supabase function).
- [ ] Notificação ao médico 7 dias antes da expiração.
- [ ] API POST `/api/consultas/[id]/estender-retencacao` para prorrogar.
- [ ] Exclusão automática no dia da expiração.
- [ ] Log de auditoria da exclusão.
- [ ] Campo `audio_expirado` (boolean) em `consultas`.
- [ ] Testes unitários para lógica de retenção.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Campo `data_expiracao` e `audio_expirado` em `consultas` |
| API | Nova rota para estender retenção |
| Lib | `src/lib/retencacao.ts` — lógica de expiração |
| Infra | Cron job ou Supabase Edge Function para purge diário |

## Testes necessários

- Validar cálculo de data de expiração.
- Validar notificação 7 dias antes.
- Validar exclusão no dia correto.
- Validar extensão de retenção.
- Validar registro no log de auditoria.

## Riscos

- **Risco:** Exclusão prematura de áudio necessário para auditoria.  
  **Mitigação:** Médico pode estender; prazo configurável.

- **Risco:** Job falha e áudios não são excluídos.  
  **Mitigação:** Monitoramento + alerta se job não executar.

## Dependências

- SPEC-002 (Auditoria e logs) — para registrar exclusão.
