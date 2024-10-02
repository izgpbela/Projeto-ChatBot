create database usuario_db;

use usuario_db;

create table usuarios (
    id_usuario int auto_increment not null,
    email varchar(45) not null,
    username varchar(45) unique not null,
    password int not null,
    primary key (id_usuario)
)
engine=innodb;