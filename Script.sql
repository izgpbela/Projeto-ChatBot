CREATE DATABASE usuario_db;
USE usuario_db;

CREATE TABLE usuarios (
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    primary key(username)
);


CREATE TABLE profissionais (
    nome VARCHAR(255) NOT NULL,
    especialidade VARCHAR(255) NOT NULL,
    primary key(nome)
);



#Aqui armazenaremos os horários e dias disponíveis dos profissionais. Cada linha na tabela representará um horário específico que um profissional tem disponível.
CREATE TABLE agenda_profissional (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Identificador único para cada horário
    profissional_id VARCHAR(255) NOT NULL,  -- Relacionamento com o profissional
    dia DATE NOT NULL,  -- Data disponível
    horario TIME NOT NULL,  -- Horário disponível
    FOREIGN KEY (profissional_id) REFERENCES profissionais(nome)
);


#Esta tabela armazenará o relacionamento entre o usuário e o profissional, ou seja, quem agendou consulta com quem e quando.
CREATE TABLE consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id VARCHAR(255) NOT NULL,  -- Relacionamento com o usuário
    profissional_id VARCHAR(255) NOT NULL,  -- Relacionamento com o profissional
    data_consulta DATETIME NOT NULL,  -- Data e hora da consulta
    FOREIGN KEY (usuario_id) REFERENCES usuarios(username),
    FOREIGN KEY (profissional_id) REFERENCES profissionais(nome)
);




#------------------------------------------------------------------------------------------------------------------------------------------------------------#


#Tabela profissionais: Armazena os dados principais dos profissionais.
#Tabela agenda_profissional: Armazena os horários e dias que cada profissional está disponível para atender.
#Tabela consultas: Registra as consultas agendadas entre os usuários e os profissionais, com a data e hora exata da consulta.

#------------------------------------------------------------------------------------------------------------------------------------------------------------#

# CONSULTAR DIAS LIVRES DE UM PROFISSIONAL:
# Retorna todos os dias e horários disponíveis para o profissional com nome especificado.

SELECT a.id, a.dia, a.horario
FROM agenda_profissional a
JOIN profissionais p ON a.profissional_id = p.nome
WHERE p.nome = 'NOME_DO_PROFISSIONAL';  -- Substitua 'NOME_DO_PROFISSIONAL' pelo nome do profissional desejado

#------------------------------------------------------------------------------------------------------------------------------------------------------------#

# CONSULTAR CONSULTAS AGENDADAS:
# Mostra as consultas agendadas pelo usuário, com o nome do profissional e a data/hora da consulta.

SELECT c.id, u.username, p.nome AS profissional, c.data_consulta
FROM consultas c
JOIN usuarios u ON u.username = c.usuario_id
JOIN profissionais p ON p.nome = c.profissional_id
WHERE u.username = 'NOME_DO_USUARIO';  -- Substitua 'NOME_DO_USUARIO' pelo username do usuário desejado

#------------------------------------------------------------------------------------------------------------------------------------------------------------#

# EXIBIR TODOS OS HORÁRIOS DE TODOS OS PROFISSIONAIS:
# Mostra todos os dias e horários disponíveis de todos os profissionais.

SELECT p.nome AS profissional, a.dia, a.horario
FROM agenda_profissional a
JOIN profissionais p ON a.profissional_id = p.nome
ORDER BY p.nome, a.dia, a.horario;

#------------------------------------------------------------------------------------------------------------------------------------------------------------#

# MOSTRAR USUÁRIOS CADASTRADOS:
# Exibe todos os usuários cadastrados no sistema.

SELECT username, email, senha
FROM usuarios;

#------------------------------------------------------------------------------------------------------------------------------------------------------------#

# CONSULTA PARA EXIBIR TODOS OS PROFISSIONAIS CADASTRADOS:
# Lista todos os profissionais e suas especialidades.

SELECT nome, especialidade
FROM profissionais;