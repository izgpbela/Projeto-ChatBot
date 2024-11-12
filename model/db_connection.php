<?php
$servername = "localhost"; // ou o IP do seu servidor
$username = "root"; // substitua pelo seu nome de usuário
$password = "lucas2010"; // senha do banco de dados
$dbname = "usuario_db"; // nome do banco de dados
$port = "3307"; // porta do banco de dados

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>