<?php
session_start();
include 'db_connection.php'; // Inclui o arquivo de conexão

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Consulta ao banco de dados para verificar o login
    $sql = "SELECT * FROM usuarios WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Usuário encontrado
        $user = $result->fetch_assoc();

        // Verifica se a senha fornecida corresponde à senha criptografada no banco de dados
        if (password_verify($password, $user['senha'])) {
            // Login bem-sucedido, redireciona para a página inicial
            $_SESSION['user_id'] = $user['id']; // Armazena o ID do usuário na sessão
            $_SESSION['username'] = $user['username']; // Armazena o nome de usuário na sessão
            header("Location: Pagina_Inicial.html");
            exit();
        } else {
            // Senha incorreta
            echo "Usuário ou senha incorretos.";
        }
    } else {
        // Usuário não encontrado
        echo "Usuário não encontrado.";
    }

    $stmt->close();
}
$conn->close();
?>
