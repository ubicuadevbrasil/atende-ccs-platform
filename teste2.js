var json;
var aton = 0;
var socket = io.connect('https://ubc.ex-aluno-edu.com.br/');
var idcontato = 0;
var appwa = 'https://cdn.ubicuacloud.com/upload';
var operador = sessionStorage.getItem('fkname');
var msg = "";
var btype = "";
var bmessage = "";
var bcaption = "";
var contactuid = "";
var msgz = 0;
var hashimg = "";
var reshashimg;
var finhashimg;
var hashvid = "";
var reshashvid;
var finhashvid;
var hashaudio = "";
var reshashaudio;
var finhashaudio;
var hashdoc = "";
var reshashdoc;
var finhashdoc;
var nomedoc;
var contPedidos;
var allClients = [];

if (sessionStorage.getItem('fkname') == null) {
    window.location = "index.html";
}

socket.on('connect', function () {
    console.log('------------------------CONECTADO-----CONECTADO------------------------------------');
    socket.emit('bi-atendein', { fkid: sessionStorage.getItem('fkid') });
});

socket.on('disconnect', function () {
    console.log('------------------------DESCONECTADO-----DESCONECTADO------------------------------');
});

socket.on("force_disconnect", function () {
    onbtnlogout();
});

socket.on("bi-atendemail", function (payload) {
    console.log(payload);
    if (payload.status == '200') {
        socket.emit('bi-atendein', { fkid: sessionStorage.getItem('fkid') });
    } else {
        $("#modalAtende").modal("toggle")
    }
});

socket.on('sentinel_clients_queue', function (payload) {
    var json = payload;
    if (payload != null) {
        if (payload[1].total > 0) {
            var audio = new Audio('assets/aud/tethys.mp3');
            //audio.play();
        }
    }
    $('#filain').text(payload[1].total);
    $('#nvatend').removeClass('form-loading');
});

socket.on('bi-close_chat', function (payload) {

    var json = payload;
    $('#contatos').removeClass('form-loading');
    $('#id' + json.mobile).remove();
    $('#chat' + json.mobile).remove();
    $("#imgchat11").attr('src', '');
    $('#namchat11').text('');

    contactuid = "";
    hidedivs();
    $('#newchat').fadeIn(1);
    $('#contatos').removeClass('form-loading');
});

socket.on('bi-transferagent', function (payload) {

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
        // Remover contato da lista
        $('#contatos').removeClass('form-loading');
        $('#id' + payload.mobile).remove();
        $('#chat' + payload.mobile).remove();
        $("#imgchat11").attr('src', '');
        $('#namchat11').text('');
        contactuid = "";
        hidedivs();
        $('#newchat').fadeIn(1);
        $('#contatos').removeClass('form-loading');
    }
});

socket.on('bi-transferok', function (payload) {
    console.log(payload);
    idcontato = idcontato + 1;
    var numac = payload.mobile;
    var atendir = payload.atendir;
    if (atendir == "in") {
        atendir = "ion-reply";
        atendircolor = 'color: red';
    } else if (atendir == "out") {
        atendir = "ion-forward";
        atendircolor = 'color: green';
    }
    var menu = '';
    menu += modalpis('', payload.mobile, payload.account, payload.photo, atendir, atendircolor);
    $('#ulConversation').append(menu);
    var menu2 = '';
    menu2 += chatbox1(payload.mobile);
    if (document.getElementById("chat" + payload.mobile) == null) {
        $('#chat11').append(menu2);
    }
    if (payload.account != null) {
        $('#ac' + numac).show();
    } else {
        $('#ac' + numac).hide();
    }
    socket.emit('bi-transferok', { mobile: payload.mobile });
});

socket.on('receive_register', function (payload) {
    var json = payload;
    var mobid = json.mobile;
    $('#a' + mobid).text(json.name);
    $('#namchat11').text(json.name);
    if (json.photo != null) {
        $("#imgchat11").attr('src', 'https://cdn.ubicuacloud.com/file/' + json.photo);
    }
    if (json.account != null) {
    }
});

socket.on('bi-mailativo', function (payload) {
    if (payload != "" && payload != null) {
        var data = JSON.parse(payload);
        var dataSet = [];
        for (i = 0; data.length > i; i++) {
            var callBtn = '<button type="button" class="btn btn-primary" onclick="atenderMailing(' + data[i].mobile + ')"><span class="ion-person-add"></span>&nbsp;&nbsp;Chamar</button>';
            var sellBtn = '<button id="clibtn' + data[i].mobile + '" type="button" class="btn btn-success" onclick="addClientToAll(' + data[i].mobile + ')">Selecionar</button>'; var row = [data[i].nome, data[i].nomefantasia, data[i].flagcampanha, data[i].cnpj, data[i].mobile, callBtn, sellBtn]
            dataSet.push(row);
        }
        console.log(dataSet);
        $('#table_id').dataTable({
            "destroy": true,
            "autoWidth": true,
            "pageLength": 10,
            "lengthChange": false,
            "data": dataSet,
            "ordering": false,
            columns: [
                { title: "Nome" },
                { title: "Nome Fantasia" },
                { title: "Flag Campanha" },
                { title: "Cnpj" },
                { title: "Numero" },
                { title: "Chamar" },
                { title: "Selecionar" }
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

socket.on('bi-answer_new_queue', function (payload) {
    idcontato = idcontato + 1;
    console.log(payload);
    var numac = payload.mobile;
    var menu = '';
    var atendir;
    menu += modalpis('', payload.mobile, payload.account, payload.photo, 'ion-reply', 'color:red');
    $('#ulConversation').append(menu);
    var menu2 = '';
    menu2 += chatbox1(payload.mobile);
    if (document.getElementById("chat" + payload.mobile) == null) {
        $('#chat11').append(menu2);
    }
    if (payload.account != null) {
        $('#ac' + numac).show();
    } else {
        $('#ac' + numac).hide();
    }
});

socket.on('bi-atendein', function (payload) {

    console.log(payload);
    if (payload.logs.length > 0 && payload.contacts.length > 0) {
        var logs = JSON.parse(payload.logs);
        var contacts = JSON.parse(payload.contacts);
        var direction;
        var cx = contacts.length;
        var lx = logs.length;
        for (i = 0; i < cx; i++) {
            var _flagcamp = contacts[i].flagcampanha;
            var _cnpj = contacts[i].cnpj;
            var _tipo = contacts[i].tipo;
            var atendir;
            console.log(_tipo)
            if (_tipo == 1) {
                _tipo = "Multi";
            } else if (_tipo == 2) {
                _tipo = "Recorrente";
            }
            if (contacts[i].atendir == "in") {
                atendir = "ion-reply";
                atendircolor = 'color: red';
                direction = "reply";
            } else if (contacts[i].atendir == "out") {
                atendir = "ion-forward";
                atendircolor = 'color: green';
                direction = "foward";
            }
            $('#chat' + contacts[i].mobile).empty();

            if (contacts[i].account != null) {
                if (document.getElementById("id" + contacts[i].mobile) == null) {
                    var menu = '';
                    menu += modalpis('', contacts[i].mobile, contacts[i].account, contacts[i].photo, atendir, atendircolor, direction, _tipo, _cnpj, _flagcamp);
                    $('#ulConversation').append(menu);
                }
                var menu2 = '';
                menu2 += chatbox1(contacts[i].mobile);
                if (document.getElementById("chat" + contacts[i].mobile) == null) {
                    $('#chat11').append(menu2);
                }
            } else {
                if (document.getElementById("id" + contacts[i].mobile) == null) {
                    var menu = '';
                    menu += modalpis('', contacts[i].mobile, '', contacts[i].photo, atendir, atendircolor, direction, _tipo, _cnpj, _flagcamp);
                    $('#ulConversation').append(menu);
                }
                var menu2 = '';
                menu2 += chatbox1(contacts[i].mobile);
                if (document.getElementById("chat" + contacts[i].mobile) == null) {
                    $('#chat11').append(menu2);
                }
            }

            if (contacts[i].account != null) {
                $('#ac' + contacts[i].mobile).show();
            } else {
                $('#ac' + contacts[i].mobile).hide();
            }
        }
        histmsg(contacts, logs);

    }
    socket.emit('add user', { fkid: sessionStorage.getItem('fkid'), fkname: sessionStorage.getItem('fkname') });
});

socket.on('bi-statusen', function (payload) {
    var _statusen = JSON.parse(payload);
    $("#icbStatus").empty().append("<option value='0'>Selecione</option>");
    for (i = 0; i < _statusen.length; i++) {
        var _option = document.createElement('option');
        _option.value = _statusen[i].id;
        _option.text = _statusen[i].descricao;
        _option.id = _statusen[i].pedido;
        $("#icbStatus").append(_option);
    }
    $('#modalEncerrar').modal();
});

socket.on('bi-lasthistory', function (payload) {
    if (payload.contacts.length != 0) {
        var logs = JSON.parse(payload.logs);
        var contacts = JSON.parse(payload.contacts);
        console.log(logs);
        onchatmsg(contacts, logs, 'chathistory');
        $('#modalHistorico').modal();
    } else {
        $('#myModal9').modal();
    }
});

socket.on('waendpoint', function (payload) {
    if (payload.server === "LON") {
        $('#iwa').css({ color: "green" });
        $('#iwa').prop('title', '');
    } else if (payload.server === "SAO") {
        $('#iwa').css({ color: "#ffae42" });
        $('#iwa').prop('title', '');
    } else {
        $('#iwa').css({ color: "red" });
        $('#iwa').prop('title', 'ATENÇÃO: No Momento Estamos Recebendo Apenas Mensagens de Texto !');
    }
});

socket.on('sentinel_clients_alive', function (payload) {
    if (aton == 0) {
        var _atendentesonline = JSON.parse(payload);
        $("#cbatendentesonline").empty().append("<option value='0'>Selecione</option>");
        for (i = 0; i < _atendentesonline.length; i++) {
            if (_atendentesonline[i].fkid.length == 36) {
                if (sessionStorage.getItem('fkid') != _atendentesonline[i].fkid) {
                    var _option = document.createElement('option');
                    _option.value = _atendentesonline[i].fkid;
                    _option.text = _atendentesonline[i].fkname;
                    $("#cbatendentesonline").append(_option);
                }
            }
        }
    }
});

socket.on('receive_chat', function (payload) {
    console.log(payload);
    msg = payload;
    btype = msg.message_type;
    var d = new Date();
    var bhour = d.getHours();
    var bminute = d.getMinutes();
    if (bminute < 10) {
        bminute = "0" + bminute;
    }

    var btime = '' + bhour + ':' + bminute + '';

    if (btype == 'chat') {
        bmessage = msg.body_text;
        var contact_uid = msg.contact_uid;

        var menu = '';
        menu += msgtxtl(bmessage, contact_uid, btime);

        $('#chat' + contact_uid).append(menu);
        pageScroll();
        var notifica = $('#s' + contact_uid).text();
        var audio = new Audio('assets/aud/tethys.mp3');
        //audio.play();
        notifica = Number(notifica) + 1;
        $('#s' + contact_uid).text(notifica);
        $('#s' + contact_uid).fadeIn(1);
    } else if (btype == 'image') {
        bmessage = msg.body_url;
        var contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;

        if (bcaption != '') {
            var menu = '';
            menu += previewimgtx(msg.body_url, contact_uid, btime, bcaption);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            var notifica = $('#s' + contact_uid).text();
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            var menu = '';
            menu += previewimg(msg.body_url, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            var notifica = $('#s' + contact_uid).text();
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    } else if (btype == 'video') {
        bmessage = msg.body_url;
        var contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;
        if (bcaption != '') {
            var menu = '';
            menu += previewvidtx(bmessage, bcaption, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            var notifica = $('#s' + contact_uid).text();
            console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            var menu = '';
            menu += previewvid(bmessage, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            var notifica = $('#s' + contact_uid).text();
            console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    } else if (btype == 'ptt') {
        bmessage = msg.body_url;
        var contact_uid = msg.contact_uid;
        var menu = '';
        menu += previewaud(bmessage, contact_uid, btime);
        $('#chat' + contact_uid).append(menu);
        pageScroll();
        var notifica = $('#s' + contact_uid).text();
        console.log(notifica);
        notifica = Number(notifica) + 1;
        $('#s' + contact_uid).text(notifica);
        $('#s' + contact_uid).fadeIn(1);
    } else if (btype == 'audio') {
        bmessage = msg.body_url;
        var contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;

        if (bcaption != '') {
            var menu = '';
            menu += previewaudtx(bmessage, bcaption, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);

            pageScroll();

            var notifica = $('#s' + contact_uid).text();
            console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            var menu = '';
            menu += previewaud(bmessage, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);

            pageScroll();

            var notifica = $('#s' + contact_uid).text();
            console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    } else if (btype == 'document') {
        bmessage = msg.body_url;
        var contact_uid = msg.contact_uid;
        bcaption = msg.body_caption;

        if (bcaption != '') {
            var menu = '';
            menu += previewdoctx(bmessage, bcaption, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            var notifica = $('#s' + contact_uid).text();
            console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        } else {
            var menu = '';
            menu += previewdoc(bmessage, contact_uid, btime);
            $('#chat' + contact_uid).append(menu);
            pageScroll();
            var notifica = $('#s' + contact_uid).text();
            console.log(notifica);
            notifica = Number(notifica) + 1;
            $('#s' + contact_uid).text(notifica);
            $('#s' + contact_uid).fadeIn(1);
        }
    }
});

function atenderMailing(mobile) {
    $("#mailModal").modal('hide');
    var payload = {
        fkid: sessionStorage.getItem('fkid'),
        fkname: sessionStorage.getItem('fkname'),
        mobile: mobile
    };
    socket.emit('bi-atendemail', payload);
}

function onbtnlogout() {
    sessionStorage.clear();
    socket.disconnect();
    window.location = "index.html";
}

function uplimg() {
    var file = inseririmg.files[0];
    console.log(">>>> Enviando novo img...");
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    console.log("");
    uploadFileimg(inseririmg.files[0]);

}

function uploadFileimg(file) {
    $('#modalloading').addClass('form-loading');
    var url = appwa;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Every thing ok, file uploaded
            console.log(xhr.responseText); // handle response.
            hashimg = xhr.responseText;
            reshashimg = JSON.parse(hashimg);
            finhashimg = reshashimg.hashfile;

            var imgtx = {
                mobile: contactuid,
                type: "image",
                hashfile: finhashimg,
                descfile: ""
            }

            console.log(imgtx);
            socket.emit('send_media', imgtx);

            $('#modalloading').removeClass('form-loading');

            $('#myModal3').modal('hide');

            var d = new Date();
            var bhour = d.getHours();
            var bminute = d.getMinutes();

            if (bminute < 10) {
                bminute = "0" + bminute;
            }

            var btime = '' + bhour + ':' + bminute + '';

            var menu = '';
            menu += previewimgr('https://cdn.ubicuacloud.com/file/' + finhashimg, operador, btime);

            $('#chat' + contactuid).append(menu);

            pageScroll();

        }
    };
    fd.append("inseririmg", file);
    console.log(fd);
    xhr.send(fd);
    $('#inseririmg').val('');
}

function uplvid() {
    var file = inserirvid.files[0];
    console.log(">>>> Enviando novo video...");
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    console.log("");
    uploadFilevid(inserirvid.files[0]);

}

function uploadFilevid(file) {
    $('#modalloading').addClass('form-loading');
    var url = appwa;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Every thing ok, file uploaded
            console.log(xhr.responseText); // handle response.
            hashvid = xhr.responseText;
            reshashvid = JSON.parse(hashvid);
            finhashvid = reshashvid.hashfile;

            var vidtx = {
                mobile: contactuid,
                type: "video",
                hashfile: finhashvid,
                descfile: ""
            }

            console.log(vidtx);
            socket.emit('send_media', vidtx);

            $('#modalloading').removeClass('form-loading');

            $('#myModal3').modal('hide');

            var d = new Date();
            var bhour = d.getHours();
            var bminute = d.getMinutes();

            if (bminute < 10) {
                bminute = "0" + bminute;
            }

            var btime = '' + bhour + ':' + bminute + '';


            var menu = '';
            menu += previewvidr('https://cdn.ubicuacloud.com/file/' + finhashvid, operador, btime);

            $('#chat' + contactuid).append(menu);

            pageScroll();

        }
    };
    fd.append("inserirvid", file);
    xhr.send(fd);
    $('#inserirvid').val('');
}

function uplaudio() {
    var file = inseriraudio.files[0];
    console.log(">>>> Enviando novo audio...");
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    console.log("");
    uploadFileaudio(inseriraudio.files[0]);

}

function uploadFileaudio(file) {
    $('#modalloading').addClass('form-loading');
    var url = appwa;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Every thing ok, file uploaded
            console.log(xhr.responseText); // handle response.
            hashaudio = xhr.responseText;
            reshashaudio = JSON.parse(hashaudio);
            finhashaudio = reshashaudio.hashfile;

            var audiotx = {
                mobile: contactuid,
                type: "audio",
                hashfile: finhashaudio,
                descfile: ""
            }

            console.log(audiotx);
            socket.emit('send_media', audiotx);

            $('#modalloading').removeClass('form-loading');

            $('#myModal3').modal('hide');

            var d = new Date();
            var bhour = d.getHours();
            var bminute = d.getMinutes();

            if (bminute < 10) {
                bminute = "0" + bminute;
            }

            var btime = '' + bhour + ':' + bminute + '';


            var menu = '';
            menu += previewaudr('https://cdn.ubicuacloud.com/file/' + finhashaudio, operador, btime);

            $('#chat' + contactuid).append(menu);

            pageScroll();

        }
    };
    fd.append("inseriraudio", file);
    xhr.send(fd);
    $('#inseriraudio').val('');
}

function upldoc() {
    var file = inserirdoc.files[0];
    console.log(">>>> Enviando novo doc...");
    console.log("name : " + file.name);
    nomedoc = file.name;
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    console.log("");
    uploadFiledoc(inserirdoc.files[0]);

}

function uploadFiledoc(file) {
    $('#modalloading').addClass('form-loading');
    var url = appwa;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Every thing ok, file uploaded
            console.log(xhr.responseText); // handle response.
            hashdoc = xhr.responseText;
            reshashdoc = JSON.parse(hashdoc);
            finhashdoc = reshashdoc.hashfile;

            var doctx = {
                mobile: contactuid,
                type: "document",
                hashfile: finhashdoc,
                descfile: nomedoc
            }

            console.log(doctx);
            socket.emit('send_media', doctx);

            $('#modalloading').removeClass('form-loading');

            $('#myModal3').modal('hide');

            var d = new Date();
            var bhour = d.getHours();
            var bminute = d.getMinutes();

            if (bminute < 10) {
                bminute = "0" + bminute;
            }

            var btime = '' + bhour + ':' + bminute + '';


            var menu = '';
            menu += previewdoctxr('https://cdn.ubicuacloud.com/file/' + finhashdoc, nomedoc, operador, btime);

            $('#chat' + contactuid).append(menu);

            pageScroll();

        }
    };
    fd.append("inserirdoc", file);
    xhr.send(fd);
    $('#inserirdoc').val('');
}

function clearTable() {
    contPedidos = 0;
    $("#myBoxgrid").removeClass("boxGrid");
    $("#bdRightBox").removeClass("bdRight");
    document.getElementById("listaPedido").style.display = "none";
    document.getElementById("novoPedido").style.display = "none";
    document.getElementById("boxContent").style.width = "600px";
    $('#myPedidos').empty();
}

function delPedido(data) {
    contPedidos = contPedidos - 1;
    $('#Pedido' + data).remove();
}

function tableJson() {
    var table = $('#myTable').tableToJSON({ onlyColumns: [0, 1, 2] });
    console.log(table);
    return table;
}

function addClientToAll(mobile) {
    if ($("#clibtn" + mobile).hasClass("btn-success") == true) {
        $("#clibtn" + mobile).addClass('btn-warning');
        $("#clibtn" + mobile).removeClass('btn-success');
        allClients.push({
            'mobile': mobile
        })
    } else if ($("#clibtn" + mobile).hasClass("btn-warning") == true) {
        $("#clibtn" + mobile).addClass('btn-success');
        $("#clibtn" + mobile).removeClass('btn-warning');
        for (i = 0; i < allClients.length; i++) {
            if (allClients[i].mobile == mobile) {
                allClients.splice(i, 1);
            }
        }
    }
}

$('#lboperador').text(operador);

$('#iCNPJ').mask('99.999.999/9999-99');

$('#imgins').click(function () {
    $('#inseririmg').trigger('click');
});

$('#vidins').click(function () {
    $('#inserirvid').trigger('click');
});

$('#audins').click(function () {
    $('#inseriraudio').trigger('click');
});

$('#docins').click(function () {
    $('#inserirdoc').trigger('click');
});

$("#callAll").on("click", function () {
    for (i = 0; i < allClients.length; i++) {
        var payload = {
            fkid: sessionStorage.getItem('fkid'),
            fkname: sessionStorage.getItem('fkname'),
            mobile: allClients[i].mobile
        };
        socket.emit('bi-atendemail', payload);
    }
});

$("#btnlogout").on("click", function () {
    onbtnlogout();
});

$("#addfila").on("click", function () {
    socket.emit('zerafila');
});

$("#nvatend").on("click", function () {

    var _filain = $('#filain').text();
    if (_filain > 0) {
        payload = {
            fkid: sessionStorage.getItem('fkid'),
            fkname: sessionStorage.getItem('fkname')
        };
        socket.emit('bi-answer_new_queue', payload);
        $('#nvatend').addClass('form-loading');
    } else {
        $('#myModal').modal();
    }
});

$("#sendmsgtxt").on("click", function () {

    var msgtext = $('#inputmsgtxt').val();
    if (contactuid != "") {
        if (msgtext != '') {
            var payload = {
                mobile: contactuid,
                type: "chat",
                message: "" + msgtext + ""
            }
            socket.emit('send_chat', payload);

            var d = new Date();
            var bhour = d.getHours();
            var bminute = d.getMinutes();
            if (bminute < 10) {
                bminute = "0" + bminute;
            }
            var btime = '' + bhour + ':' + bminute + '';
            var menu = '';
            menu += msgtxtr(payload.message, operador, btime);
            $('#chat' + contactuid).append(menu);
            pageScroll();
            $('#inputmsgtxt').val(null);
        } else {
            $('#myModal5').modal();
        }
    } else {
        $('#myModal6').modal();
    }
});

$('#btnconsulta').on('click', function () {
    window.open('consulta.html');
});

$('#btnchamar').on('click', function () {
    allClients = []
    $("#myModal9").modal();
});

$('#btnMulti').on('click', function () {
    var payload = {
        tipo: '1'
    };
    socket.emit('bi-mailativo', payload);
});

$('#btnHeavy').on('click', function () {
    var payload = {
        tipo: '2'
    };
    socket.emit('bi-mailativo', payload);
});

$('#btncadastro').on('click', function () {
    if (contactuid != "") {
        $('#modalCadastro').modal();
        $("#cadsInput").val("");
        /*bootbox.prompt({
            title: 'Cadastro',
            callback: await function (result) {
                if (result == null) {
                    alert('Registro Cancelado');
                } else if (result != null) {
                    console.log(result);
                    var json2 = {
                        mobile: contactuid,
                        name: result
                    }
                    console.log(json2);
                    socket.emit('send_register', json2);
                }
            },
        });*/
    } else {
        $('#myModal7').modal();
    }

});

$('#cadsBtn').on('click', function () {
    var json2 = {
        mobile: contactuid,
        name: $("#cadsInput").val()
    }
    socket.emit('send_register', json2);
});

$('#confirmatra').on('click', function () {
    var _opsel = $('#cbatendentesonline option:selected').val();
    if (_opsel == "0") {
        alert('Atendente Inválido !');
    } else {
        var atendirid = document.getElementById("reply" + contactuid).className;
        var atendircolor = document.getElementById("reply" + contactuid).style.property
        var atendir;
        if (atendirid == "ion-forward") {
            atendir = 'out';
        } else if (atendirid == "ion-reply") {
            atendir = 'in';
        }
        var payload = {
            mobile: contactuid,
            fkid: $('#cbatendentesonline option:selected').val(),
            fkname: $('#cbatendentesonline option:selected').text(),
            message: "<strong>Atendimento Transferido para: " + $('#cbatendentesonline option:selected').text() + "</strong>",
            atendir: atendir
        }
        socket.emit('bi-transferagent', payload);
        aton = 0;
        $('#modalTransferir').modal('hide');
    }
});

$('#cancelartra').on('click', function () {
    aton = 0;
});

$('#fechartra').on('click', function () {
    aton = 0;
});

$('#btntransferir').on('click', function () {

    if (contactuid != "") {
        if ($('#cbatendentesonline').children('option').length < 2) {
            $('#myModal8').modal();
        } else {
            aton = 1;
            $('#modalTransferir').modal();
        }
    } else {
        $('#myModal7').modal();
    }
});

$('#btnhistorico').on('click', function () {

    if (contactuid != "") {
        $("#chathistory").empty();
        var payload = {
            mobile: contactuid
        }
        socket.emit('bi-lasthistory', payload);
    } else {
        $('#myModal7').modal();
    }
});

$('#btnencerrar').on('click', function () {
    clearTable();

    if (contactuid != "") {
        $("#icbSegmento").empty().append("<option value=''>Segmento</option><option>CHC</option><option>GEM</option><option>ONE</option><option>OUTROS</option>");
        $("#iCNPJ").val('');
        $("#iPedido").val('');
        $("#iValor").val('');
        socket.emit('bi-statusen');
    } else {
        $('#myModal7').modal();
    }

});

$("#btn").on("click", function () {

    console.log('opa');
    $("#ulConversation").html(

        $("#ulConversation").children("li").sort(function (a, b) {

            return $(a).val() - $(b).val();

        })

    );

});

$('#inseririmg').change(function () {
    console.log('bate');
    var file = this.files[0];
    // This code is only for demo ...
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    uplimg();
});

$('#inserirvid').change(function () {
    console.log('bate');
    var file = this.files[0];
    // This code is only for demo ...
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    uplvid();
});

$('#addPedido').click(function () {
    var _segmento = $('#icbSegmento').val();
    var _pedido = $('#iPedido').val();
    var _valor = $('#iValor').val();

    if (_segmento != "" && _pedido != "" && _valor != "") {
        document.getElementById("fillWarning").style.display = "none";
        contPedidos = contPedidos + 1;
        var linhaTable = "<tr id='Pedido" + contPedidos + "'>";
        linhaTable += "<td>" + _segmento + "</td>";
        linhaTable += "<td>" + _pedido + "</td>";
        linhaTable += "<td>" + _valor + "</td>";
        linhaTable += "<td><button id='" + contPedidos + "' class='delButton' onclick='delPedido(this.id)'><i class='ion-trash-b'></i></button></td>";
        linhaTable += "</tr>";

        $("#myPedidos").append(linhaTable);

        $('#icbSegmento').val("");
        $('#iPedido').val("");
        $('#iValor').val("");
    } else {
        document.getElementById("fillWarning").innerHTML = "Preencha Todos Os Campos";
        document.getElementById("fillWarning").style.display = "inline";
    }
});

$("#icbStatus").change(function () {
    document.getElementById("fillWarning").style.display = "none";
    var myId = $('#icbStatus option:selected').attr("id");
    if (myId == 1 || myId == '1') {
        document.getElementById("boxContent").style.width = "70vw";
        document.getElementById("boxContent").style.height = "90vh";
        $("#myBoxgrid").addClass("boxGrid");
        $("#bdRightBox").addClass("bdRight");
        document.getElementById("listaPedido").style.display = "block";
        document.getElementById("novoPedido").style.display = "block";
    } else {
        clearTable()
    }
});

$('#confirmaenc').on('click', function () {
    if (contactuid != "") {
        var _stsel = $('#icbStatus option:selected').val();
        if (_stsel == "0") {
            alert('Selecione um Status para Encerrar o Atendimento !');
        } else {
            var myId = $('#icbStatus option:selected').attr("id");
            if (myId == 1 || myId == '1') {
                if (contPedidos != 0) {
                    document.getElementById("fillWarning").style.display = "none";
                    var table = tableJson();
                    var _atendir;
                    if ($("#reply" + contactuid).attr('class') == "ion-forward") {
                        _atendir = "out";
                    } else if ($("#reply" + contactuid).attr('class') == "ion-reply") {
                        _atendir = "in";
                    }
                    var payload = {
                        mobile: contactuid,
                        status: $('#icbStatus').val(),
                        cnpj: $('#iCNPJ').val().replace(/[^\d]+/g, ''),
                        pedidos: table,
                        atendir: _atendir
                    }
                    $('#contatos').addClass('form-loading');
                    socket.emit('bi-close_chat', payload);
                    clearTable();
                    $('#modalEncerrar').modal('hide');
                } else {
                    document.getElementById("fillWarning").innerHTML = "Adicione ao Menos Um Pedido";
                    document.getElementById("fillWarning").style.display = "inline";
                }
            } else {
                var table = tableJson();
                var _atendir;
                if ($("#reply" + contactuid).attr('class') == "ion-forward") {
                    _atendir = "out";
                } else if ($("#reply" + contactuid).attr('class') == "ion-reply") {
                    _atendir = "in";
                }
                var payload = {
                    mobile: contactuid,
                    status: $('#icbStatus').val(),
                    cnpj: $('#iCNPJ').val().replace(/[^\d]+/g, ''),
                    pedidos: table,
                    atendir: _atendir
                }
                $('#contatos').addClass('form-loading');
                socket.emit('bi-close_chat', payload);
                clearTable();
                $('#modalEncerrar').modal('hide');
            }
        }
    } else {
        $('#myModal7').modal();
    }
});

$('#inseriraudio').change(function () {
    console.log('bate');
    var file = this.files[0];
    // This code is only for demo ...
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    uplaudio();
});

$('#inserirdoc').change(function () {
    console.log('bate');
    var file = this.files[0];
    // This code is only for demo ...
    console.log("name : " + file.name);
    console.log("size : " + file.size);
    console.log("type : " + file.type);
    console.log("date : " + file.lastModified);
    upldoc();
});