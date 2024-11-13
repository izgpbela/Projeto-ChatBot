const mysql = require('mysql2');
const conection = mysql.createConnection({
    host:'localhost', //host
    user:'root', //seu_usuário
    password:'', //sua_senha
    database:'usuario_db' //seu_banco_de_dados
})

conection.connect( function(err){
    console.log("Conexão com o banco de dados realizada com sucesso!!");
});

conection.query("SELECT email FROM usuarios", function(err, rows, fields){
    if(!err){
        console.log("Resultado", rows);
    }else{
        console.log("Erro: Consulta não realizada!");
    }
});
conection.query("SELECT * FROM agenda_profissional", function(err, rows, fields){
    if(!err){
        console.log("Resultado", rows);
    }else{
        console.log("Erro: Consulta não realizada!");
    }
});

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'auth' 
    })
});

// Evento quando o chat está pronto
client.on('ready', () => {
    console.log('O Chat está pronto!');
});

// Evento para gerar e exibir o QR code
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Inicializar o cliente
client.initialize();


//Funções
//Formatar vaga 
function formatarVagas(rows) {
    let vagasDisponiveis = 'Vagas Disponíveis:\n';
    let contador = 1;

    rows.forEach(row => {
        let dataFormatada = new Date(row.dia).toLocaleDateString('pt-BR');
        let horarioFormatado = new Date('1970-01-01T' + row.horario).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
        
        
        vagasDisponiveis += `Vaga ${contador++}: Data: ${dataFormatada}, Horário: ${horarioFormatado}\n`;
    });

    return vagasDisponiveis;
}

//Formatar Data e Hora do usuário
function converterDataHoraParaMysql(data, hora = '00:00:00') {
    // Exemplo de data recebida: "20/10/2024"
    const partes = data.split('/');  // Divide a data em [dia, mês, ano]

    // Verifica se a data está no formato correto
    if (partes.length === 3) {
        const dia = partes[0];    // "20"
        const mes = partes[1];    // "10"
        const ano = partes[2];    // "2024"

        // Retorna a data e hora no formato "YYYY-MM-DD HH:MM:SS"
        return `${ano}-${mes}-${dia} ${hora}`;
    } else {
        console.error('Formato de data inválido');
        return null;
    }
};



function converterData (data){

    const partes = data.split('/');

    if(partes.length ===3){
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];

        return `${ano}-${mes}-${dia}`;
    }else{
        console.log("Formato inválido");
        return null;
    }
};

/*client.on('message_create', message => {
	console.log(message.body);
});*/
// Evento para mensagens criadas
/*
client.on('message_create', message => {
    if (message.body === 'oi') {
            client.sendMessage(message.from, 'Resposta');
    }
});
*/

client.on('message_create', message => {
    if (message.body.toLocaleLowerCase() === 'ola' || message.body.toLocaleLowerCase() === 'oi') {
        client.sendMessage(message.from, 'Olá, Sou um Bot do Health Hub, em que eu poderia ajudar? Digite a palavra de acordo com sua necessidade \n (Visualizar) Para visualizar vagas disponiveis.\n (Consulta) Para visualizar suas consultas.\n(Marcar) Para marcar consulta \n(Cancelar)Para cancelar uma consulta. ');
    }
});


//Vizualizar Vagas Disponivéis

const usuarioVaga = new Set();
client.on('message_create', message => {
    
    if (message.body === 'Visualizar') {
        console.log('Usuario escolheu vizualizar');
        conection.query("SELECT nome FROM profissionais",function(err,rows){
            if(!err){
                if(rows.length > 0) { 
                    let profissionais = 'DIgite o nome de um Profissional:\n';
                    rows.forEach(function(row, index) {
                    profissionais += (index + 1) + '. ' + row.nome + '\n';
                    });
                    client.sendMessage(message.from, profissionais);
                }else{
                    console.log("Erro ao visualizar vagas");
                }
            }else{
                console.log("Erro ao conectar");
        }
        });
        usuarioVaga.add(message.from);
    }else if (usuarioVaga.has(message.from)){ 
        
        const nomeProfissional = message.body;
        usuarioVaga.delete(message.from);
        console.log(nomeProfissional);

        setTimeout(() => {
        conection.query("SELECT * FROM agenda_profissional WHERE  profissional_id = ?", [nomeProfissional], function(err,rows){
            if(!err){
                if(rows.length > 0) {
                    vagasFormatadas = formatarVagas(rows);
                    client.sendMessage(message.from, vagasFormatadas);
                    console.log('Consulta realizada');
                } else{
                client.sendMessage(message.from, "Nenhuma vaga encontrada com o profissional.");
                 console.log('Nenhuma vaga encontrado');   
                }
            }else{
                console.log('Erro na Consulta',err);
            }
        });
        5000});

    };
});



// Para rastrear usuários que aguardam resposta
const usuarioEsperando = new Set();
client.on('message_create', message => {
    
    // Resposta à saudação
    if(message.body === 'Consulta'){
        client.sendMessage(message.from,"Digite seu nome");
        console.log('informe o nome no Whatsapp');
        usuarioEsperando.add(message.from);
    }else if(usuarioEsperando.has(message.from)){
        const nomeUsuario = message.body;

        usuarioEsperando.delete(message.from);

        setTimeout(() => {
            conection.query("SELECT * FROM consultas WHERE usuario_id = ?", [nomeUsuario], function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        // Mensagem acumulada
                        let mensagem = "Você tem as seguintes consultas agendadas:\n\n";
        
                        // Iterando por todas as consultas encontradas
                        rows.forEach((row, index) => {
                            // Obtendo a data e hora da consulta
                            const dataConsulta = new Date(row.data_consulta);
                            
                            // Formatando a data e a hora
                            const dataFormatada = dataConsulta.toLocaleDateString('pt-BR');  // Exemplo: "10/11/2024"
                            const horarioFormatado = dataConsulta.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });  // Exemplo: "14:30"
                            const profissionalNome = row.profissional_id || 'Desconhecido';
                            // Montando a linha da consulta
                            mensagem += `Consulta ${index + 1}: ${dataFormatada} às ${horarioFormatado}, Profissional ${profissionalNome}\n`;
                        });
        
                        // Enviar a mensagem única com todas as consultas
                        client.sendMessage(message.from, mensagem);
                        console.log('Mensagem de consultas enviadas');
                    } else {
                        // Caso o usuário não tenha consultas agendadas
                        console.log('Nenhuma consulta encontrada');
                        client.sendMessage(message.from, "Você não tem nenhuma consulta agendada.");
                    }
                } else {
                    // Caso ocorra erro ao buscar consultas
                    console.log('Erro na Consulta', err);
                    client.sendMessage(message.from, "Houve um erro ao buscar suas consultas. Tente novamente.");
                }
            });
        }, 5000);  // 5 segundos de delay antes de executar a consulta
        

    }
});

// Mapas para armazenar os dados de cada usuário
  // Armazena os dados dos usuários em diferentes etapas
  let usuariosEmProcesso = new Map();
client.on('message_create', message => {
   
    
    console.log('Mensagem recebida:', message.body);

    // Inicia o processo de agendamento
    if (message.body === 'Marcar') {
        console.log('Usuário escolheu marcar');
        client.sendMessage(message.from, "Digite seu nome completo");
        console.log('Digite seu nome completo');
        usuariosEmProcesso.set(message.from, { etapa: 'nome', nome: null, profissional: null, data: null, hora: null });
    } 

    // Quando o usuário está na etapa de fornecer o nome
    else if (usuariosEmProcesso.has(message.from) && usuariosEmProcesso.get(message.from).etapa === 'nome') {
        const nomeCompleto = message.body;
        console.log(`Nome do usuário: ${nomeCompleto}`);
        usuariosEmProcesso.get(message.from).nome = nomeCompleto;
        usuariosEmProcesso.get(message.from).etapa = 'profissional';  // Avança para a próxima etapa

        client.sendMessage(message.from, "Digite o nome do profissional");
        console.log('Digite o nome do profissional');
    } 

    // Quando o usuário está na etapa de escolher o profissional
    else if (usuariosEmProcesso.has(message.from) && usuariosEmProcesso.get(message.from).etapa === 'profissional') {
        const nomeProfissional = message.body;
        console.log(`Profissional escolhido: ${nomeProfissional}`);
        usuariosEmProcesso.get(message.from).profissional = nomeProfissional;  // Armazena o nome do profissional
        usuariosEmProcesso.get(message.from).etapa = 'data';  // Avança para a etapa de data

        client.sendMessage(message.from, "Digite a data da consulta (ex: 20/10/2024)");
        console.log('Digite a data da consulta');
    } 

    // Quando o usuário está na etapa de escolher a data
    else if (usuariosEmProcesso.has(message.from) && usuariosEmProcesso.get(message.from).etapa === 'data') {
        const dataConsulta = message.body;
        console.log(`Data escolhida: ${dataConsulta}`);
        usuariosEmProcesso.get(message.from).data = dataConsulta;  // Armazena a data da consulta
        usuariosEmProcesso.get(message.from).etapa = 'hora';  // Avança para a etapa de escolher hora

        client.sendMessage(message.from, "Digite o horário da consulta (ex: 14:30)");
        console.log('Digite o horário da consulta');
    }

    // Quando o usuário está na etapa de escolher a hora
    else if (usuariosEmProcesso.has(message.from) && usuariosEmProcesso.get(message.from).etapa === 'hora') {
        const horaConsulta = message.body;
        console.log(`Hora escolhida: ${horaConsulta}`);
        usuariosEmProcesso.get(message.from).hora = horaConsulta;  // Armazena o horário da consulta

        // Cria o valor do DATETIME combinando data e hora
        const { nome, profissional, data, hora } = usuariosEmProcesso.get(message.from);
        const dataHoraConsulta = converterDataHoraParaMysql(data, hora);  // Concatenando data e hora
        const datasql = converterData(data);
        // Insere os dados no banco
        setTimeout(() => {
            console.log('Inserindo consulta no banco...');
            conection.query("INSERT INTO consultas (usuario_id, profissional_id, data_consulta) VALUES (?,?,?)", 
                [nome, profissional, dataHoraConsulta], 
                function(err, rows) {
                    if (!err) {
                        console.log('Consulta realizada');
                        client.sendMessage(message.from, "Consulta agendada com sucesso!");

                        // Agora vamos excluir o horário da agenda do profissional
                        console.log('Excluindo horário da agenda do profissional...');
                        conection.query(
                            "DELETE FROM agenda_profissional WHERE profissional_id = ? AND dia = ? AND horario = ?", 
                            [profissional, datasql, hora], 
                            function(err, result) {
                                if (err) {
                                    console.log(profissional, data, hora);
                                    client.sendMessage(message.from, "Houve um erro ao remover o horário da agenda do profissional.");
                                } else {
                                    console.log("Horário removido da agenda com sucesso.");
                                }
                            }
                        );
                    } else {
                        console.error('Erro na Consulta', err);
                        client.sendMessage(message.from, "Houve um erro ao agendar sua consulta. Tente novamente.");
                    }
                });
        }, 5000);  // Delay de 5 segundos antes de gravar no banco de dados

        // Finaliza o processo de agendamento e limpa o estado do usuário
        usuariosEmProcesso.delete(message.from);
    }
});

//Cancelar Conculsa
// Quando o usuário escolhe 'Cancelar'
const usuariosEmProcesso2 = new Map();
client.on('message_create', message => {
// Definindo a variável como um Map antes do bloco de código


// Quando o usuário escolhe 'Cancelar'
if (message.body === 'Cancelar') {
    console.log('Usuário escolheu cancelar');
    client.sendMessage(message.from, "Digite seu nome completo.");
    console.log('Digite seu nome completo');
    usuariosEmProcesso2.set(message.from, { etapa: 'nome', nome: null, profissional: null, data: null, hora: null });
} 

// Quando o usuário está na etapa de fornecer o nome
else if (usuariosEmProcesso2.has(message.from) && usuariosEmProcesso2.get(message.from).etapa === 'nome') {
    const nomeCompleto = message.body;
    console.log(`Nome do usuário: ${nomeCompleto}`);
    usuariosEmProcesso2.get(message.from).nome = nomeCompleto;
    usuariosEmProcesso2.get(message.from).etapa = 'profissional';  // Avança para a próxima etapa

    client.sendMessage(message.from, "Digite o nome do profissional.");
    console.log('Digite o nome do profissional');
} 

// Quando o usuário está na etapa de escolher o profissional
else if (usuariosEmProcesso2.has(message.from) && usuariosEmProcesso2.get(message.from).etapa === 'profissional') {
    const nomeProfissional = message.body;
    console.log(`Profissional escolhido: ${nomeProfissional}`);
    usuariosEmProcesso2.get(message.from).profissional = nomeProfissional;  // Armazena o nome do profissional
    usuariosEmProcesso2.get(message.from).etapa = 'data';  // Avança para a etapa de data

    client.sendMessage(message.from, "Digite a data da consulta (ex: 20/12/2024).");
    console.log('Digite a data da consulta');
} 

// Quando o usuário está na etapa de escolher a data
else if (usuariosEmProcesso2.has(message.from) && usuariosEmProcesso2.get(message.from).etapa === 'data') {
    const dataConsulta = message.body;
    console.log(`Data escolhida: ${dataConsulta}`);
    usuariosEmProcesso2.get(message.from).data = dataConsulta;  // Armazena a data da consulta
    usuariosEmProcesso2.get(message.from).etapa = 'hora';  // Avança para a etapa de escolher hora

    client.sendMessage(message.from, "Digite o horário da consulta (ex: 14:30).");
    console.log('Digite o horário da consulta');
}

// Quando o usuário está na etapa de escolher a hora
else if (usuariosEmProcesso2.has(message.from) && usuariosEmProcesso2.get(message.from).etapa === 'hora') {
    const horaConsulta = message.body;
    console.log(`Hora escolhida: ${horaConsulta}`);
    usuariosEmProcesso2.get(message.from).hora = horaConsulta;  // Armazena o horário da consulta

    // Cria o valor do DATETIME combinando data e hora
    const { nome, profissional, data, hora } = usuariosEmProcesso2.get(message.from);
    const dataHoraConsulta = converterDataHoraParaMysql(data, hora);  // Concatenando data e hora
    const datasql = converterData(data);  // Concatenando data e hora

    // Verifica se a consulta existe no banco e a deleta
    setTimeout(() => {
        console.log('Buscando consulta no banco...');
        conection.query(
            "SELECT * FROM consultas WHERE usuario_id = ? AND profissional_id = ? AND data_consulta = ?",
            [nome, profissional, dataHoraConsulta],
            function(err, rows) {
                if (err) {
                    console.error("Erro ao buscar consulta: ", err);
                    client.sendMessage(message.from, "Erro ao buscar sua consulta. Tente novamente.");
                    return;
                }

                if (rows.length > 0) {
                    // Consulta encontrada, agora vamos cancelar

                    // Deletar a consulta da tabela
                    conection.query("DELETE FROM consultas WHERE usuario_id = ? AND profissional_id = ? AND data_consulta = ?",
                        [nome, profissional, dataHoraConsulta],
                        function(err, result) {
                            if (err) {
                                console.error("Erro ao cancelar consulta: ", err);
                                client.sendMessage(message.from, "Erro ao cancelar sua consulta. Tente novamente.");
                                return;
                            }

                            console.log("Consulta cancelada com sucesso.");

                            // Reinsere o horário de volta na agenda do profissional
                            conection.query(
                                "INSERT INTO agenda_profissional (profissional_id, dia, horario) VALUES (?, ?, ?)",
                                [profissional, datasql, hora],
                                function(err, result) {
                                    if (err) {
                                        console.error("Erro ao reinserir na agenda: ", err);
                                        client.sendMessage(message.from, "Erro ao liberar o horário na agenda do profissional.");
                                    } else {
                                        console.log("Horário reinserido na agenda do profissional com sucesso.");
                                        client.sendMessage(message.from, "Sua consulta foi cancelada e o horário foi liberado na agenda do profissional.");
                                    }
                                }
                            );
                        });
                } else {
                    console.log("Consulta não encontrada.");
                    console.log(nome,profissional,dataHoraConsulta);
                    client.sendMessage(message.from, "Não encontramos uma consulta com esses dados. Tente novamente.");
                }
            });
    }, 5000);  // Delay de 5 segundos antes de buscar no banco de dados

    // Finaliza o processo de cancelamento e limpa o estado do usuário
    usuariosEmProcesso2.delete(message.from);
}
});

