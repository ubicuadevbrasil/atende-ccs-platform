// >>> Constants
const socket = io.connect();
const agentFkid = sessionStorage.getItem('fkid');
const agentFkname = sessionStorage.getItem('fkname');
const appCdnUpload = 'https://cdn.ubicuacloud.com/upload';
const appCdnFile = 'https://cdn.ubicuacloud.com/file/';
const appCdnBase = 'https://cdn.ubicuacloud.com/base64/';
const inUsersDisplay = $('#userRecList');
const outUsersDisplay = $('#userAtvList');
const chatScreen = $('#chatPanel');
const chatDefault = $('#chatDefault');

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
$('#endFormCpf').mask('999.999.999-99');


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

// Detect Connection
socket.on('connect', function () {
    console.log('> Conectado')
    socket.emit('bi-atendein', { fkid: agentFkid });
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
    console.log('> Atendendo Fila');
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
        await histmsg(contacts, logs);
    }
    socket.emit('add user', { fkid: agentFkid, fkname: agentFkname });
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
    $('#formModal').css('display', 'block');
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