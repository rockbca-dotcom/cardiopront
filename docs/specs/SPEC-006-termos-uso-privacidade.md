# SPEC-006 — Termos de Uso e Política de Privacidade

**ID:** SPEC-006  
**Backlog:** BL-0035  
**Prioridade:** Alta  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Termos)

---

## Objetivo

Redigir e publicar termos de uso e política de privacidade do CardioPront, conforme exigido pelo Escopo Técnico e pela LGPD.

## Contexto

O Escopo Técnico solicita termos de uso e política de privacidade formalizados. Atualmente não há nenhum documento legal. A LGPD (Art. 9º) exige informação clara sobre tratamento de dados. O CFM 1.821/2007 exige transparência sobre armazenamento de prontuário eletrônico.

## Regras de negócio

- **RN-006.1:** Termos de uso devem cobrir: descrição do serviço, direitos e deveres, uso de IA, retenção de dados, exclusão.
- **RN-006.2:** Política de privacidade deve cobrir: dados coletados, finalidade, base legal, compartilhamento, direitos do titular, medidas de segurança.
- **RN-006.3:** Documentos devem ser versionados e datados.
- **RN-006.4:** Médico deve aceitar termos no cadastro.
- **RN-006.5:** Paciente deve ter acesso aos termos (via médico ou link).
- **RN-006.6:** Mudanças nos termos exigem novo aceite do médico.

## Fluxo esperado

1. Redigir termos de uso e política de privacidade (com revisão jurídica).
2. Publicar em páginas públicas (`/termos` e `/privacidade`).
3. No cadastro de médico, exigir aceite dos termos.
4. Registrar aceite com versão e data.
5. Ao atualizar termos, exigir novo aceite no próximo login.

## Critérios de aceite

- [ ] Termos de uso redigidos e publicados em `/termos`.
- [ ] Política de privacidade redigida e publicada em `/privacidade`.
- [ ] Páginas com SEO e acessíveis sem login.
- [ ] Checkbox de aceite no cadastro de médico.
- [ ] Registro de aceite (versão + data) na tabela `medicos`.
- [ ] Bloqueio de acesso se termos atualizados e não aceitos.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Página | Novas rotas: `/termos` e `/privacidade` |
| Banco | Campos `termos_versao` e `termos_aceitos_em` em `medicos` |
| API | Validação de aceite no login |
| Componente | Checkbox de aceite no formulário de cadastro |

## Testes necessários

- Validar bloqueio de cadastro sem aceite.
- Validar bloqueio de login se termos atualizados.
- Validar registro de versão e data.

## Riscos

- **Risco:** Termos desatualizados com mudanças na LGPD.  
  **Mitigação:** Revisão jurídica anual + versionamento.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
