var ida = 0;
var idcontato = 0;
var json;
var newSwitch = 1;
var editSwitch = 1;
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

    socket.emit('bi-liststa', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });

    socket.on('bi-liststa', function (payload) {
        var json = JSON.parse(payload);
        var cx = json.length;
        $("#tbodyz").empty();
        var buscaval = $('#buscarlista').val();

        if (buscaval == "") {
            for (a = 0; a < cx; a++) {
                var teste = a;
                var menu = '';
                menu += divstatus(json[a].descricao, json[a].id, teste, json[a].pedido);
                $('#tbodyz').append(menu);
            }
        } else {
            for (a = 0; a < cx; a++) {
                var descricao = json[a].descricao;
                var id = json[a].id;
                var jsonteste = a;
                searchtip(descricao, id, jsonteste, json[a].pedido);
            }
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

$('#btnnovo').on('click', function () {
    $('#idescnew').val('');
    $('#modal-default').modal();
});

$('#switchNew').on('click', function () {
    if (newSwitch == 0) {
        newSwitch = 1;
    } else if (newSwitch == 1) {
        newSwitch = 0;
    }
});

$('#switchEdit').on('click', function () {
    if (editSwitch == 0) {
      editSwitch = 1;
    } else if (editSwitch == 1) {
      editSwitch = 0;
    }
  });

$('#btnsavenew').on('click', function () {

    var descricao = $('#idescnew').val();
    if (descricao != '') {
        socket.emit('add_sta', { descricao: descricao.toUpperCase(), pedido: newSwitch });
        $('#modal-default').modal('toggle');
    } else {
        alert('Preencha Todos os Campos');
    }
});

$('#btnsaveedt').on('click', function () {

    if ($('#idescedt').val() != "") {

        var descricao = $('#idescedt').val();
        socket.emit('upd_sta', { id: ida, descricao: descricao.toUpperCase(), pedido: editSwitch });
        ida = 0;

        $('#modal-default2').modal('toggle');
    }

});

$('#confirmaenc').on('click', function () {
    socket.emit('del_sta', { id: ida });
});

$('#buscarlista').keyup(function () {
    socket.emit('bi-liststa', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });
});

function searchtip(descricao, id, jsonteste, pedido) {
    var input, filter;
    input = document.getElementById("buscarlista");
    filter = input.value.toUpperCase();
    if (descricao.toUpperCase().indexOf(filter) > -1) {
        var menu = '';
        menu += divstatus(descricao, id, jsonteste, pedido);
        $('#tbodyz').append(menu);
    } else {
    }
}

function openbox1(box) {

    var descricao = $('#de' + box).text();
    ida = $('#id' + box).text();
    var pedido = $('#ped' + box).text();

    if (pedido == "SIM") {
        if (editSwitch == 0) {
          $('#switchEdit').trigger("click")
        }
      } else if (pedido == "NÃO") {
        if (editSwitch == 1) {
          $('#switchEdit').trigger("click")
        }
      }

    $('#idescedt').val(descricao);
    $('#modal-default2').modal();
}

function openbox2(box) {

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