// ? Constants
const socket = io.connect();
const agentFkid = sessionStorage.getItem('fkid');
const agentFkname = sessionStorage.getItem('fkname');
const appCdnUpload = 'https://cdn.ubicuacloud.com/upload';
const appCdnFile = 'https://cdn.ubicuacloud.com/file/';
const appCdnBase = 'https://cdn.ubicuacloud.com/base64/';
const inUsersDisplay = $('#ulConversation');
const outUsersDisplay = $('#ulConversation2');
const chatScreen = $('#chat11');

// ? Global Var's
let currentUserMobile;
let timeout = setTimeout(function () {
    socket.emit('bi-usertimeout', {
        fkid: agentFkid,
        fkname: agentFkname,
    })
}, 4200000);

// ? Document
$(document).on('ready', function () {
    // Set Operator name and CPF Mask
    $('#lboperador').text(agentFkname);
    $('#iCPF').mask('999.999.999-99');
    // Check for Login Info
    if (agentFkname == null || agentFkid == null) {
        window.location = "index.html"
    }
});

// ?
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

// ?
socket.on('connect', function () {
    console.log('> Conectado')
    socket.emit('bi-atendein', { fkid: agentFkid });
});
// ?
socket.on('disconnect', function () {
    console.log('> Desconectado');
});
// ?
socket.on("force_disconnect", function () {
    console.log('> Logout forçado');
    logoutAgent();
});
// ?
socket.on('bi-usertimeout', function (payload) {
    console.log('> Logout por timeout');
    logoutAgent();
});

// ?
socket.on('bi-answer_new_queue', async function (payload) {
    console.log('> Atendendo Fila');
    // Answer New Queue
    await answerNewQueue(payload)
    // Sleep and execute bi-atendein for History purposes
    await sleep(4000)
    socket.emit('bi-atendein', { fkid: agentFkid });
});
// !
socket.on('bi-answer_new_prior', async function (payload) {
    console.log('> Atendendo Fila Prioritaria');
    // Answer New Queue
    await answerNewQueue(payload)
    // Sleep and execute bi-atendein for History purposes
    await sleep(4000)
    socket.emit('bi-atendein', { fkid: agentFkid });
});
// ?
socket.on('bi-atendein', async function (payload) {
    console.log('> Buscando atendimentos e historicos');
    if (payload.logs.length > 0 && payload.contacts.length > 0) {
        let logs = JSON.parse(payload.logs);
        let contacts = JSON.parse(payload.contacts);
        await arrangeUserChat(contacts)
        await histmsg(contacts, logs);
    }
    socket.emit('add user', { fkid: agentFkid, fkname: agentFkname });
});
// ?
socket.on('bi-close_chat', async function (payload) {
    console.log('> Encerra chat');
    await closeChat(payload.mobile)
});

// ?
socket.on('sentinel_clients_queue', function (payload) {
    // Atualização das Filas
    let filaPrior = filaNorm = 0;
    for (i = 0; i < payload.length; i++) {
        // Preenche fila Prioritaria
        if (payload[i].tabela == 'filaPrior') {
            filaPrior = payload[i].total
        }
        // Preenche fila Normal
        if (payload[i].tabela == 'filain') { 
            filaNorm = payload[i].total 
        }
    }
    // Atualiza os componentes da Fila
    $('#filain').text(filaNorm);
    $('#filaPrior').text(filaPrior);
    $('#nvatend').removeClass('form-loading');
    $('#nvatendPrior').removeClass('form-loading');
});

// !
// !
// !

// ?
socket.on('bi-transferagent', async function (payload) {
    console.log('> Status from Transfer Agent');
    if (payload.status == 0) {
        $.growl.error({
            title: "Atenção",
            message: "Transferência do Contato <strong>" + payload.mobile + "</strong> Não Realizada, Atendente <strong>" + payload.fkname + "</strong> Não se Encontra mais Online !"
        });
    } else {
        $.growl.success({
            title: "Aviso",
            message: "Transferência do Contato <strong>" + payload.mobile + "</strong> Realizada com Sucesso !"
        });
        await closeChat(payload.mobile)
    }
});

// TODO:
socket.on("get_cliInfo", function (payload) {
    $("#iNomeTx").val(payload.nome)
    $("#iCpfTx").val(payload.cpf)
    $("#iPilarTx").val(payload.pilar)
    $("#iModalidadeTx").val(payload.modalidade)
    $('#myModalInfo').modal();
    //console.log(payload)
});

// ?
socket.on('bi-transferok', function (payload) {
    let numac = payload.mobile;
    let atendir = payload.atendir;
    let atendircolor;
    if (atendir == "in") {
        atendir = "ion-reply";
        atendircolor = 'color: red';
    } else if (atendir == "out") {
        atendir = "ion-forward";
        atendircolor = 'color: green';
    }
    let menu = modalpis('', payload.mobile, payload.account, payload.photo, atendir, atendircolor);
    // Append Display in User list
    if (atendir == 'in') { inUsersDisplay.append(menu) } else if (atendir == 'out') { outUsersDisplay.append(menu) }
    let menu2 = '';
    menu2 += chatbox1(payload.mobile);
    if (document.getElementById("chat" + payload.mobile) == null) {
        chatScreen.append(menu2);
    }
    if (payload.account != null) {
        $('#ac' + numac).show();
    } else {
        $('#ac' + numac).hide();
    }
    socket.emit('bi-transferok', { mobile: payload.mobile });
});

// TODO:
socket.on('receive_register', function (payload) {

    let json = payload;
    let mobid = json.mobile;
    $('#a' + mobid).text(json.name);
    $('#namchat11').text(json.name);
    if (json.photo != null) {
        $("#imgchat11").attr('src', appCdnFile + json.photo);
    }
    if (json.account != null) {
    }
});

// ?
socket.on('bi-statusen', function (payload) {
    let _statusen = JSON.parse(payload);
    $("#icbStatus").empty().append("<option value='0'>Selecione</option>");
    for (i = 0; i < _statusen.length; i++) {
        let _option = document.createElement('option');
        _option.value = _statusen[i].id;
        _option.text = _statusen[i].descricao;
        _option.id = _statusen[i].pedido;
        $("#icbStatus").append(_option);
    }
    $('#modalEncerrar').modal();
});

// TODO:
socket.on('bi-lasthistory', function (payload) {
    //console.log(payload)
    if (payload.contacts.length != 0) {
        let logs = JSON.parse(payload.logs);
        let contacts = JSON.parse(payload.contacts);
        onchatmsg(contacts, logs, 'chathistory');
        $('#modalHistorico').modal();
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Não Há Nenhum Histórico Desse Contato!";
        callWarningModal(modalTitle, modalDesc)
    }
});

// ?
socket.on('sentinel_clients_alive', function (payload) {
    let _atendentesonline = JSON.parse(payload);
    $("#cbatendentesonline").empty().append("<option value='0'>Selecione</option>");
    for (i = 0; i < _atendentesonline.length; i++) {
        if (_atendentesonline[i].fkid && _atendentesonline[i].fkid.length == 36) {
            if (agentFkid != _atendentesonline[i].fkid) {
                let _option = document.createElement('option');
                _option.value = _atendentesonline[i].fkid;
                _option.text = _atendentesonline[i].fkname;
                $("#cbatendentesonline").append(_option);
            }
        }
    }
});

// TODO:
socket.on('receive_chat', function (payload) {

    let msg = payload;
    let btype = msg.message_type;
    let d = new Date();
    let bhour = d.getHours();
    let bminute = d.getMinutes();
    if (bminute < 10) {
        bminute = "0" + bminute;
    }

    let btime = '' + bhour + ':' + bminute + '';

    if (btype == 'chat') {
        bmessage = msg.body_text;
        let contact_uid = msg.contact_uid;

        let menu = '';
        menu += msgtxtl(bmessage, contact_uid, btime);

        $('#chat' + contact_uid).append(menu);
        pageScroll();
        let notifica = $('#s' + contact_uid).text();
        let audio = new Audio('assets/aud/tethys.mp3');
        audio.play();
        notifica = Number(notifica) + 1;
        $('#s' + contact_uid).text(notifica);
        $('#s' + contact_uid).fadeIn(1);
    } else if (btype == 'image') {
        let bmessage = msg.body_url;
        let contact_uid = msg.contact_uid;
        let bcaption = msg.body_caption;

        if (bcaption != '') {
            let menu = '';
            menu += previewimgtx(msg.body_url, contact_uid, btime, bcaption);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            let notifica = $('#s' + contact_uid).text();
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            let menu = '';
            menu += previewimg(msg.body_url, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            let notifica = $('#s' + contact_uid).text();
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    } else if (btype == 'video') {
        bmessage = msg.body_url;
        let contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;
        if (bcaption != '') {
            let menu = '';
            menu += previewvidtx(bmessage, bcaption, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            let notifica = $('#s' + contact_uid).text();
            //console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            let menu = '';
            menu += previewvid(bmessage, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            let notifica = $('#s' + contact_uid).text();
            //console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    } else if (btype == 'ptt') {
        bmessage = msg.body_url;
        let contact_uid = msg.contact_uid;
        let menu = '';
        menu += previewaud(bmessage, contact_uid, btime);
        $('#chat' + contact_uid).append(menu);
        pageScroll();
        let notifica = $('#s' + contact_uid).text();
        //console.log(notifica);
        notifica = Number(notifica) + 1;
        $('#s' + contact_uid).text(notifica);
        $('#s' + contact_uid).fadeIn(1);
    } else if (btype == 'audio') {
        bmessage = msg.body_url;
        let contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;

        if (bcaption != '') {
            let menu = '';
            menu += previewaudtx(bmessage, bcaption, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);

            pageScroll();

            let notifica = $('#s' + contact_uid).text();
            //console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            let menu = '';
            menu += previewaud(bmessage, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);

            pageScroll();

            let notifica = $('#s' + contact_uid).text();
            //console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    } else if (btype == 'document') {
        bmessage = msg.body_url;
        let contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;

        if (bcaption != '') {
            let menu = '';
            menu += previewdoctx(bmessage, bcaption, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            let notifica = $('#s' + contact_uid).text();
            //console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            let menu = '';
            menu += previewdoc(bmessage, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            let notifica = $('#s' + contact_uid).text();
            //console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    }
});

// TODO:
socket.on('bi-mailativo', function (payload) {
    if (payload != "" && payload != null) {
        let data = JSON.parse(payload);
        let dataSet = [];
        for (i = 0; data.length > i; i++) {
            let callBtn = '<button type="button" class="btn btn-primary" onclick="callMobile(' + data[i].mobile + ')"><span class="ion-person-add"></span>&nbsp;&nbsp;Chamar</button>';
            let row = [data[i].nome, data[i].banco, data[i].cpf, data[i].mobile, callBtn]
            dataSet.push(row);
        }
        //console.log(dataSet);
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
        $("#mailModal").modal();
    } else {
        $("#modalNoMail").modal("toggle");
    }
});

// TODO:
socket.on("bi-atendemail", function (payload) {
    //console.log(payload);
    if (payload.status == '200') {
        socket.emit('bi-atendein', { fkid: agentFkid });
    } else {
        $("#modalAtende").modal("toggle")
    }
});

// TODO:
socket.on("bi-callinput", function (payload) {
    //console.log(payload);
    if (payload.status == '200') {
        socket.emit('bi-atendein', { fkid: agentFkid });
    } else {
        $("#modalPlataforma").modal("toggle")
    }
});

// !
socket.on('bi-find_register', function (payload) {
    //console.log(payload);
    if (payload.name == null) {
        $('#modalAlertTitle').text('Aviso');
        $('#modalAlertText').text('Cadastre o Nome e Sobrenome do Cliente!');
        $('#modalAlert').modal();
    } else {
        let _atendir;
        if ($("#reply" + currentUserMobile).attr('class') == "ion-forward") {
            _atendir = "out";
        } else if ($("#reply" + currentUserMobile).attr('class') == "ion-reply") {
            _atendir = "in";
        }
        let payload = {
            mobile: currentUserMobile,
            status: $('#icbStatus').val(),
            cnpj: $('#iCPF').val().replace(/[^\d]+/g, ''),
            atendir: _atendir,
            pilar: $('#iPilar option:selected').val(),
            modalidade: $('#iModalidade option:selected').val(),
            protocolo: $('#iPROTOCOLO').val(),
            banco: $('#iBANCO').val()
        }
        $('#contatos').addClass('form-loading');
        socket.emit('bi-close_chat', payload);
        $('#modalEncerrar').modal('hide');
    }
})