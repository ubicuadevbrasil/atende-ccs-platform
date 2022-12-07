var ida = 0;
var idunb = 0;
var fkidunb = 0;
var idcontato = 0;
var json;
var operador = sessionStorage.getItem('fkname');
var socket = io.connect();

$('#lboperador').text(operador);

if (sessionStorage.getItem('fkname') == null) {
    window.location = "index.html";
}

socket.on('connect', function () {
    console.log('-----------------------------------------------------------------------------------');
    console.log('-----------------------------------------------------------------------------------');
    console.log('------------------------CONECTADO-----CONECTADO------------------------------------');
    console.log('-----------------------------------------------------------------------------------');
    console.log('-----------------------------------------------------------------------------------');

    socket.emit('bi-listagents', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });
    socket.emit('bi-listblock', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });

    socket.on('bi-listagents', function (payload) {
        var json = JSON.parse(payload);
        var cx = json.length;
        $("#tbodyz").empty();
        var buscaval = $('#buscarlista').val();

        if (buscaval == "") {
            for (a = 0; a < cx; a++) {
                var teste = a;
                var menu = '';
                var perfil = getperfil(json[a].perfil);
                menu += divatend(perfil, json[a].nome, json[a].usuario, json[a].id, teste);
                $('#tbodyz').append(menu);
            }
        } else {
            for (a = 0; a < cx; a++) {
                var perfil = getperfil(json[a].perfil);
                var nome = json[a].nome;
                var user = json[a].usuario;
                var id = json[a].id;
                var jsonteste = a;
                searchtip(perfil, nome, user, id, jsonteste);
            }
        }
    });

    socket.on('bi-listblock', function (payload) {
        var json = JSON.parse(payload);
        $("#tbodyb").empty();
        for (let i = 0; i < json.length; i++) {
            const element = json[i];
            var menu = '';
            menu += divblock(element.id, element.fkid_atendente, element.nome_atendente, element.data_bloqueio, i);
            $('#tbodyb').append(menu);
        }
    });
});

socket.on('disconnect', function () {
    console.log('-----------------------------------------------------------------------------------');
    console.log('-----------------------------------------------------------------------------------');
    console.log('------------------------DISCONECTADO-----DISCONECTADO------------------------------');
    console.log('-----------------------------------------------------------------------------------');
    console.log('-----------------------------------------------------------------------------------');
});

$('#atendenv').on('click', function () {
    $('#atdnome').val('');
    $('#atdsenha').val('');
    $('#atdsenhac').val('');
    $('#atduser').val('');
    $("[name=tcnew]").val(["3"]);
    $('#modal-default').modal();
});

$('#registeratend').on('click', function () {

    var perfil = $("input[name=tcnew]:checked").val();
    var nomeatend = $('#atdnome').val();
    var senhaatend = $('#atdsenha').val();
    var csenhaatend = $('#atdsenhac').val();
    var useratend = $('#atduser').val();

    if (nomeatend != '' && senhaatend != '' && csenhaatend != '' && useratend != '') {

        if (senhaatend == csenhaatend) {
            socket.emit('add_agent', { perfil: perfil, nome: nomeatend, usuario: useratend, senha: csenhaatend });
            $('#modal-default').modal('toggle');
        } else {
            alert('As senhas não correspondem');
        }

    } else {
        alert('Preencha Todos os Campos');
    }
});

$('#registerpass').on('click', function () {

    var senhaatend = $('#edtsenha').val();
    var csenhaatend = $('#edtsenhac').val();

    if (senhaatend != '' && csenhaatend != '') {

        if (senhaatend == csenhaatend) {
            socket.emit('upd_agent', { id: ida, pwd: true, senha: csenhaatend });
            $('#modal-default1').modal('toggle');
        } else {
            alert('As Senhas Não Coincidem !');
        }

    } else {
        alert('Preencha Todos os Campos');
    }
});

$('#cedtatend').on('click', function () {

    if ($('#edtnome').val() != "" && $('#edtuser').val() != "") {

        var perfil = $("input[name=tcedt]:checked").val();
        var nome = $('#edtnome').val();
        var user = $('#edtuser').val();

        socket.emit('upd_agent', { id: ida, pwd: false, perfil: perfil, nome: nome, usuario: user });
        ida = 0;
        $('#modal-default2').modal('hide');
    }
});

$("#btntreinamento").on('click', function () {
    $("#modalDflt2").modal();
})

$("#btnsaveedt").on('click', function () {
    socket.emit('upd_training', { bool: $("#switcher-basic2")[0].checked })
    $("#modalDflt2").modal('hide');
})

$('#confirmaenc').on('click', function () {
    socket.emit('del_agent', { id: ida });
});

$('#buscarlista').keyup(function () {
    socket.emit('bi-listagents', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });
});

$("#btnunblock").on('click', function () {
    var motivo = $('#unb-motivo').val()
    $('#unb-motivo').val('')

    if (motivo.length > 0) {
        $('#modal-unblock').modal('hide');
        socket.emit('unblock_agent', {
            id: idunb,
            fkid_atendente: fkidunb,
            fkid_supervisor: sessionStorage.getItem("fkid"),
            fkname_supervisor: sessionStorage.getItem("fkname"),
            motivo: motivo
        })
    } else {
        alert("Por favor informe o motivo.");
    }
});

function searchtip(perfil, nome, user, id, jsonteste) {
    var input, filter;
    input = document.getElementById("buscarlista");
    filter = input.value.toUpperCase();
    if (nome.toUpperCase().indexOf(filter) > -1) {
        var menu = '';
        menu += divatend(perfil, nome, user, id, jsonteste);
        $('#tbodyz').append(menu);
    } else {
    }
}

function openbox1(box) {

    var perfil = $('#pf' + box).text();
    var nome = $('#nm' + box).text();
    var user = $('#us' + box).text();

    ida = $('#id' + box).text();
    gbox = box
    $('#edtnome').val(nome);
    $('#edtuser').val(user);

    // Tipo da Conta
    if (perfil == "Supervisor") {
        $("[name=tcedt]").val(["2"]);
    } else {
        $("[name=tcedt]").val(["3"]);
    }
    $('#modal-default2').modal();
}

function openbox2(box) {

    var nome = $('#nm' + box).text();
    var user = $('#us' + box).text();
    ida = $('#id' + box).text();

    $('#modal-default3').modal();

}

function openbox3(box) {

    ida = $('#id' + box).text();
    var nome = $('#nm' + box).text();
    $('#snome').text(" Usuário: " + nome);
    $('#edtsenha').val('');
    $('#edtsenhac').val('');
    $('#modal-default1').modal();

}

function openboxU(box) {
    idunb = $('#idunb' + box).text();
    fkidunb = $('#fkidunb' + box).text();
    var nome = $("#unm" + box).text();
    $('#unb-name').val(nome);
    $('#modal-unblock').modal();
}