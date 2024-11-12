<?php
session_start();
include 'db_connection.php'; // Inclui o arquivo de conexão ao banco

// Carregar o autoload do Composer (necessário para usar PHPMailer)
require 'vendor/autoload.php'; // Certifique-se de que o caminho está correto para o autoload

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (!$conn) {
    die("Erro ao incluir db_connection.php");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // Verifica se o email existe no banco de dados
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Gera um token e define o tempo de expiração para 5 minutos
        $token = bin2hex(random_bytes(16));
        $expires = date("Y-m-d H:i:s", strtotime('+5 minutes'));

        // Salva o token e o tempo de expiração no banco de dados
        $stmt = $conn->prepare("UPDATE usuarios SET reset_token = ?, token_expiration = ? WHERE email = ?");
        $stmt->bind_param("sss", $token, $expires, $email);
        $stmt->execute();

        // Link para redefinição de senha
        $resetLink = "http://localhost:9000/resetar_senha.php?token=$token";

        // Usando PHPMailer para enviar o e-mail
        $mail = new PHPMailer(true);
        try {
            //Desabilita a verificação SSL no PHPMailer mas isso é só para teste
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
             
            // Configurações do SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'healthhubyagil@gmail.com';  // Substitua com seu e-mail
            $mail->Password = 'bwds iylt nsaz nwys';  // Substitua com sua senha de app
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Defina o remetente e o destinatário
            $mail->setFrom('no-reply@seusite.com', 'No Reply');
            $mail->addAddress($email);

            // Defina o conteúdo do e-mail
            $mail->isHTML(true);
            $mail->Subject = 'Redefinir sua senha';
            $mail->Body    = 'Clique no link para redefinir sua senha: ' . $resetLink . '<br>Esse link é válido por apenas 5 minutos.';

            // Enviar o e-mail
            $mail->send();
            echo 'Verifique seu e-mail para redefinir a senha.';
        } catch (Exception $e) {
            echo "Erro ao enviar e-mail: {$mail->ErrorInfo}";
        }

    } else {
        echo "Email não encontrado.";
    }

    $stmt->close();
    $conn->close();
}
?>