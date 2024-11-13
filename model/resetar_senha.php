<?php
session_start();

// Configuração do banco de dados
$host = 'localhost';
$dbname = 'usuario_db';
$user = 'root';
$password = 'nova_senha';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
} catch (PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}

// Obtém o token da URL
$token = $_GET['token'];

// Verifica se o token é válido e não expirou
$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE reset_token = :token AND token_expiration > NOW()");
$stmt->execute(['token' => $token]);
$user = $stmt->fetch();

// HTML e CSS do formulário de redefinição de senha
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
            border-radius: 10px;
        }

        body {
            background-image: url("https://i.pinimg.com/564x/0f/06/bd/0f06bd22d80628ee77d4bc7ea3d723b7.jpg");
            backdrop-filter: blur(10px);
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            background-color: rgb(255, 255, 255);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(197, 194, 194, 0.459);
            width: 400px;
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
        }

        div {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 600;
        }

        input[type="password"] {
            padding: 14px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 10px;
            outline: none;
            transition: border-color 0.4s, box-shadow 0.4s;
            font-size: 16px;
        }

        input[type="password"]:focus {
            border-color: #888;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        }

        button {
            background-color: #444;
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
        }

        button:hover {
            background-color: #e74c3c;
            transform: translateY(-3px);
        }

        a {
            text-decoration: none;
            color: #444;
            margin-top: 20px;
            font-size: 14px;
            display: block;
            text-decoration: none;
            transition: color 0.3s;
        }

        a:hover {
            color: #cb1212;
        }

    </style>
</head>
<body>
    <div class="container">
        <?php if ($user): ?>
            <?php
            // Processa o formulário quando enviado
            if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                // Define a nova senha
                $new_password = password_hash($_POST['new_password'], PASSWORD_BCRYPT);

                // Atualiza a senha no banco de dados e remove o token
                $stmt = $pdo->prepare("UPDATE usuarios SET senha = :senha, reset_token = NULL, token_expiration = NULL WHERE reset_token = :token");
                $stmt->execute(['senha' => $new_password, 'token' => $token]);

                echo "<p>Senha redefinida com sucesso. <a href='Login.html'>Clique aqui para fazer login.</a></p>";
            } else {
                // Exibe o formulário para definir a nova senha
                ?>
                <form method="post">
                    <h2>Redefinir Senha</h2>
                    <div>
                        <label for="new_password">Nova Senha:</label>
                        <input type="password" id="new_password" name="new_password" required>
                    </div>
                    <div>
                        <button type="submit">Redefinir Senha</button>
                        <a href="Login.html">Cancelar</a>
                    </div>
                </form>
            <?php } ?>
        <?php else: ?>
            <p>Link de redefinição inválido ou expirado.</p>
        <?php endif; ?>
    </div>
</body>
</html>
