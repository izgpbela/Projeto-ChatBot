<?php
$servername = "localhost"; // Altere se necessário
$username = "root"; // Altere se necessário
$password = ""; // Altere se necessário
$dbname = "usuario_db";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>