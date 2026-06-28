# SPEC-013 — Destaque de Trechos com Baixa Confiança

**ID:** SPEC-013  
**Backlog:** BL-0050  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: Confiança)

---

## Objetivo

Destacar trechos da transcrição com baixa confiança para que o médico revise com atenção.

## Contexto

O Escopo Técnico solicita destaque de trechos com baixa confiança na transcrição. O Whisper pode retornar confiança por segmento. Trechos com baixa confiança (nomes de medicamentos, dosagens, termos técnicos) são mais propensos a erro e devem ser destacados.

## Regras de negócio

- **RN-013.1:** A transcrição deve ser exibida com trechos coloridos por nível de confiança.
- **RN-013.2:** Confiança alta (>0.9): texto normal. Confiança média (0.7-0.9): amarelo. Confiança baixa (<0.7): vermelho.
- **RN-013.3:** O médico pode clicar em um trecho destacado para editar manualmente.
- **RN-013.4:** A confiança deve ser persistida com a transcrição.

## Fluxo esperado

1. Whisper retorna transcrição com `avg_logprob` por segmento.
2. Sistema converte `logprob` para escala 0-1 (confiança).
3. Transcrição é exibida com cores por nível de confiança.
4. Médico revisa trechos destacados e edita se necessário.
5. Versão editada é salva como transcrição final.

## Critérios de aceite

- [ ] API `/api/ai/transcrever` retorna confiança por segmento.
- [ ] Componente de transcrição com destaque visual por confiança.
- [ ] Edição inline de trechos destacados.
- [ ] Confiança persistida no banco.
- [ ] Testes unitários para conversão de logprob.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| API | `/api/ai/transcrever` — retornar `segments` com `avg_logprob` |
| Lib | `src/lib/transcricao-confianca.ts` — converter logprob para 0-1 |
| Componente | Atualizar componente de transcrição com cores |
| Banco | Campo `confianca_estimada` em `consultas` ou tabela `transcricoes` |

## Testes necessários

- Validar conversão de logprob para escala 0-1.
- Validar classificação de cores por threshold.

## Riscos

- **Risco:** Whisper pode não retornar logprob em todos os casos.  
  **Mitigação:** Se logprob indisponível, assumir confiança média.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
