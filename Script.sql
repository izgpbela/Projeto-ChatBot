CREATE DATABASE usuario_db;

USE usuario_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);



select id, email, username, senha
from usuarios;