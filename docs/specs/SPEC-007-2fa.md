# SPEC-007 — Autenticação em Dois Fatores (2FA)

**ID:** SPEC-007  
**Backlog:** BL-0031  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: 2FA)

---

## Objetivo

Implementar autenticação em dois fatores (2FA) via TOTP para médicos, adicionando camada de segurança além de senha.

## Contexto

O Escopo Técnico sugere 2FA. O sistema lida com dados de saúde sensíveis — 2FA reduz risco de acesso indevido em caso de vazamento de senha. Atualmente a autenticação é apenas senha + cookie.

## Regras de negócio

- **RN-007.1:** 2FA é opcional para o médico (pode ativar nas configurações).
- **RN-007.2:** 2FA usa TOTP (RFC 6238) — compatível com Google Authenticator, Authy, etc.
- **RN-007.3:** Ao ativar, sistema gera secret e exibe QR Code.
- **RN-007.4:** Médico deve validar um código TOTP antes de confirmar ativação.
- **RN-007.5:** No login, se 2FA ativo, sistema exige código TOTP após senha.
- **RN-007.6:** Médico pode gerar códigos de backup (10 códigos de uso único).
- **RN-007.7:** Médico pode desativar 2FA nas configurações (exigindo senha).

## Fluxo esperado

1. Médico vai em Configurações → Segurança → Ativar 2FA.
2. Sistema gera secret TOTP e exibe QR Code.
3. Médico escaneia QR Code no app autenticador.
4. Médico digita código TOTP para confirmar.
5. Sistema valida e ativa 2FA.
6. Sistema gera 10 códigos de backup.
7. No próximo login: senha → código TOTP → sessão.

## Critérios de aceite

- [ ] Campo `totp_secret` e `totp_ativo` adicionados a `medicos`.
- [ ] Lib `src/lib/totp.ts` — gerar secret, validar código, gerar QR.
- [ ] API POST `/api/configuracoes/2fa/ativar` — gerar secret e QR.
- [ ] API POST `/api/configuracoes/2fa/confirmar` — validar código e ativar.
- [ ] API POST `/api/configuracoes/2fa/desativar` — desativar com senha.
- [ ] API POST `/api/auth/login` — exigir TOTP se ativo.
- [ ] Componente de configuração de 2FA nas configurações.
- [ ] Componente de verificação TOTP no login.
- [ ] Geração de códigos de backup.
- [ ] Testes unitários para TOTP.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Campos `totp_secret`, `totp_ativo`, `codigos_backup` em `medicos` |
| Lib | `src/lib/totp.ts` — usar `otplib` ou implementar TOTP |
| API | Novas rotas de ativação/confirmação/desativação |
| Componente | `TwoFactorSetup` e `TwoFactorVerify` |
| Dependência | Avaliar `otplib` ou `speakeasy` |

## Testes necessários

- Validar geração de secret TOTP.
- Validar código TOTP correto e incorreto.
- Validar fluxo de ativação.
- Validar fluxo de login com 2FA.
- Validar códigos de backup.

## Riscos

- **Risco:** Médico perde acesso ao app autenticador.  
  **Mitigação:** Códigos de backup + rota de recuperação com verificação de identidade.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
