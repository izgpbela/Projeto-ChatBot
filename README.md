# Projeto de Chat Bot

## Integrantes do Grupo
| Nome              |
| ----------------- |
| Guilherme Silva   |
| Yara Rosa         |
| Lucas Ferrari     |
| Yasmin Alves      |
| Izabela Gomes     |

## Descrição do Projeto
Criamos um chat bot de WhatsApp para fazer marcação de consultas, através do banco de dados do login, para localizar qual é o paciente, em qual clínica vamos marcar, e após marcar aparecer o dia e a hora que o paciente está marcado.

O sistema é dividido em duas partes:
1. **Auxiliar ou Profissional da Saúde**: Responsável pelas marcações e gestão das agendas.
2. **Profissional da Saúde**: Pode fazer a evolução do prontuário do que foi realizado na consulta/exame.

## Objetivo
O objetivo do sistema é facilitar o dia-a-dia de uma clínica na questão de marcação/gestão de agendas e evolução de prontuário, sendo um sistema completo, evitando a dependência de outros aplicativos e sistemas, filas e desgastes desnecessários, tanto por parte do cliente quanto para o profissional da saúde em questão.

## Estrutura do Projeto

Projeto-ChatBot/ ├── controllers/ │ └── userController.js ├── models/ │ └── userModel.js ├── views/ │ ├── esqueceu_senha.html │ └── login.html ├── public/ │ ├── css/ │ │ └── styles.css │ ├── js/ │ │ └── scripts.js ├── routes/ │ └── userRoutes.js ├── README.md └── app.js


### Principais Classes e Interfaces
- **dp_connection.php**: Conexão com o banco de dados.
- **login.php**: Lógica de autenticação de usuários.

## Configuração do Projeto

1. Configure o banco de dados utilizando o script `Script.sql`.
2. Configure a conexão com o banco de dados no arquivo `dp_connection.php`.
3. Abra o arquivo `index.html` no seu navegador para acessar a interface principal.
4. Utilize as páginas de login (`Login.html`) e registro (`register.php`) para gerenciar usuários.

### Exemplo de Código

```php
// Exemplo de conexão com o banco de dados
include 'dp_connection.php';

$conn = OpenCon();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

CloseCon($conn);


