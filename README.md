# Projeto HEALTH HUB - CHATBOT

## Integrantes do Grupo
| Nome              |
| ----------------- |
| Guilherme Silva   |
| Yara Rosa         |
| Lucas Ferrari     |
| Yasmin Alves      |
| Izabela Gomes     |

## Descrição
Criamos um chat bot de WhatsApp para fazer marcação de consultas, através do banco de dados do login, para localizar qual é o paciente, em qual clínica vamos marcar, e após marcar aparecer o dia e a hora que o paciente está marcado.

O sistema é dividido em duas partes:
1. **Auxiliar ou Profissional da Saúde**: Responsável pelas marcações e gestão das agendas.
2. **Profissional da Saúde**: Pode fazer a evolução do prontuário do que foi realizado na consulta/exame.

## Objetivo
O objetivo do sistema é facilitar o dia-a-dia de uma clínica na questão de marcação/gestão de agendas e evolução de prontuário, sendo um sistema completo, evitando a dependência de outros aplicativos e sistemas, filas e desgastes desnecessários, tanto por parte do cliente quanto para o profissional da saúde em questão.


### Principais Classes e Interfaces
- **dp_connection.php**: Conexão com o banco de dados.
- **login.php**: Lógica de autenticação de usuários.

## Uso

1. Configure o banco de dados utilizando o script `Script.sql`.
2. Configure a conexão com o banco de dados no arquivo `dp_connection.php`.
3. Abra o arquivo `index.html` no seu navegador para acessar a interface principal.
4. Utilize as páginas de login (`Login.html`) e registro (`register.php`) para gerenciar usuários.

### Exemplo de Código

```bash 
// Exemplo de conexão com o banco de dados
include 'dp_connection.php';

$conn = OpenCon();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

CloseCon($conn);


# Chat

Um chatbot simples construído com Node.js que utiliza a biblioteca `whatsapp-web.js` para interagir com o WhatsApp.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **Dependências**:
  - `qrcode-terminal`: Para gerar códigos QR no terminal.
  - `whatsapp-web.js`: Biblioteca para interagir com a API do WhatsApp Web.
  - `mysql2`: Para fazer a conexão e alterações no banco de dados.
  - **MySQL**: Banco de dados.

## Pré-requisitos

Antes de começar, você precisará ter o Node.js instalado em sua máquina. Você pode baixar a versão mais recente do Node.js (Para funcionar precisa ser da versão 18 pra frente.) [aqui](https://nodejs.org/).

## Instalação

1. **Clone o repositório**:"
   ```bash
   git clone https://github.com/seu-usuario/chat.git
   cd chat

2. Instale Dependencias  

npm install whatsapp-web.js

npm install qrcode-terminal

npm install mysql2

## Configuração

3. Configure seu chat 
Abra o arquivo main.js e faça as configurações necessárias conforme a sua necessidade.

## Execução

4.Para executar:
Digite:node main.js

Você verá um código QR no terminal. Escaneie este código com o aplicativo WhatsApp no seu celular.

Uma vez que a conexão for estabelecida, seu chatbot estará pronto para ser utilizado!

## Guia

Guia de como funciona
message.body: são as mensagens do usuário que o chat irá ler para executar a mensagem que ele irá enviar.
message.from: são as mensagens que o chat envia apos ler a mensagem enviada do usuário.