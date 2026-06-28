# Specs — Índice de Especificações (SDD)

**Projeto:** CardioPront  
**Criado em:** 2026-06-28  
**Metodologia:** Specification-Driven Development (SDD)

Cada spec segue o template definido na seção 9 do `AGENTS.md`: objetivo, contexto, regras de negócio, fluxo esperado, critérios de aceite, impacto técnico, testes necessários, riscos e dependências.

---

## Specs por prioridade

### Prioridade Alta

| ID | Spec | Backlog | Descrição |
|---|---|---|---|
| SPEC-001 | [Consentimento do paciente](./SPEC-001-consentimento-paciente.md) | BL-0036, BL-0074 | Registro de consentimento para gravação e uso de IA |
| SPEC-002 | [Auditoria e logs](./SPEC-002-auditoria-logs.md) | BL-0073 | Tabela `logs_auditoria` e trilha de auditoria por consulta |
| SPEC-003 | [Aprovação médica](./SPEC-003-aprovacao-medica.md) | BL-0037 | Campo `aprovado_pelo_medico` em prescrições e exames |
| SPEC-004 | [Criptografia de dados sensíveis](./SPEC-004-criptografia-dados.md) | BL-0032 | Criptografia no banco (pgcrypto ou app-level) |
| SPEC-005 | [Retenção de áudios](./SPEC-005-retencao-audios.md) | BL-0034 | Política de retenção e purge de áudios |
| SPEC-006 | [Termos de uso e privacidade](./SPEC-006-termos-uso-privacidade.md) | BL-0035 | Redação e publicação de termos e política |
| SPEC-007 | [2FA](./SPEC-007-2fa.md) | BL-0031 | Autenticação em dois fatores (TOTP) |

### Prioridade Média

| ID | Spec | Backlog | Descrição |
|---|---|---|---|
| SPEC-008 | [PDF de pedido de exames](./SPEC-008-pdf-pedido-exames.md) | BL-0038 | Geração de PDF para pedido de exames |
| SPEC-009 | [PDF de resumo da consulta](./SPEC-009-pdf-resumo-consulta.md) | BL-0039 | Geração de PDF de resumo/evolução |
| SPEC-010 | [PDF de orientações ao paciente](./SPEC-010-pdf-orientacoes.md) | BL-0040 | Geração de PDF de orientações |
| SPEC-011 | [Pausa e retomada da gravação](./SPEC-011-pausa-gravacao.md) | BL-0046 | Controle de pausa no RecordingButton |
| SPEC-012 | [Upload manual de áudio](./SPEC-012-upload-manual.md) | BL-0047 | Upload de arquivo de áudio sem gravação no navegador |
| SPEC-013 | [Destaque de baixa confiança](./SPEC-013-destaque-confianca.md) | BL-0050 | Destacar trechos com baixa confiança na transcrição |
| SPEC-014 | [Registro de alterações na síntese](./SPEC-014-registro-alteracoes.md) | BL-0051 | Log de diff entre síntese IA e versão final aprovada |
| SPEC-015 | [Alerta de alergia na prescrição](./SPEC-015-alerta-alergia.md) | BL-0052 | Cruzar alergias do paciente com medicamento prescrito |
| SPEC-016 | [Duração e quantidade na prescrição](./SPEC-016-duracao-quantidade.md) | BL-0053 | Campos duração e quantidade do medicamento |
| SPEC-017 | [Endereço e convênio no paciente](./SPEC-017-endereco-convenio.md) | BL-0054, BL-0055 | Campos endereço e convênio no cadastro de paciente |
| SPEC-018 | [Cadastro de clínicas](./SPEC-018-clinicas.md) | BL-0069 | Tabela `clinicas` e segregação multi-médico |
| SPEC-019 | [Perfis de usuário](./SPEC-019-perfis-usuario.md) | BL-0056 | Secretária, admin clínica, admin sistema |
| SPEC-020 | [Histórico de documentos](./SPEC-020-historico-documentos.md) | BL-0072, BL-0043 | Tabela `documentos` e tracking de PDFs gerados |

---

## Status

| Status | Significado |
|---|---|
| RASCUNHO | Spec criada, aguardando revisão |
| APROVADA | Spec revisada e pronta para implementação |
| EM IMPLEMENTAÇÃO | Spec sendo implementada |
| CONCLUÍDA | Spec implementada e validada |
