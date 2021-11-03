// Initialize media inputs
$('#imgins').click(function () { $('#inseririmg').trigger('click'); });
$('#vidins').click(function () { $('#inserirvid').trigger('click'); });
$('#audins').click(function () { $('#inseriraudio').trigger('click'); });
$('#docins').click(function () { $('#inserirdoc').trigger('click'); });

// ? Botão de Logout
$("#btnlogout").on("click", function () {
    console.log('> Agent logout');
    // Desloga usuario
    logoutAgent();
});

// ? Botão de Atender Fila
$("#nvatend").on("click", function () {
    console.log('> Atende usuario da fila');
    let filaIn = $('#filain').text();
    // Busca quantidade na fila (se maior que 0, chama cliente)
    if (filaIn > 0) {
        // Evento para chamar cliente
        socket.emit('bi-answer_new_queue', {
            fkid: agentFkid,
            fkname: agentFkname
        });
        // Adiciona classe de Loading para botão da fila
        $('#nvatend').addClass('form-loading');
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Não Há Contatos na Fila!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// ! Botao de Atender Fila Prioritaria
$("#nvatendPrior").on("click", function () {
    console.log('> Atende usuario da fila prioritaria');
    let filaIn = $('#filaPrior').text();
    // Busca quantidade na fila (se maior que 0, chama cliente)
    if (filaIn > 0) {
        // Evento para chamar cliente
        socket.emit('bi-answer_new_prior', {
            fkid: agentFkid,
            fkname: agentFkname
        });
        // Adiciona classe de Loading para botão da fila
        $('#nvatendPrior').addClass('form-loading');
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Não Há Contatos na Fila!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// ? Envia menssagem de texto
$("#sendmsgtxt").on("click", async function () {
    console.log('> Send text message');
    let msgtext = $('#inputmsgtxt').val();
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
            let messageComponent = msgtxtr(msgtext, agentFkname, messageTime);
            $('#chat' + currentUserMobile).append(messageComponent);
            // Scroll to last message
            pageScroll();
            $('#inputmsgtxt').val(null);
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

// ? Botão para consultar atendimentos posteriores
$('#btnconsulta').on('click', function () {
    console.log('> Consulta Atendimentos');
    window.open('consulta.html');
});

// ? Botão para cadastrar informações sobre o Cliente
$('#btncadastro').on('click', function () {
    console.log('> Cadastra Cliente');
    if (currentUserMobile) {
        bootbox.prompt({
            title: 'Cadastro Nome e Sobrenome do aluno:',
            callback: function (result) {
                // Verifica se informações preenchidas
                if (result == null) {
                    alert('Registro Cancelado');
                } else if (result != null) {
                    // Evento para efetuar o Cadastro
                    socket.emit('send_register', {
                        mobile: currentUserMobile,
                        name: result
                    });
                }
            },
        });
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }

});

// ? Inicia Transferencia
$('#btntransferir').on('click', function () {
    console.log('> Inicia Transferencia');
    if (currentUserMobile) {
        // Verifica se há atendentes online
        // Se NÃO abre modal notificando o Usuario
        if ($('#cbatendentesonline').children('option').length < 2) {
            let modalTitle = "Aviso";
            let modalDesc = "Nenhum Atendente Online!";
            callWarningModal(modalTitle, modalDesc)
            // Se SIM, abre modal para realizar transferencia
        } else {
            $('#modalTransferir').modal();
        }
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// ? Confirma Transferencia
$('#confirmatra').on('click', function () {
    console.log('> Confirma transferencia');
    let optionSelected = $('#cbatendentesonline option:selected').val();
    let optionSelectedText = $('#cbatendentesonline option:selected').text();
    // Verifica atendente selecionado para transferencia
    if (optionSelected == "0") {
        alert('Atendente Inválido!');
    } else {
        // Verifica se atendimento IN/OUT
        let userAtendir = document.getElementById("reply" + currentUserMobile).className;
        let atendir;
        if (userAtendir == "ion-forward") { atendir = 'out' } else if (userAtendir == "ion-reply") { atendir = 'in' };
        // Evento para confirmar transferencia
        socket.emit('bi-transferagent', {
            mobile: currentUserMobile,
            fkid: optionSelected,
            fkname: optionSelectedText,
            message: "<strong>Atendimento Transferido para: " + optionSelectedText + "</strong>",
            atendir: atendir
        });
        $('#modalTransferir').modal('hide');
    }
});

// ? Busca Historico do Cliente
$('#btnhistorico').on('click', function () {
    console.log('> Consulta historico do atendente');
    if (currentUserMobile) {
        // Limpa janela de Chat atual
        $("#chathistory").empty();
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

// ? Botão para encerrar atendimentos
$('#btnencerrar').on('click', function () {
    if (currentUserMobile) {
        // Clear CPF
        $("#iCPF").val('');
        // Evento Status Encerramento
        socket.emit('bi-statusen');
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }

});

// ? Botão para confirmar encerramento
$('#confirmaenc').on('click', function () {
    // Verifica se existe um contato selecionado
    if (currentUserMobile) {
        // Verifica se os campos foram preenchidos
        let statusSel = $('#icbStatus option:selected').val();
        let cpf = $("#iCPF").val();
        if (statusSel == "0" || cpf == "") {
            alert('Preencha todos os campos abaixo para Encerrar o Atendimento !');
        } else {
            socket.emit('bi-find_register', { "mobile": currentUserMobile });
        }
    } else {
        $('#modalAlertTitle').text('Aviso');
        $('#modalAlertText').text('Nenhum Contato Selecionado!');
        $('#modalAlert').modal();
    }
});

// TODO: Botão para um Input de um Mobile especifico
$('#callOther').on('click', function () {
    // Display Input Modal
    $('#modalInput').modal()
});

// TODO: Botão para efetuar o input de um Mobile
$('#insertInput').on('click', function () {
    // Realiza Captura do Mobile digitado pelo agente
    let mobile = $('#mobileInput').val();
    // Verifica se o Mobile é valido
    if ((mobile.length == 12) || (mobile.length == 13)) {
        // Fecha e limpa o input do Modal
        $("#modalInput").modal("hide")
        $('#mobileInput').val('');
        // Emite evento para chamar o novo Mobile
        socket.emit('bi-callinput', {
            fkid: agentFkid,
            fkname: agentFkname,
            mobile: mobile
        });
    } else {
        $("#modalInvalid").modal();
    }
});

// ? Botão para realizar disparo Ativo
$('#btnchamar').on('click', function () {
    // Emite evento socket
    socket.emit('bi-mailativo', { tipo: '1' });
});

// ? Media Upload (Image)
$('#inseririmg').change(function () {
    console.log('> Upload de Imagem');
    uploadFile(inserirdoc.files[0], 'image');
});

// ? Media Upload (Video)
$('#inserirvid').change(function () {
    console.log('> Upload de Video');
    uploadFile(inserirdoc.files[0], 'video');
});

// ? Media Upload (Audio)
$('#inseriraudio').change(function () {
    console.log('> Upload de Audio');
    uploadFile(inserirdoc.files[0], 'audio');
});

// ? Media Upload (Document)
$('#inserirdoc').change(function () {
    console.log('> Upload de Documento');
    uploadFile(inserirdoc.files[0], 'document');
});