# SPEC-004 — Criptografia de Dados Sensíveis no Banco

**ID:** SPEC-004  
**Backlog:** BL-0032  
**Prioridade:** Alta  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Criptografia)

---

## Objetivo

Implementar criptografia de dados sensíveis no banco de dados (dados de saúde do paciente) para atender ao Escopo Técnico e à LGPD.

## Contexto

O Escopo Técnico solicita criptografia de dados sensíveis no banco. Atualmente todos os dados são armazenados em texto plano no PostgreSQL. Dados de saúde são considerados sensíveis pela LGPD (Art. 11º) e exigem proteção adicional.

## Regras de negócio

- **RN-004.1:** Dados sensíveis devem ser criptografados no banco: nome do paciente, CPF, dados clínicos, transcrições, síntese IA.
- **RN-004.2:** A criptografia deve ser transparente para a aplicação (encrypt na escrita, decrypt na leitura).
- **RN-004.3:** A chave de criptografia não deve ser armazenada no banco.
- **RN-004.4:** Logs de auditoria não devem conter dados sensíveis descriptografados.
- **RN-004.5:** Backups devem incluir dados criptografados.

## Fluxo esperado

1. Ao salvar dados sensíveis, a aplicação criptografa antes de enviar ao banco.
2. Ao ler dados sensíveis, a aplicação descriptografa após receber do banco.
3. A chave de criptografia é lida de variável de ambiente.
4. Dados não sensíveis (IDs, timestamps, status) permanecem em texto plano para indexação.

## Critérios de aceite

- [ ] Avaliar abordagem: pgcrypto (PostgreSQL) vs app-level encryption.
- [ ] Implementar helper de encrypt/decrypt em `src/lib/crypto.ts`.
- [ ] Aplicar criptografia nas colunas sensíveis de `pacientes` (nome, cpf, dados clínicos).
- [ ] Aplicar criptografia em `consultas` (transcricao_completa, sintese_ia).
- [ ] Variável de ambiente `ENCRYPTION_KEY` adicionada ao `.env.example`.
- [ ] Migration para converter dados existentes (se houver).
- [ ] Testes unitários para encrypt/decrypt.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Banco | Avaliar pgcrypto ou app-level; possível migration de dados |
| Lib | `src/lib/crypto.ts` — funções `encrypt()` e `decrypt()` |
| API | Todas as rotas que leem/escrevem dados sensíveis |
| Infra | Nova env var `ENCRYPTION_KEY` |

## Testes necessários

- Validar encrypt/decrypt round-trip.
- Validar que dados criptografados não são legíveis no banco.
- Validar que chave incorreta gera erro.
- Validar performance com volume.

## Riscos

- **Risco:** Perda da chave = perda de todos os dados.  
  **Mitigação:** Backup seguro da chave + procedimento de rotação documentado.

- **Risco:** Performance — criptografia em colunas indexadas.  
  **Mitigação:** Não criptografar colunas de indexação (IDs, foreign keys).

- **Risco:** Busca textual em campos criptografados.  
  **Mitigação:** Avaliar blind index ou busca em memória após decrypt.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
