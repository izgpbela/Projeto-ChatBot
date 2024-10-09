<?php
include 'db_connection.php'; // inclui o arquivo de conexão

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Aqui você deve fazer a consulta ao banco de dados para verificar o login
    $sql = "SELECT * FROM usuarios WHERE username = ? AND senha = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Login bem-sucedido
        echo "Login bem-sucedido!";
    } else {
        // Login falhou
        echo "Usuário ou senha incorretos.";
    }

    $stmt->close();
}
$conn->close();
?>