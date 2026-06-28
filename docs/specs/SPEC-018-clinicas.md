# SPEC-018 — Cadastro de Clínicas e Multi-Médico

**ID:** SPEC-018  
**Backlog:** BL-0069  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Clínicas)

---

## Objetivo

Criar tabela `clinicas` e permitir que múltiplos médicos compartilhem pacientes e dados sob uma mesma clínica.

## Contexto

O Escopo Técnico solicita suporte a clínicas multi-médico. Atualmente cada médico tem seus próprios pacientes isolados. Clínicas com mais de um cardiologista precisam compartilhar o cadastro de pacientes para evitar duplicação e permitir continuidade do cuidado.

## Regras de negócio

- **RN-018.1:** Uma clínica tem: nome, CNPJ, endereço, telefone, logo (opcional).
- **RN-018.2:** Um médico pertence a uma clínica (opcional — pode ser independente).
- **RN-018.3:** Pacientes cadastrados por um médico da clínica são visíveis para outros médicos da mesma clínica.
- **RN-018.4:** Consultas, exames e prescrições continuam isolados por médico (cada médico tem suas próprias consultas).
- **RN-018.5:** O admin da clínica pode gerenciar médicos e pacientes.
- **RN-018.6:** Médicos independentes (sem clínica) mantêm isolamento total de dados.

## Fluxo esperado

1. Admin da clínica cadastra a clínica.
2. Admin convida médicos para a clínica.
3. Médicos aceitam e passam a ver pacientes compartilhados.
4. Médico A cadastra paciente → Médico B vê o paciente na listagem.
5. Médico B pode criar consulta para o paciente compartilhado.
6. Cada médico vê apenas suas próprias consultas/exames/prescrições.

## Critérios de aceite

- [ ] Tabela `clinicas` criada (migration).
- [ ] Campo `clinica_id` em `medicos` (opcional).
- [ ] Campo `clinica_id` em `pacientes` (opcional).
- [ ] API GET `/api/pacientes` retorna pacientes da clínica se médico pertencer a uma.
- [ ] API CRUD `/api/clinicas` para gerenciar clínica.
- [ ] Tipos atualizados em `src/types/index.ts`.
- [ ] Testes unitários para lógica de compartilhamento.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Nova tabela `clinicas`; colunas `clinica_id` em `medicos` e `pacientes` |
| API | Nova rota `/api/clinicas`; modificar `/api/pacientes` para escopo de clínica |
| Tipos | Novas interfaces `Clinica`; atualizar `Medico` e `Paciente` |
| Lib | `src/lib/clinica.ts` — lógica de compartilhamento |

## Testes necessários

- Validar médico sem clínica vê apenas seus pacientes.
- Validar médico com clínica vê pacientes de outros médicos da clínica.
- Validar consultas continuam isoladas por médico.

## Riscos

- **Risco:** Vazamento de dados entre clínicas.  
  **Mitigação:** Filtros rigorosos por `clinica_id` + RLS no Supabase.

## Dependências

- SPEC-019 (Perfis de usuário) — para admin da clínica.
