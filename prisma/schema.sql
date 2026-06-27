-- ============================================
-- SCHEMA CARDIOPRONT - MySQL 8
-- ============================================

CREATE DATABASE IF NOT EXISTS cardiopront CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cardiopront;

-- MÉDICOS (usuários)
CREATE TABLE medicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  crm VARCHAR(20) NOT NULL,
  crm_uf VARCHAR(2) NOT NULL,
  especialidade VARCHAR(100) DEFAULT 'Cardiologia',
  telefone VARCHAR(20),
  plano ENUM('trial','essencial','profissional','clinica') DEFAULT 'trial',
  trial_fim DATE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PACIENTES
CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medico_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  nascimento DATE NOT NULL,
  sexo ENUM('M','F','O'),
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(150),
  tipo_sanguineo ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
  peso_kg DECIMAL(5,1),
  altura_cm DECIMAL(5,1),
  alergias TEXT,
  FOREIGN KEY (medico_id) REFERENCES medicos(id)
);

-- COMORBIDADES
CREATE TABLE comorbidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  condicao VARCHAR(200) NOT NULL,
  codigo_ciap2 VARCHAR(10),
  data_diagnostico DATE,
  observacoes TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- MEDICAMENTOS EM USO
CREATE TABLE medicamentos_ativos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  medicamento VARCHAR(200) NOT NULL,
  dose VARCHAR(50),
  frequencia VARCHAR(100),
  data_inicio DATE,
  data_fim DATE,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- CONSULTAS
CREATE TABLE consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  medico_id INT NOT NULL,
  data_consulta DATETIME NOT NULL,
  tipo ENUM('presencial','tele','retorno') DEFAULT 'presencial',
  motivo_consulta TEXT,
  queixa_principal TEXT,
  historia_doenca_atual TEXT,
  historia_familiar_cardiovascular TEXT,
  pa_sistolica INT,
  pa_diastolica INT,
  fc INT,
  fr INT,
  temp_celsius DECIMAL(4,1),
  saturacao_o2 INT,
  peso_kg DECIMAL(5,1),
  altura_cm DECIMAL(5,1),
  imc DECIMAL(4,1),
  exame_fisico_geral TEXT,
  diagnostico TEXT,
  cid10 VARCHAR(10),
  conduta TEXT,
  orientacoes TEXT,
  audio_url VARCHAR(500),
  transcricao_completa TEXT,
  sintese_ia TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
  FOREIGN KEY (medico_id) REFERENCES medicos(id)
);

-- TIPOS DE EXAME
CREATE TABLE tipos_exame (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria ENUM('laboratorial','cardiovascular','imagem','outros') NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao VARCHAR(500),
  codigo_tus VARCHAR(10),
  ativo BOOLEAN DEFAULT TRUE
);

-- EXAMES PEDIDOS
CREATE TABLE exames (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consulta_id INT NOT NULL,
  paciente_id INT NOT NULL,
  tipo_exame_id INT NOT NULL,
  prioridade ENUM('rotina','urgente','eletiva') DEFAULT 'rotina',
  indicacao_clinica TEXT,
  data_pedido DATE NOT NULL,
  data_resultado DATE,
  resultado_texto TEXT,
  resultado_valores JSON,
  status ENUM('pendente','resultado_enviado','lido') DEFAULT 'pendente',
  FOREIGN KEY (consulta_id) REFERENCES consultas(id),
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
  FOREIGN KEY (tipo_exame_id) REFERENCES tipos_exame(id)
);

-- PRESCRIÇÕES
CREATE TABLE prescricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consulta_id INT NOT NULL,
  paciente_id INT NOT NULL,
  data_prescricao DATE NOT NULL,
  validade_dias INT DEFAULT 30,
  medicamento VARCHAR(200) NOT NULL,
  principio_ativo VARCHAR(200),
  dose VARCHAR(50),
  unidade VARCHAR(20),
  frequencia VARCHAR(100),
  posologia TEXT,
  via ENUM('oral','ev','im','sc','topica','inalatoria'),
  advertencias TEXT,
  FOREIGN KEY (consulta_id) REFERENCES consultas(id),
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- SCORES CARDIOVASCULARES
CREATE TABLE scores_cardiovasculares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consulta_id INT NOT NULL,
  paciente_id INT NOT NULL,
  tipo_score ENUM('CHA2DS2-VASc','HAS-BLED','Framingham','Killip','NYHA','EuroSCORE2') NOT NULL,
  valor DECIMAL(5,2),
  risco ENUM('baixo','moderado','alto','muito_alto'),
  calculado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consulta_id) REFERENCES consultas(id),
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- MEDICAMENTOS CATÁLOGO
CREATE TABLE medicamentos_catalogo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classe VARCHAR(100) NOT NULL,
  principio_ativo VARCHAR(200) NOT NULL,
  nome_comercial VARCHAR(200),
  apresentacao VARCHAR(100),
  dose_padrao VARCHAR(50),
  dose_maxima DECIMAL(8,2),
  unidade VARCHAR(20),
  via ENUM('oral','ev','im','sc','topica','inalatoria'),
  ajuste_renal BOOLEAN DEFAULT FALSE,
  ajuste_hepatico BOOLEAN DEFAULT FALSE,
  principais_interacoes TEXT,
  contraindicacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE
);
