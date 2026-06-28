# SPEC-001 — Consentimento do Paciente

**ID:** SPEC-001  
**Backlog:** BL-0036, BL-0074  
**Prioridade:** Alta  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Consentimento)

---

## Objetivo

Implementar registro formal de consentimento do paciente para gravação de consulta e uso de IA na síntese, conforme exigido pelo Escopo Técnico e pela LGPD.

## Contexto

O Escopo Técnico especifica que o paciente deve consentir explicitamente com:
1. Gravação de áudio da consulta.
2. Processamento da transcrição e síntese por IA.

Atualmente não há nenhum mecanismo de consentimento. O áudio é gravado e processado sem registro formal de aceite. Isso é uma não conformidade com a LGPD (Art. 8º) e com o CFM 1.821/2007.

## Regras de negócio

- **RN-001.1:** O consentimento deve ser obtido antes de iniciar a gravação.
- **RN-001.2:** O consentimento deve registrar a versão do termo aceito.
- **RN-001.3:** O consentimento deve registrar a forma de aceite (digital, verbal, assinado).
- **RN-001.4:** O paciente pode revogar o consentimento a qualquer momento.
- **RN-001.5:** Se o consentimento for revogado, áudios e transcrições devem ser excluídos.
- **RN-001.6:** O termo de consentimento deve ser versionado — mudanças no termo exigem novo aceite.
- **RN-001.7:** O médico deve poder visualizar o status de consentimento do paciente antes da consulta.

## Fluxo esperado

1. Médico seleciona paciente para nova consulta.
2. Sistema verifica se paciente tem consentimento vigente (tipo `gravacao` + `uso_ia`).
3. Se não tiver, sistema exibe termo de consentimento atual.
4. Médico registra aceite (digital, verbal ou assinado).
5. Sistema cria registro na tabela `consentimentos`.
6. Médico pode iniciar gravação.
7. A qualquer momento, médico pode revogar consentimento — sistema exclui áudios e transcrições relacionadas.

## Critérios de aceite

- [ ] Tabela `consentimentos` criada no banco (migration).
- [ ] API GET `/api/consentimentos?paciente_id=X` retorna status de consentimento.
- [ ] API POST `/api/consentimentos` registra novo consentimento.
- [ ] API DELETE `/api/consentimentos/[id]` revoga consentimento e exclui dados relacionados.
- [ ] Componente de consentimento exibido antes da gravação.
- [ ] Médico não consegue iniciar gravação sem consentimento vigente.
- [ ] Termo versionado e armazenado no banco.
- [ ] Testes unitários para regras de negócio.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Nova tabela `consentimentos` (ver `docs/BANCO_DADOS.md` seção 13.7) |
| API | Novas rotas: GET, POST, DELETE em `/api/consentimentos` |
| Tipos | Nova interface `Consentimento` em `src/types/index.ts` |
| Lib | `src/lib/consentimento.ts` — validação de consentimento vigente |
| Componente | `ConsentimentoPanel` em `src/components/consulta/` |
| Página | Integrar no fluxo de nova consulta |

## Testes necessários

- Validar consentimento vigente vs expirado.
- Validar revogação exclui dados relacionados.
- Validar versionamento do termo.
- Validar bloqueio de gravação sem consentimento.

## Riscos

- **Risco:** Exclusão de dados em revogação pode afetar consultas já finalizadas.  
  **Mitigação:** Avaliar retenção mínima exigida por lei antes de excluir.

- **Risco:** Termo desatualizado se não houver versionamento.  
  **Mitigação:** Campo `versao_termo` obrigatório.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
