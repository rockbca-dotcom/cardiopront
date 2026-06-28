# Changelog

## Unreleased

### Added
- Gravações de consulta agora são enviadas para Supabase Storage e vinculadas à consulta salva como `audio_url`.
- A tela de nova consulta passou a exibir o áudio salvo, a transcrição e o estado de processamento da gravação.
- A listagem de consultas ganhou busca, métricas e badges para áudio, transcrição e síntese IA.
- Foi criada a página de detalhe da consulta com áudio reproduzível, transcrição expandível, campos clínicos e síntese estruturada.
- Adicionado bucket `consultation-audio` no Supabase para persistência dos arquivos gravados.
