-- ============================================
-- SEED - MEDICAMENTOS CARDIOVASCULARES
-- ============================================

USE cardiopront;

INSERT INTO medicamentos_catalogo (classe, principio_ativo, nome_comercial, apresentacao, dose_padrao, dose_maxima, unidade, via, ajuste_renal) VALUES
-- Anti-hipertensivos
('IECA', 'Enalapril', 'Renitec', '5mg - 30 cp', '5', '40', 'mg', 'oral', TRUE),
('IECA', 'Captopril', 'Capoten', '25mg - 30 cp', '25', '150', 'mg', 'oral', TRUE),
('IECA', 'Ramipril', 'Triatec', '5mg - 30 cp', '5', '10', 'mg', 'oral', TRUE),
('BRA', 'Losartana', 'Cozaar', '50mg - 30 cp', '50', '100', 'mg', 'oral', FALSE),
('BRA', 'Valsartana', 'Diovan', '160mg - 30 cp', '160', '320', 'mg', 'oral', FALSE),
('BRA', 'Olmesartana', 'Olmetec', '20mg - 30 cp', '20', '40', 'mg', 'oral', FALSE),
('Bloqueador de Canais', 'Anlodipino', 'Norvasc', '5mg - 30 cp', '5', '10', 'mg', 'oral', FALSE),
('Bloqueador de Canais', 'Nifedipino', 'Adalat retard', '30mg - 30 cp', '30', '60', 'mg', 'oral', FALSE),
('Diurético', 'Hidroclorotiazida', 'HCTZ', '25mg - 30 cp', '25', '50', 'mg', 'oral', TRUE),
('Diurético', 'Furosemida', 'Lasix', '40mg - 30 cp', '40', '240', 'mg', 'oral', TRUE),
('Diurético', 'Espironolactona', 'Aldactone', '25mg - 30 cp', '25', '100', 'mg', 'oral', TRUE),
('Beta-bloqueador', 'Carvedilol', 'Coreg', '6.25mg - 30 cp', '6.25', '50', 'mg', 'oral', FALSE),
('Beta-bloqueador', 'Metoprolol', 'Seloken ZOK', '50mg - 30 cp', '50', '200', 'mg', 'oral', TRUE),
('Beta-bloqueador', 'Bisoprolol', 'Concor', '5mg - 30 cp', '5', '10', 'mg', 'oral', TRUE),
('Beta-bloqueador', 'Atenolol', 'Tenormin', '50mg - 30 cp', '50', '100', 'mg', 'oral', TRUE),
-- Anticoagulantes
('Anticoagulante', 'Varfarina', 'Marevan', '5mg - 30 cp', '5', '15', 'mg', 'oral', FALSE),
('Anticoagulante', 'Rivaroxabana', 'Xarelto', '20mg - 30 cp', '20', '20', 'mg', 'oral', TRUE),
('Anticoagulante', 'Apixabana', 'Eliquis', '5mg - 60 cp', '5', '10', 'mg', 'oral', TRUE),
('Anticoagulante', 'Dabigatrana', 'Pradaxa', '150mg - 60 cp', '150', '150', 'mg', 'oral', TRUE),
('Antiagregante', 'Aspirina', 'AAS Protect', '100mg - 30 cp', '100', '300', 'mg', 'oral', FALSE),
('Antiagregante', 'Clopidogrel', 'Plavix', '75mg - 30 cp', '75', '75', 'mg', 'oral', FALSE),
-- Antiarrítmicos
('Antiarrítmico', 'Amiodarona', 'Atlansil', '200mg - 30 cp', '200', '400', 'mg', 'oral', FALSE),
('Antiarrítmico', 'Propafenona', 'Rytmonorm', '150mg - 30 cp', '150', '300', 'mg', 'oral', FALSE),
-- Estatinas
('Estatina', 'Atorvastatina', 'Lipitor', '40mg - 30 cp', '40', '80', 'mg', 'oral', FALSE),
('Estatina', 'Rosuvastatina', 'Crestor', '20mg - 30 cp', '20', '40', 'mg', 'oral', TRUE),
('Estatina', 'Sinvastatina', 'Zocor', '40mg - 30 cp', '40', '40', 'mg', 'oral', FALSE),
-- Insuficiência Cardíaca
('IECA/Sacubitril-Valsartana', 'Sacubitril/Valsartana', 'Entresto', '100mg - 60 cp', '100', '200', 'mg', 'oral', TRUE),
('Antagonista Aldosterona', 'Eplerenona', 'Inspra', '25mg - 30 cp', '25', '50', 'mg', 'oral', TRUE),
('SGLT2-i', 'Dapagliflozina', 'Forxiga', '10mg - 30 cp', '10', '10', 'mg', 'oral', FALSE),
('SGLT2-i', 'Empagliflozina', 'Jardiance', '10mg - 30 cp', '10', '25', 'mg', 'oral', FALSE),
('Glicosídeo', 'Digoxina', 'Lanoxin', '0.25mg - 30 cp', '0.25', '0.25', 'mg', 'oral', TRUE),
('Vasodilatador', 'Isossorbida', 'Isordil', '5mg - 30 cp SL', '5', '20', 'mg', 'oral', FALSE),
('Nitrato', 'Nitroglicerina', 'Nitrostat', '0.6mg SL', '0.6', '1.8', 'mg', 'oral', FALSE);
