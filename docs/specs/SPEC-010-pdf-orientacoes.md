# SPEC-010 — PDF de Orientações ao Paciente

**ID:** SPEC-010  
**Backlog:** BL-0040  
**Prioridade:** Média  
**Status:** RASCUNHO  
**Criado em:** 2026-06-28  
**Especificação de origem:** `docs/Escopo_Tecnico_Plataforma_Consulta_Medica_IA_Arcane_Tecnologia.md` (item: PDFs)

---

## Objetivo

Gerar PDF de orientações ao paciente com linguagem acessível, baseado nas orientações da consulta.

## Contexto

O Escopo Técnico solicita PDF de orientações ao paciente. O cardiologista frequentemente dá orientações de lifestyle, dieta, exercício e retorno que o paciente esquece. Um PDF impresso melhora adesão.

## Regras de negócio

- **RN-010.1:** PDF deve conter nome do paciente e data da consulta.
- **RN-010.2:** PDF deve conter orientações em linguagem leiga (não técnica).
- **RN-010.3:** PDF deve conter seções: cuidados gerais, medicação, retorno, sinais de alarme.
- **RN-010.4:** PDF deve ter espaço para telefone de contato do médico.
- **RN-010.5:** PDF deve ter rodapé com "Documento gerado pelo CardioPront".

## Fluxo esperado

1. Médico finaliza consulta com orientações preenchidas.
2. Médico clica em "Gerar Orientações ao Paciente".
3. Sistema gera PDF em linguagem acessível.
4. PDF é exibido para download/impressão/entrega ao paciente.

## Critérios de aceite

- [ ] Lib `src/lib/generateOrientationPdf.tsx` criada.
- [ ] API POST `/api/consultas/[id]/orientacoes-pdf` gera e retorna PDF.
- [ ] Componente de botão na página de detalhe da consulta.
- [ ] PDF contém seções estruturadas em linguagem leiga.
- [ ] Testes unitários para formatação.
- [ ] Documentação atualizada.

## Impacto técnico

| Camada | Impacto |
|---|---|
| Lib | `src/lib/generateOrientationPdf.tsx` |
| API | Nova rota POST `/api/consultas/[id]/orientacoes-pdf` |
| Componente | Botão na página de detalhe da consulta |

## Testes necessários

- Validar formatação com orientações completas.
- Validar formatação com orientações vazias (mensagem padrão).

## Riscos

- **Risco:** Orientações em linguagem técnica demais.  
  **Mitigação:** Template com linguagem pré-definida em pt-BR leigo.

## Dependências

- Nenhuma. Pode ser implementada independentemente.
