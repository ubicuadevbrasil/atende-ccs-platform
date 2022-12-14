// >>> Constants
const socket = io.connect();
const agentFkid = sessionStorage.getItem('fkid');
const agentFkname = sessionStorage.getItem('fkname');
const appCdnUpload = 'https://cdn.ubicuacloud.com/upload';
const appCdnFile = 'https://cdn.ubicuacloud.com/file/';
const appCdnBase = 'https://cdn.ubicuacloud.com/base64/';
const atendeUsersDisplay = $('#userAtendeList');
const inUsersDisplay = $('#userRecList');
const outUsersDisplay = $('#userAtvList');
const chatScreen = $('#chatPanel');
const chatDefault = $('#chatDefault');
const questionsDefault = $('#questionsGroup');

// >>> Global Var's
let currentUserMobile;
let textInputDetect = document.getElementById("messageInputBox");
let timeout = setTimeout(function () {
    socket.emit('bi-usertimeout', {
        fkid: agentFkid,
        fkname: agentFkname,
    })
}, 4200000);

textInputDetect.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
        $("#sendMessageButton").trigger('click');
    }
});

// Check for Login Info
if (!agentFkname || !agentFkid) { window.location = "index.html" }
$("#user-name").text(agentFkname);
$('#endFormCpf').mask('999.999.999-99');
$('#userCPF').mask('999.999.999-99');

// Update to block timeout
$(document).on('mousemove', function () {
    // Check for timeout
    if (timeout !== null) {
        clearTimeout(timeout)
    }
    timeout = setTimeout(function () {
        socket.emit('bi-usertimeout', {
            fkid: agentFkid,
            fkname: agentFkname,
        });
    }, 4200000);
});

// Check for new Questions
setInterval(() => {
    socket.emit('bi-questions', { fkid: agentFkid });
}, 2500);

// Detect Connection
socket.on('connect', function () {
    console.log('> Conectado')
    socket.emit('bi-atendein', { fkid: agentFkid });
    socket.emit('bi-questions', { fkid: agentFkid });
    selectTheme(sessionStorage.getItem('tema'), false);
    $("#user-profile-pic").prop("src", "../assets/images/" + (sessionStorage.getItem('avatar')) + ".png");
});

// Detect Disconnect
socket.on('disconnect', function () {
    console.log('> Desconectado');
});

// Force Disconnect
socket.on("force_disconnect", function () {
    console.log('> Logout forçado');
    logoutAgent();
});

// User Timeout
socket.on('bi-usertimeout', function (payload) {
    console.log('> Logout por timeout');
    logoutAgent();
});

// Atender Fila
socket.on('bi-answer_new_queue', async function (payload) {
    console.log('> Atendendo Fila1');
    // Answer New Queue
    await answerNewQueue(payload)
    // Sleep and execute bi-atendein for History purposes
    socket.emit('bi-atendein', { fkid: agentFkid });
});

// Busca e Atualiza atendimentos em curso
socket.on('bi-atendein', async function (payload) {
    console.log('> Buscando atendimentos e historicos');
    if (payload.logs.length > 0 && payload.contacts.length > 0) {
        let logs = JSON.parse(payload.logs);
        let contacts = JSON.parse(payload.contacts);
        await arrangeUserChat(contacts, logs)
        await historyMessage(contacts, logs, 'chatPannel');
    }
    socket.emit('add user', { fkid: agentFkid, fkname: agentFkname });
});

// Busca Questions
socket.on('bi-questions', async function (payload) {
    console.log('> Buscando Respostas Automaticas');
    questionsDefault.empty()
    for(i=0; i < payload.questions.length; i++){
        let questions = payload.questions[i];
        let questionId = payload.questions[i].id.replace('_' + agentFkid,'');
        let questionMessage = payload.questions[i].message;
        let questionsComponent = questionsDiv(i, questionMessage);
        questionsDefault.append(questionsComponent);
        // Append question on Edit question Modal
        if($('#editAnswerModal:visible').length == 0){
            // $('#' + questionId).attr("placeholder", questionMessage);
        }
    }
});

// Encerra um atendimento especifico
socket.on('bi-close_chat', async function (payload) {
    console.log('> Encerra chat');
    // Clear current chat panel
    $('#list' + payload.mobile).remove();
    $('#chat' + payload.mobile).remove();
    document.getElementById('userChatAvatar').classList.add('closedChat');
    document.getElementById('userMobileSpan').innerText = '';
    document.getElementById('closeChatButton').classList.add('closedChat');
    document.getElementById('chatDefault').classList.remove('closedChat');
    // Clear Current mobile
    currentUserMobile = "";
});

// Busca informações da fila
socket.on('sentinel_clients_queue', function (payload) {
    // Atualização das Filas
    for (i = 0; i < payload.length; i++) {
        // Preenche fila Normal
        if (payload[i].tabela == 'filain') {
            filaNorm = payload[i].total
        }
    }
    // Atualiza os componentes da Fila
    $('#fila').text(filaNorm);
});

// Detecta status de encerramentos
socket.on('bi-statusen', function (payload) {
    let statusEnc = JSON.parse(payload);
    $("#endOptions").empty().append("<option value='0'>Selecione</option>");
    for (i = 0; i < statusEnc.length; i++) {
        let option = document.createElement('option');
        option.value = statusEnc[i].id;
        option.text = statusEnc[i].descricao;
        option.id = statusEnc[i].pedido;
        $("#endOptions").append(option);
    }
    $('#formModal').fadeIn("fast");
});

// Verifica outros atendentes online para transferencia
socket.on('sentinel_clients_alive', function (payload) {
    let atendentesOnline = JSON.parse(payload);
    for (i = 0; i < atendentesOnline.length; i++) {
        if ($("#atendentesOnline option[value=" + atendentesOnline[i].fkid + "]").length == 0 && agentFkid != atendentesOnline[i].fkid) {
            let option = document.createElement('option');
            option.value = atendentesOnline[i].fkid;
            option.text = atendentesOnline[i].fkname;
            $("#atendentesOnline").append(option);
        }
    }
});

// Confirma transferencia
socket.on('bi-transferagent', async function (payload) {
    console.log('> Status from Transfer Agent');
    if (payload.status == 0) {
        let modalTitle = "Atenção";
        let modalDesc = "Transferência do Contato <strong>" + payload.mobile + "</strong> Não Realizada, Atendente <strong>" + payload.fkname + "</strong> Não se Encontra mais Online !";
        callWarningModal(modalTitle, modalDesc)
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Transferência do Contato " + payload.mobile + " Realizada com Sucesso !";
        callSuccessModal(modalTitle, modalDesc)
        // Clear current chat panel
        $('#list' + payload.mobile).remove();
        $('#chat' + payload.mobile).remove();
        document.getElementById('userChatAvatar').classList.add('closedChat');
        document.getElementById('userMobileSpan').innerText = '';
        document.getElementById('closeChatButton').classList.add('closedChat');
        document.getElementById('chatDefault').classList.remove('closedChat');
        // Clear Current mobile
        currentUserMobile = "";
    }
});

// Recebe transferencia
socket.on('bi-transferok', async function (payload) {
    console.log('> Transferencia OK');
    // Cria componentes de Chat
    let userMobile = payload.mobile;
    // Prep user components
    if (userMobile != null) {
        // Create user components
        let userChatComponent = userListDiv(userMobile, '', '', '123456');
        if (payload.atendir == 'in') {
            inUsersDisplay.append(userChatComponent);
        } else if (payload.atendir == 'out') {
            outUsersDisplay.append(userChatComponent);
        }
        let userChatDisplayComponent = userChatDiv(userMobile);
        // Arrange user Chat component
        let userChatComponentDisplay = document.getElementById("chat" + userMobile);
        if (userChatComponentDisplay == null) { chatScreen.prepend(userChatDisplayComponent) }
    }
    // Confirmar ecebimento da Transferencia
    socket.emit('bi-transferok', { mobile: payload.mobile });
});

// Evento de Recebimento de Mensagens
socket.on('receive_chat', async function (payload) {
    console.log('> Mensagem recebida');
    if (agentFkid == payload.fkto) {
        let audio = new Audio('assets/audio/tethys.mp3');
        let userMobile = payload.contact_uid;
        let messageType = payload.message_type;
        let messageText = payload.body_text;
        let messageCaption = payload.body_caption;
        let messageUrl = payload.body_url;
        let messageTime = await getTime();
        let messageComponent;

        if (messageType === 'chat') {
            messageComponent = messageLeft(messageText, messageTime);
        } else if (messageType === 'image') {
            messageComponent = messageImageLeft(messageUrl, messageCaption, messageTime);
        } else {
            messageComponent = messageAttachLeft(messageUrl, messageCaption, messageTime);
        }

        // Append message component
        $('#chat' + userMobile).append(messageComponent);
        // Aumenta numero de notificações de cada conversa
        let notifica = $('#notifyUser' + userMobile).text();
        notifica = Number(notifica) + 1;
        $('#notifyUser' + userMobile).text(notifica);
        $('#notifyUser' + userMobile).fadeIn(1);
        // Atualiza ultima mensagem
        $('#lastMessage' + userMobile).text(messageText);
        $('#lastMessageTime' + userMobile).text(messageTime);
        // Aviso sonoro de novas mensagens
        audio.play();
        // Scroll to last message
        document.getElementById(`chat${currentUserMobile}`).scrollBy(0, 9999999999999999);
    }

});

// Historico de conversa do Cliente
socket.on('bi-lasthistory', async function (payload) {
    console.log('> Busca historico do Cliente')
    if (payload.contacts.length != 0) {
        let logs = JSON.parse(payload.logs);
        let contacts = JSON.parse(payload.contacts);
        await historyMessage(contacts, logs, 'chatHistory');
        $("#historicoModal").fadeIn("fast");
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Não Há Nenhum Histórico Desse Contato!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Recebe informaçoes do Cliente
socket.on('get_cliInfo', async function (payload) {
    console.log('> Recebe informaçoes do Cliente');
    // Recebe Info
    let userName = payload.nome;
    let userCPF = payload.cpf;
    $("#userNome").val(userName);
    $("#userCPF").val(userCPF);
    $('#signupModal').fadeIn("fast");
})

// Recebe Mailing Ativo
socket.on('bi-mailativo', function (payload) {
    if (payload != "" && payload != null) {
        let data = JSON.parse(payload);
        let dataSet = [];
        for (i = 0; data.length > i; i++) {
            let callBtn = '<button type="button" class="call-mailing-button" onclick="callMobile(' + data[i].mobile + ')">Chamar</button>';
            let row = [data[i].nome, data[i].banco, data[i].cpf, data[i].mobile, callBtn]
            dataSet.push(row);
        }
        $('#table_id').dataTable({
            "destroy": true,
            "autoWidth": true,
            "pageLength": 10,
            "lengthChange": false,
            "data": dataSet,
            "ordering": false,
            columns: [
                { title: "Nome" },
                { title: "Banco" },
                { title: "Cpf" },
                { title: "Numero" },
                { title: "Chamar" }
            ],
            "language": {
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                "sInfoFiltered": "(Filtrados de MAX registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Pesquisar",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                }
            }
        });
        $('#mailingModal').fadeIn("fast");
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum contato encontrado para efetuar Chamada!";
        callSuccessModal(modalTitle, modalDesc)
    }
});

// Recebe atualização de Ativo
socket.on("bi-atendemail", function (payload) {
    if (payload.status == '200') {
        socket.emit('bi-atendein', { fkid: agentFkid });
    } else if (payload.status == '429') {
        let modalTitle = "Aviso";
        let modalDesc = "Você já tem 5 chamadas em atendimento. Encerre uma das interações ativas para poder chamar um novo contato!";
        callWarningModal(modalTitle, modalDesc)
    } else if (payload.status == '400') {
        let modalTitle = "Aviso";
        let modalDesc = "Este numero já se encontra em atendimento!";
        callWarningModal(modalTitle, modalDesc)
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Você atingiu o limite de contatos ativos por hora, aguarde " + payload.status + " minuto(s) para poder realizar um novo contato ativo.";
        callWarningModal(modalTitle, modalDesc)
    }
});