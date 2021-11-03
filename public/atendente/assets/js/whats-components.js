// Initialize media inputs
$('#insertImage').click(function () { $('#imageInput').trigger('click'); });
$('#insertVideo').click(function () { $('#videoInput').trigger('click'); });
$('#insertAudio').click(function () { $('#audioInput').trigger('click'); });
$('#insertDoc').click(function () { $('#docInput').trigger('click'); });

// Desloga Usuario
$("#buttonLogout").on("click", function () {
    console.log('> Agent logout');
    // Desloga usuario
    logoutAgent();
});

// Botão de Atender Fila
$("#filaButton").on("click", function () {
    console.log('> Atende usuario da fila');
    let filaIn = $('#fila').text();
    // Busca quantidade na fila (se maior que 0, chama cliente)
    if (filaIn > 0) {
        // Evento para chamar cliente
        socket.emit('bi-answer_new_queue', {
            fkid: agentFkid,
            fkname: agentFkname
        });
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Não Há Contatos na Fila!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Envia menssagem de texto
$("#sendMessageButton").on("click", async function () {
    console.log('> Send text message');
    let msgtext = $('#messageInputBox').val();
    if (currentUserMobile) {
        // Verifica se o campo de MSG foi preenchido
        if (msgtext != '') {
            // Evento para enviar MSG
            socket.emit('send_chat', {
                mobile: currentUserMobile,
                type: "chat",
                message: "" + msgtext + ""
            });
            // Cria componente de MSG no Chat
            let messageTime = await getTime();
            let messageComponent = messageRight(msgtext, messageTime);
            $('#chat' + currentUserMobile).append(messageComponent);
            // Atualiza ultima mensagem
            $('#lastMessage' + currentUserMobile).text(msgtext);
            $('#lastMessageTime' + currentUserMobile).text(messageTime);
            // Scroll to last message
            document.getElementById(`chat${currentUserMobile}`).scrollBy(0, 9999999999999999);
            $('#messageInputBox').val(null);
        } else {
            let modalTitle = "Aviso";
            let modalDesc = "Campo de Texto Vazio!";
            callWarningModal(modalTitle, modalDesc)
        }
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Atendimento Iniciado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Botao para enviar Midia
$("#attachMediaButton").on("click", function () {
    // Verifica se existe um usuario selecionar
    if (currentUserMobile) {
        $("#mediaModal").fadeIn("fast");
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Atendimento Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
})

// Botão para encerrar atendimentos
$('#closeChatButton').on('click', function () {
    console.log('> Botão de encerrar');
    if (currentUserMobile) {
        // Evento Status Encerramento
        socket.emit('bi-statusen');
        $('#endFormCpf').val('')
        $('#endFormBanco').val('')
        $('#endFormProtocolo').val('')
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Botão para confirmar encerramento
$('#confirmEnd').on('click', function () {
    // Verifica se existe um contato selecionado
    if (currentUserMobile) {
        // Verifica se os campos foram preenchidos
        let statusSel = $('#endOptions option:selected').val();
        let cpf = $("#endFormCpf").val();
        if (statusSel == "0" || cpf == "") {
            let modalTitle = "Aviso";
            let modalDesc = "Preencha todos os campos abaixo para Encerrar o Atendimento!";
            callWarningModal(modalTitle, modalDesc)
        } else {
            socket.emit('bi-close_chat', {
                mobile: currentUserMobile,
                status: $('#endOptions').val(),
                cnpj: $('#endFormCpf').val().replace(/[^\d]+/g, ''),
                protocolo: $('#endFormProtocolo').val(),
                banco: $('#endFormBanco').val()
            });
            $('#endFormCpf').val('')
        }
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Inicia Transferencia
$('#buttonTransfer').on('click', function () {
    console.log('> Inicia Transferencia');
    if (currentUserMobile) {
        // Verifica se há atendentes online
        // Se NÃO abre modal notificando o Usuario
        if ($('#atendentesOnline').children('option').length < 2) {
            let modalTitle = "Aviso";
            let modalDesc = "Nenhum Atendente Online!";
            callWarningModal(modalTitle, modalDesc)
            // Se SIM, abre modal para realizar transferencia
        } else {
            $('#transferModal').fadeIn("fast");
        }
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Confirma Transferencia
$('#confirmTransferAgents').on('click', function () {
    console.log('> Confirma transferencia');
    let optionSelected = $('#atendentesOnline option:selected').val();
    let optionSelectedText = $('#atendentesOnline option:selected').text();
    // Verifica atendente selecionado para transferencia
    if (optionSelected == "0") {
        let modalTitle = "Aviso";
        let modalDesc = "Atendente Inválido!";
        callWarningModal(modalTitle, modalDesc)
    } else {
        // Evento para confirmar transferencia
        socket.emit('bi-transferagent', {
            mobile: currentUserMobile,
            fkid: optionSelected,
            fkname: optionSelectedText,
            message: "<strong>Atendimento Transferido para: " + optionSelectedText + "</strong>"
        });
    }
});

// Cadastra Cliente
$("#buttonSignUp").on('click', function () {
    console.log('> Cadastrar Cliente');
    // Exibe Modal
    if (currentUserMobile) {
        socket.emit('get_cliInfo', {
            mobile: currentUserMobile
        })
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Editor de respostas
$("#buttonResponseEdit").on('click', function () {
    console.log('> Edição de Respostas Rapidas');
    $('#editAnswerModal').fadeIn("fast");
});

// Acessar página de consulta
$("#buttonConsult").on('click', function () {
    console.log('> Consulta Atendimentos');
    window.open("https://ccs.atendimento-kainos.com.br/atendente/consulta.html");
});

// Historico de Conversa com o Usuario
$('#historyButton').on('click', function () {
    console.log('> Consulta historico do atendente');
    if (currentUserMobile) {
        // Limpa janela de Chat atual
        $("#chatHistory").empty();
        // Evento para buscar historico do Cliente
        socket.emit('bi-lasthistory', {
            mobile: currentUserMobile
        });
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// Cadastra Informações do Cliente
$("#singupButton").on('click', function () {
    console.log('> Cadastra informações do usuario');
    let userName = $("#userNome").val();
    let userCPF = $("#userCPF").val();
    if (userName != '' && userCPF != '') {
        socket.emit('upd_cliInfo', {
            name: userName,
            cpf: userCPF,
            mobile: currentUserMobile
        })
        $("#userInfoName" + currentUserMobile).text(userName);
        $("#userNome").val('');
        $("#userCPF").val('');
    }
});

// Edita respostas programadas
$("#editQuestionsButton").on('click', function () {
    let payload = {
        fkid : agentFkid,
        questions : []
    }
    for(i=1; i < 6; i++){
        let question = $("#questioInput" + i).val();
        if(question != ''){
            payload.questions.push({
                'id': 'questioInput' + i + '_' + agentFkid,
                'message' : question
            })
        }
    }
    console.log(payload);
    socket.emit('ins-questions',payload)
})

// Busca Mailing Ativo
$("#callMailingButton").on('click', function (){
    socket.emit('bi-mailativo');
});

// Media Upload (Image)
$('#imageInput').change(function () {
    console.log('> Upload de Imagem');
    uploadFile($("#imageInput")[0].files[0], 'image');
});

// Media Upload (Video)
$('#videoInput').change(function () {
    console.log('> Upload de Video');
    uploadFile($("#videoInput")[0].files[0], 'video');
});

// Media Upload (Audio)
$('#audioInput').change(function () {
    console.log('> Upload de Audio');
    uploadFile($("#audioInput")[0].files[0], 'audio');
});

// Media Upload (Document)
$('#docInput').change(function () {
    console.log('> Upload de Documento');
    uploadFile($("#docInput")[0].files[0], 'document');
});