-- ============================================
-- SEED - CATÁLOGO DE EXAMES CARDIOVASCULARES
-- ============================================

USE cardiopront;

INSERT INTO tipos_exame (categoria, nome, descricao, codigo_tus) VALUES
('cardiovascular', 'Eletrocardiograma (ECG) de 12 derivações', 'Avaliação da atividade elétrica do coração em repouso', '0203010041'),
('cardiovascular', 'Ecocardiograma Transtorácico (ETT)', 'Ultrassom do coração com avaliação de FE, valvas, câmaras', '0203010092'),
('cardiovascular', 'Ecocardiograma Transesofágico (ETE)', 'Ultrassom com sonda esofágica para detalhes de valvas e trombos', '0203010106'),
('cardiovascular', 'Teste Ergométrico (Teste de Esforço)', 'Avaliação de isquemia miocárdica e capacidade funcional', '0203010050'),
('cardiovascular', 'Holter 24h', 'Monitorização contínua do ECG por 24 horas', '0203010068'),
('cardiovascular', 'MAPA (Monitorização Ambulatorial da PA)', 'Medição automática da pressão arterial por 24h', '0203010076'),
('cardiovascular', 'Angiotomografia de Coronárias (AngioTC)', 'Avaliação não invasiva das artérias coronárias', '0203010149'),
('cardiovascular', 'Ressonância Cardíaca', 'Avaliação detalhada de estrutura e função miocárdica', '0203010165'),
('cardiovascular', 'Cintilografia Miocárdica', 'Avaliação de perfusão miocárdica em repouso e estresse', '0203010130'),
('cardiovascular', 'Cateterismo Cardíaco', 'Avaliação invasiva de doença coronariana', '0204010034'),
('cardiovascular', 'Estudo Eletrofisiológico', 'Avaliação de arritmias cardíacas', '0204010042'),
('cardiovascular', 'Angiografia Coronária', 'Imagem invasiva das coronárias com contraste', '0204010026'),
('laboratorial', 'Peptídeo Natriurético Tipo B (BNP/NT-proBNP)', 'Marcador de insuficiência cardíaca', '0202010833'),
('laboratorial', 'Troponina I / T (Ultrasensível)', 'Marcador de lesão miocárdica / IAM', '0202010420'),
('laboratorial', 'Perfil Lipídico Completo', 'CT, HDL, LDL, TG, ApoB, Lp(a)', '0202010780'),
('laboratorial', 'Hemoglobina Glicada (HbA1c)', 'Controle glicêmico / diabetes', '0202010463'),
('laboratorial', 'Creatinina + TFG', 'Função renal (relevante para cardiologia)', '0202010369'),
('laboratorial', 'Eletrólitos (Na, K, Mg, Ca)', 'Distúrbios eletrolíticos e arritmias', '0202010288'),
('laboratorial', 'TSH / T4 Livre', 'Função tireoidiana (arritmias, IC)', '0202010601'),
('laboratorial', 'Dímero D', 'Trombose / embolia pulmonar', '0202010850'),
('laboratorial', 'PCR / VHS', 'Inflamação sistêmica / miocardite', '0202010720'),
('imagem', 'Radiografia de Tórax', 'Avaliação de silhueta cardíaca e campos pulmonares', '0203010017'),
('imagem', 'AngioTC de Aorta', 'Avaliação de dissecção, aneurisma, coarctação', '0203010157'),
('imagem', 'PET Scan Miocárdico', 'Viabilidade miocárdica', '0203010173');
