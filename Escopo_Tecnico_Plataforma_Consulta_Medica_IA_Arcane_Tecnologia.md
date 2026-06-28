ARCANE TECNOLOGIA
Engenharia de Software & Soluções Inteligentes

ESCOPO TÉCNICO

Plataforma de Consulta Médica
com Transcrição, IA e Geração de
Prescrições

MVP com validação médica obrigatória, foco inicial em cardiologia e geração de
documentos clínicos em PDF.

Cliente

Projeto

[Nome do Cliente]

Plataforma médica com transcrição por voz, síntese por IA e prescrição
assistida

Tipo de documento

Escopo Técnico

Data

Versão

28/06/2026

1.0

Preparado por: Rui Diniz
Engenheiro de Sistemas
Arcane Tecnologia
Contato: (12) 99133-2258

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

Sumário

Este sumário apresenta as seções principais do documento técnico formatado para validação executiva
e técnica.

• 1. Visão Geral

• 2. Objetivo do MVP

• 3. Justificativa Técnica e Regulatória

• 4. Módulos Principais do Sistema

• 5. Segurança e LGPD

• 6. Banco de Dados

• 7. Arquitetura Sugerida

• 8. Funcionalidades do MVP

• 9. Funcionalidades Futuras

• 10. Fluxo Ideal da Consulta

• 11. Cuidados Importantes

• 12. Riscos do Projeto

• 13. Critérios de Aceite do MVP

• 14. Conclusão Técnica

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 2 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

Documento técnico formatado pela Arcane Tecnologia.
Conteúdo original preservado e organizado em padrão executivo/técnico, com foco em legibilidade,
rastreabilidade e validação do escopo.

ESCOPO DO PROJETO

Plataforma de Consulta Médica com Transcrição, IA e Geração
de Prescrições

Projeto: Plataforma médica com transcrição por voz, síntese por IA, prescrição assistida, pedidos de
exames e geração de PDF. Área inicial sugerida: Cardiologia. Modelo: MVP com validação médica
obrigatória. Objetivo: Reduzir o tempo gasto pelo médico no preenchimento de prescrições, receitas,
pedidos de exames e registros da consulta.

1. Visão Geral

O projeto consiste em uma plataforma web para médicos, inicialmente com foco em cardiologia,
capaz de registrar consultas, transcrever o áudio em tempo real ou após a consulta, gerar uma síntese
clínica estruturada e preencher automaticamente documentos como:

● prescrição médica;

● pedidos de exames;

● resumo da consulta;

● orientações ao paciente;

● evolução clínica;

● PDF para impressão ou envio.

A proposta resolve um problema operacional claro: consultas rápidas, mas com grande tempo gasto
após o atendimento para preencher receitas, exames e registros. A solução reduz retrabalho, evita
esquecimento de informações e melhora a organização do prontuário.

A IA deve ser tratada como assistente de preenchimento, e não como responsável final pela
prescrição. Ela grava, transcreve, organiza e sugere; o médico revisa, corrige, aprova, assina e imprime
ou gera PDF.

2. Objetivo do MVP

Criar uma primeira versão funcional onde o médico consiga:

cadastrar o paciente;

iniciar uma consulta;

gravar a conversa;

ter a transcrição processada por IA;

receber sugestões automáticas de resumo, exames, medicamentos e conduta;

revisar tudo manualmente;

gerar PDF ou imprimir os documentos.

1

2

3

4

5

6

7

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 3 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

A IA deve trabalhar sempre em modo rascunho assistido, com aprovação obrigatória do médico antes
de qualquer documento final.

3. Justificativa Técnica e Regulatória

O projeto envolve dados de saúde, que são dados sensíveis. Por isso, precisa nascer com segurança,
controle de acesso, auditoria, consentimento e boas práticas de LGPD.

A LGPD estabelece regras para tratamento de dados pessoais em meios físicos e digitais e garante
direitos como acesso, correção, eliminação quando aplicável e informação sobre compartilhamento dos
dados.

Também é importante considerar normas ligadas a prontuário eletrônico. A Resolução CFM nº
1.821/2007 trata da digitalização, guarda e manuseio de prontuários, menciona confidencialidade das
informações de saúde e requisitos de segurança para sistemas informatizados.

Para documentos médicos digitais, como receitas, atestados e relatórios, é recomendado prever
integração futura com assinatura digital ICP-Brasil e/ou plataformas oficiais de prescrição eletrônica.

4. Módulos Principais do Sistema

4.1. Cadastro de Médicos e Clínica

Funcionalidades:

● cadastro de médico;

● CRM, UF, especialidade e dados profissionais;

● cadastro de clínica ou consultório;

● controle de usuários da equipe;

● permissões por perfil;

● autenticação segura;

● opção futura de assinatura digital.

Perfis sugeridos:

● médico;

● secretária/assistente;

● administrador da clínica;

● administrador do sistema.

4.2. Cadastro de Pacientes

Funcionalidades:

● nome completo;

● CPF;

● data de nascimento;

● telefone;

● e-mail;

● endereço;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 4 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● convênio, se houver;

● histórico básico;

● alergias;

● medicamentos em uso;

● doenças prévias;

● observações clínicas;

● termo de consentimento para gravação e uso de IA.

Esse cadastro deve ser simples, porque a proposta é agilizar a consulta, não criar um prontuário
complexo logo no MVP.

4.3. Início da Consulta

O médico acessa o paciente e inicia uma nova consulta.

Fluxo sugerido:

selecionar paciente;

clicar em “Nova Consulta”;

escolher se vai gravar áudio;

iniciar gravação;

preencher campos rápidos, se quiser;

finalizar consulta;

IA processa a transcrição;

1

2

3

4

5

6

7

8 médico revisa os documentos sugeridos.

4.4. Gravação e Transcrição por Voz

Funcionalidades:

● gravação de áudio da consulta;

● pausa e retomada da gravação;

● upload de áudio, se necessário;

● transcrição automática;

● separação aproximada entre médico e paciente, se tecnicamente viável;

● processamento em tempo real ou após finalizar a consulta;

● armazenamento seguro do áudio e da transcrição.

A transcrição precisa ser orientada para vocabulário médico, especialmente cardiológico, com termos
como:

● ECG;

● ecocardiograma;

● Holter;

● MAPA;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 5 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● hipertensão;

● dislipidemia;

● insuficiência cardíaca;

● arritmia;

● dor torácica;

● síncope;

● angiotomografia;

● função renal;

● anticoagulantes;

● betabloqueadores;

● estatinas.

4.5. Síntese por IA

Após a transcrição, a IA gera uma síntese organizada da consulta.

Campos sugeridos:

● motivo da consulta;

● queixa principal;

● histórico da doença atual;

● antecedentes pessoais;

● medicamentos em uso;

● alergias;

● achados relevantes;

● exames mencionados;

● hipóteses diagnósticas;

● conduta;

● orientações ao paciente;

● sinais de alerta;

● retorno recomendado.

Exemplo de saída:

Paciente relata dor torácica aos esforços há 2 semanas, associada a cansaço. Nega síncope.
Histórico de hipertensão. Médico orientou realização de ECG, ecocardiograma e exames
laboratoriais. Prescrita adequação medicamentosa após avaliação.

4.6. Pedidos de Exames

O sistema deve ter um builder de exames cardiológicos.

Exames iniciais sugeridos:

● ECG;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 6 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● ecocardiograma;

● Holter 24h;

● MAPA;

● teste ergométrico;

● angiotomografia coronária;

● exames laboratoriais;

● perfil lipídico;

● glicemia;

● hemoglobina glicada;

● função renal;

● eletrólitos;

● TSH;

● troponina, se aplicável;

● raio-X de tórax;

● ressonância cardíaca, em fase futura.

A IA pode sugerir exames com base no que foi falado, mas o médico precisa confirmar manualmente.

4.7. Prescrição Inteligente

O sistema pode ter um catálogo inicial de medicamentos cardiovasculares.

Campos da prescrição:

● medicamento;

● dosagem;

● forma de uso;

● frequência;

● duração;

● quantidade;

● observações;

● alertas de interação;

● alerta de alergia;

● ajuste por função renal, quando aplicável.

Importante: a IA não deve decidir a prescrição sozinha. Ela deve apenas identificar o que foi falado na
consulta e montar um rascunho. O médico valida tudo antes de gerar o documento final.

4.8. Geração de PDF e Impressão

Documentos que o MVP pode gerar:

● receita simples;

● pedido de exames;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 7 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● resumo da consulta;

● orientações ao paciente;

● encaminhamento;

● relatório médico simples.

No MVP, o ideal é começar com:

● PDF para impressão;

● PDF com dados da clínica e do médico;

● histórico do documento gerado;

● opção futura de assinatura digital ICP-Brasil.

5. Segurança e LGPD

Esse é um dos pontos mais críticos do projeto.

5.1. Requisitos Obrigatórios

● login seguro;

● senha criptografada;

● autenticação em dois fatores, se possível;

● controle de acesso por perfil;

● criptografia em trânsito via HTTPS;

● criptografia de dados sensíveis no banco;

● criptografia de áudios armazenados;

● logs de acesso;

● logs de alteração;

● trilha de auditoria por consulta;

● consentimento do paciente para gravação;

● política de retenção dos áudios;

● possibilidade de excluir ou anonimizar dados quando aplicável;

● backup automático;

● segregação por clínica;

● isolamento de dados entre usuários;

● termos de uso;

● política de privacidade.

5.2. Pontos Sensíveis

● áudio da consulta;

● transcrição;

● dados pessoais do paciente;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 8 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● diagnóstico;

● prescrição;

● exames;

● histórico médico;

● documentos gerados.

6. Banco de Dados

6.1. Entidades Principais

Usuários

● id;

● nome;

● e-mail;

● senha criptografada;

● perfil;

● clínica vinculada;

● status;

● data de criação.

Médicos

● id;

● usuário_id;

● CRM;

● UF;

● especialidade;

● assinatura;

● dados profissionais.

Clínicas

● id;

● nome;

● CNPJ;

● endereço;

● telefone;

● logo;

● configurações.

Pacientes

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 9 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● id;

● clínica_id;

● nome;

● CPF;

● nascimento;

● telefone;

● e-mail;

● endereço;

● observações;

● alergias;

● medicamentos em uso.

Consultas

● id;

● paciente_id;

● médico_id;

● data;

● status;

● motivo;

● resumo;

● conduta;

● retorno;

● observações.

Gravações

● id;

● consulta_id;

● arquivo_audio;

● duração;

● status_processamento;

● data_upload;

● hash do arquivo.

Transcrições

● id;

● consulta_id;

● texto_transcrito;

● modelo_utilizado;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 10 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● data_processamento;

● confiança estimada.

Documentos

● id;

● consulta_id;

● tipo;

● conteúdo;

● PDF gerado;

● status;

● data de geração;

● aprovado_por.

Prescrições

● id;

● consulta_id;

● medicamento;

● dosagem;

● frequência;

● duração;

● observação;

● aprovado_pelo_médico.

Exames Solicitados

● id;

● consulta_id;

● exame;

● justificativa;

● observação;

● aprovado_pelo_médico.

Logs de Auditoria

● id;

● usuário_id;

● ação;

● entidade;

● data;

● IP;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 11 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● detalhes.

Consentimentos

● id;

● paciente_id;

● tipo;

● versão do termo;

● aceito_em;

● forma de aceite.

7. Arquitetura Sugerida

7.1. Frontend

● Next.js ou React;

● interface responsiva;

● painel médico;

● tela de consulta;

● editor de documentos;

● gerador de PDF;

● dashboard simples.

7.2. Backend

● FastAPI, NestJS ou .NET;

● API REST;

● autenticação JWT;

● controle de permissões;

● integração com IA;

● processamento assíncrono de áudio;

● geração de documentos.

7.3. Banco de Dados

● PostgreSQL;

● armazenamento criptografado;

● backups automáticos;

● separação por clínica;

● logs de auditoria.

7.4. Armazenamento de Arquivos

● bucket privado para áudios e PDFs;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 12 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● acesso temporário por URL assinada;

● criptografia;

● política de retenção.

7.5. IA

Pipeline sugerido:

áudio da consulta;

transcrição automática;

limpeza e estruturação do texto;

extração de informações clínicas;

geração de rascunhos;

validação pelo médico;

geração de PDF.

1

2

3

4

5

6

7

8. Funcionalidades do MVP

8.1. MVP Obrigatório

● login médico;

● cadastro de paciente;

● nova consulta;

● gravação de áudio;

● transcrição por IA;

● resumo automático;

● formulário manual de apoio;

● geração de pedido de exames;

● geração de prescrição em rascunho;

● revisão obrigatória pelo médico;

● geração de PDF;

● histórico de consultas;

● logs básicos;

● backup;

● controle de acesso.

8.2. MVP Desejável

● catálogo inicial de exames cardiológicos;

● catálogo inicial de medicamentos cardiovasculares;

● alertas básicos de interação;

● termos de consentimento;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 13 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● impressão direta;

● envio por WhatsApp ou e-mail;

● dashboard com consultas recentes.

9. Funcionalidades Futuras

● assinatura digital ICP-Brasil;

● integração com plataforma de prescrição eletrônica;

● prontuário eletrônico completo;

● integração com laboratório;

● integração com convênio;

● agendamento de consultas;

● telemedicina;

● aplicativo para paciente;

● lembretes de retorno;

● histórico longitudinal cardiovascular;

● gráficos de evolução;

● integração com wearable;

● OCR de exames enviados pelo paciente;

● chatbot para pré-consulta;

● assistente de follow-up pós-consulta.

10. Fluxo Ideal da Consulta

1 Médico abre o sistema.

2

3

4

5

6

7

8

Seleciona ou cadastra o paciente.

Inicia nova consulta.

Ativa gravação.

Realiza atendimento normalmente.

Sistema transcreve o áudio.

IA gera resumo clínico.

IA sugere exames e prescrição com base no que foi falado.

9 Médico revisa tudo.

10 Médico aprova ou edita.

11 Sistema gera PDF.

12 Médico imprime ou envia ao paciente.

13 Consulta fica salva no histórico.

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 14 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

11. Cuidados Importantes

11.1. A IA Não Deve

● emitir diagnóstico final sozinha;

● prescrever sem validação médica;

● enviar receita automaticamente;

● substituir o médico;

● esconder do médico o que foi extraído da conversa;

● apagar áudio ou transcrição sem regra definida;

● compartilhar dados com terceiros sem base legal/contrato.

11.2. A IA Deve

● ajudar no preenchimento;

● resumir a consulta;

● sugerir com base no que foi dito;

● destacar incertezas;

● mostrar origem da informação;

● exigir validação médica;

● registrar alterações feitas pelo médico.

12. Riscos do Projeto

Risco 1: Erro de Transcrição

Mitigação:

● revisão visual pelo médico;

● destaque de trechos com baixa confiança;

● possibilidade de ouvir o áudio original.

Risco 2: IA Inventar Informações

Mitigação:

● prompt restritivo;

● IA só pode usar dados da consulta;

● campos “não informado” quando não houver evidência;

● validação obrigatória pelo médico.

Risco 3: Vazamento de Dados

Mitigação:

● criptografia;

● logs;

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 15 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

● controle de acesso;

● contratos com fornecedores;

● hospedagem adequada;

● política LGPD.

Risco 4: Uso Indevido para Prescrição Automática

Mitigação:

● documentos sempre em rascunho;

● botão de aprovação médica;

● registro de auditoria;

● bloqueio de envio automático sem aprovação.

13. Critérios de Aceite do MVP

O projeto pode ser considerado funcional quando:

● o médico conseguir cadastrar paciente;

● iniciar consulta;

● gravar áudio;

● gerar transcrição;

● receber resumo estruturado;

● gerar rascunho de prescrição;

● gerar rascunho de exames;

● editar manualmente;

● aprovar documentos;

● gerar PDF;

● visualizar histórico da consulta;

● acessar dados com segurança;

● registrar logs básicos de uso.

14. Conclusão Técnica

O projeto é viável e tem uma dor real: médicos gastam tempo significativo preenchendo documentos
após consultas. A solução proposta reduz esse tempo usando IA para transcrição, síntese e
preenchimento assistido.

A melhor abordagem é começar com um MVP controlado, focado em cardiologia, com poucos
médicos testando, catálogo limitado de exames e medicamentos, geração de PDFs e validação
obrigatória pelo profissional.

A frase-chave do projeto é:

A IA não substitui o médico. Ela organiza a consulta, preenche rascunhos e acelera a documentação,
mantendo a decisão final com o profissional responsável.

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 16 de 17

Arcane Tecnologia

Escopo Técnico — Plataforma de Consulta Médica com IA

Arcane Tecnologia
Engenharia de Software & Soluções Inteligentes
Rui Diniz — Engenheiro de Sistemas
Contato: (12) 99133-2258

Arcane Tecnologia — Engenharia de Software & Soluções Inteligentes

Página 17 de 17

