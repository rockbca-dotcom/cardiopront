# SPEC-019 — Perfis de Usuário

**ID:** SPEC-019  
**Backlog:** BL-0056  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Perfis)

---

## Objetivo

Implementar perfis de usuário além do médico: secretária, admin de clínica e admin do sistema.

## Contexto

O Escopo Técnico define 4 perfis: médico, secretária, admin de clínica, admin do sistema. Atualmente apenas o perfil médico existe. A secretária precisa agendar e gerenciar pacientes. O admin de clínica gerencia médicos e configurações. O admin do sistema gerencia clínicas e planos.

## Regras de negócio

- **RN-019.1:** Perfis: `medico`, `secretaria`, `admin_clinica`, `admin_sistema`.
- **RN-019.2:** Tabela `usuarios` separada de `medicos` — nem todo usuário é médico.
- **RN-019.3:** Permissões por perfil:
  - **Médico:** acesso total a pacientes, consultas, exames, prescrições, scores.
  - **Secretária:** cadastra/edita pacientes, agenda consultas, não acessa dados clínicos.
  - **Admin clínica:** gerencia médicos, pacientes e configurações da clínica.
  - **Admin sistema:** gerencia clínicas, planos e configurações globais.
- **RN-019.4:** O perfil é definido no cadastro e validado em cada rota de API.
- **RN-019.5:** A secretária pertence a uma clínica e vê apenas pacientes daquela clínica.

## Fluxo esperado

1. Admin do sistema cadastra clínicas e admins de clínica.
2. Admin de clínica cadastra médicos e secretárias.
3. Médico faz login → vê suas consultas e pacientes.
4. Secretária faz login → vê pacientes da clínica, agenda consultas.
5. Cada rota de API valida o perfil do usuário.

## Critérios de aceite

- [ ] Tabela `usuarios` criada (migration).
- [ ] Campo `perfil` (enum) em `usuarios`.
- [ ] `getServerUser()` retorna perfil do usuário.
- [ ] Middleware de autorização por perfil em rotas de API.
- [ ] Páginas de cadastro de secretária e admin.
- [ ] Tipos atualizados em `src/types/index.ts`.
- [ ] Testes unitários para validação de perfil.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Nova tabela `usuarios`; relacionamento com `medicos` |
| API | Middleware de autorização em todas as rotas |
| Lib | `src/lib/auth-server.ts` — retornar perfil; `src/lib/autorizacao.ts` — validar perfil |
| Tipos | Nova interface `Usuario`; enum `Perfil` |
| Página | Cadastro de secretária/admin |

## Testes necessários

- Validar médico acessa dados clínicos.
- Validar secretária não acessa dados clínicos.
- Validar admin clínica gerencia médicos.
- Validar admin sistema gerencia clínicas.

## Riscos

- **Risco:** Quebra de rotas existentes que assumem que todo usuário é médico.  
  **Mitigação:** Migration preserva médicos existentes; rotas validam perfil.

## Dependências

- SPEC-018 (Clínicas) — secretária e admin pertencem a clínica.
