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
        // Enable Loading Button
        $("#filaButton").addClass("filaLoader");
        $("#filaButton").children().hide();
        $("#filaLoader").show();
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
                message: msgtext
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
            //
            let parentid = $(`#list${currentUserMobile}`).parent()[0].id;
            if ((parentid == 'userRecList') || (parentid == 'userAtvList')) {
                $(`#list${currentUserMobile}`).appendTo("#userAtendeList");
            }
            // Re Order Div List
            let parentDiv = $(`#list${currentUserMobile}`).parent()[0].id
            $(`#list${currentUserMobile}`).prependTo(`#${parentDiv}`)
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
            $("#interactionEndedModal").fadeIn("fast")
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
    window.open("https://ccs-pi.atendimento-fortalcred.com.br/atendente/consulta.html","_self");
});

// Historico de Conversa com o Usuario
$('#historyButton').on('click', function () {
    console.log('> Consulta historico do atendente');
    if (currentUserMobile) {
        // Enable Loading Button
        $("#historyButton").addClass("filaLoader");
        $("#historyButton").children().hide();
        $("#historyLoader").show();
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
        $("#cpf" + currentUserMobile).text(userCPF);
        $("#userNome").val('');
        $("#userCPF").val('');
    }
});

// Input de Mobile
$("#inputClient").on('click', function () {
    console.log('> Inicia input de Cliente');
    $("#userInputModal").fadeIn("fast")
});

// Edita respostas programadas
$("#editQuestionsButton").on('click', function () {
    let payload = {
        fkid: agentFkid,
        questions: []
    }
    for (i = 1; i < 6; i++) {
        let question = $("#questioInput" + i).val();
        const rex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
        question = question.replace(rex, match => `&#x${match.codePointAt(0).toString(16)}`);
        if (question != '') {
            payload.questions.push({
                'id': 'questioInput' + i + '_' + agentFkid,
                'message': question
            })
        }
    }
    console.log(payload);
    socket.emit('ins-questions', payload)
})

// Busca Mailing Ativo
$("#callMailingButton").on('click', function () {
    // Enable Loading Button
    $("#callMailingButton").addClass("filaLoader");
    $("#callMailingButton").children().hide();
    $("#mailingLoader").show();
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

// Sendo Audio
$("#buttonSendAudio").click(() => {
    console.log('> Send audio Button');
    // audioRecorder();
})

// Confirma envio de audio
$("#button-send-audio").on('click', () => {
    $(".chat-body-input-box").css("grid-template-columns", "8% 76% 8% 8%")
    $(".audio-modal").css("display", "none")
    $("#buttonSendAudio").css("display", "flex")
    // resetTimer()
    // mediaRecorder.stop()
})

// Cancela envio de audio
$("#button-cancel-audio").on('click', () => {
    $(".chat-body-input-box").css("grid-template-columns", "8% 76% 8% 8%")
    $(".audio-modal").css("display", "none")
    $("#buttonSendAudio").css("display", "flex")
    resetTimer()
})

// Seleciona edição de Tema
$("#buttonThemeEdit").click(() => {
    let r = document.querySelector(':root');
    currentColorPrimary = getComputedStyle(r).getPropertyValue('--color-primary')
    currentColorSecondary = getComputedStyle(r).getPropertyValue('--color-secondary')
    currentColorTextPrimary = getComputedStyle(r).getPropertyValue('--color-text-primary')
    currentColorTextSecondary = getComputedStyle(r).getPropertyValue('--color-text-secondary')
    currentHoverSecondary = getComputedStyle(r).getPropertyValue('--color-hover-secondary')
    $("#editThemeModal").fadeIn("fast")
})

// Cancela seleção de temas
$("#buttonThemeCancel, #buttonThemeClose").click(() => {
    selectTheme('', true)
})

// Emoji para Respostas Programadas
$("#questioInput1,#questioInput2,#questioInput3,#questioInput4,#questioInput5").emoji({
    place: 'after'
})

// Abre seleção de avatares
$(".engrenagem-icon").click(() => {
    $(".change-profile-modal").toggleClass("d-grid")
})

// Confirma seleção de avatar
$(".user-pic-button, .avatar-pic").click((ev) => {
    $(".user-pic-button").find(".check-pic").remove()

    $(ev.target).closest(".user-pic-button").append(`
        <span class="check-pic"><i class="fas fa-check"></i></span>
    `)

    let img = $(ev.target).closest(".user-pic-button").find(".avatar-pic").prop("src")
    let imgId = $(ev.target).closest(".user-pic-button").find(".avatar-pic").prop("id")
    sessionStorage.setItem('avatar', imgId)
    socket.emit('upd_avatar', { avatar: imgId, fkid: agentFkid })
    $("#user-profile-pic").prop("src", img)
})

// Call Input Mobile
$("#callInputMobile").on('click', () => {
    let inputMobile = $("#userInputMobile").val();
    let regx = new RegExp("[^0-9]", "g");
    let mobileParam = inputMobile.replace(regx, "")
    if(mobileParam.length == 13){
        $("#userInputMobile").val(null);
        socket.emit('bi-callinput', {
            fkid: agentFkid,
            fkname: agentFkname,
            mobile: mobileParam
        });
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Digite corretamente o numero do Cliente!";
        callWarningModal(modalTitle, modalDesc)
    }
})

//
$("#searchClients").on('keyup', () => {
    let searchText = $("#searchClients").val();
    let atendeArr = $("#userAtendeList").children();
    for(i=0; i < atendeArr.length; i++){
        //let clientName = atendeArr[i].children[1].children[0].textContent;
        let clientName = atendeArr[i].outerHTML;
        // Set to Lower Case
        clientName = clientName.toLocaleLowerCase();
        searchText = searchText.toLocaleLowerCase();
        if(clientName.indexOf(searchText) > -1){
            atendeArr[i].style = 'display: grid'
        } else {
            atendeArr[i].style = 'display: none'
        }
        if(searchText == '' || searchText == null){
            atendeArr[i].style = 'display: grid'
        }
    }
})