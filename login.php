<?php
include 'db.php'; // Inclui o arquivo de conexão

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recebe os dados do formulário
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepara e executa a consulta SQL
    $sql = "SELECT password FROM usuarios WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    // Verifica se o usuário existe
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashed_password);
        $stmt->fetch();

        // Verifica a senha
        if (password_verify($password, $hashed_password)) {
            echo "Login bem-sucedido!";
            // Aqui você pode iniciar uma sessão ou redirecionar o usuário
        } else {
            echo "Senha incorreta!";
        }
    } else {
        echo "Usuário não encontrado!";
    }

    $stmt->close();
}

$conn->close();
?>