# SPEC-012 — Upload Manual de Áudio

**ID:** SPEC-012  
**Backlog:** BL-0047  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Upload manual)

---

## Objetivo

Permitir que o médico faça upload de um arquivo de áudio gravado externamente (ex: gravador digital, smartphone) em vez de usar a gravação no navegador.

## Contexto

O Escopo Técnico solicita upload manual. Nem sempre o médico pode gravar no navegador (ex: consulta sem computador, áudio gravado em equipamento externo). O upload manual permite processar áudios externos pela mesma pipeline de IA.

## Regras de negócio

- **RN-012.1:** O médico pode escolher entre gravar no navegador ou fazer upload de arquivo.
- **RN-012.2:** Formatos aceitos: mp3, wav, m4a, ogg, webm.
- **RN-012.3:** Tamanho máximo: 25MB (limite da API Whisper).
- **RN-012.4:** O arquivo passa pela mesma pipeline: upload → transcrição → síntese.
- **RN-012.5:** Validar tipo MIME e duração antes do upload.

## Fluxo esperado

1. Médico seleciona "Upload de áudio" em vez de "Gravar".
2. Médico seleciona arquivo do computador.
3. Sistema valida formato e tamanho.
4. Sistema faz upload para Supabase Storage.
5. Sistema envia para transcrição (Whisper).
6. Sistema gera síntese (GPT-4o-mini).
7. Médico revisa e aprova.

## Critérios de aceite

- [ ] Componente de upload de arquivo na página de nova consulta.
- [ ] Validação de formato e tamanho.
- [ ] Upload para Supabase Storage.
- [ ] Integração com pipeline existente de transcrição e síntese.
- [ ] Testes unitários para validação de arquivo.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Componente | `AudioUpload` em `src/components/consulta/` |
| Lib | `src/lib/consultation-media.ts` — adicionar função de upload manual |
| API | Rota existente `/api/ai/transcrever` reutilizada |

## Testes necessários

- Validar formato aceito vs rejeitado.
- Validar tamanho máximo.
- Validar upload e transcrição de arquivo manual.

## Riscos

- **Risco:** Arquivo muito grande excede limite da API Whisper.  
  **Mitigação:** Validar tamanho antes do upload + mensagem clara.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
