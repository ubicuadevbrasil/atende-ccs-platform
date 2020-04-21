var contadorglobal = 0;
var contg;
var globalqry
var globalqry2 = "";
var ida = 0;
var idcontato = 0;
var json;
var marcabtnpag;
var operador = sessionStorage.getItem('fkname');
var socket = io.connect();

$('#lboperador').text(operador);

if (sessionStorage.getItem('fkname') == null) {
    window.location = "restricted.html";
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
                menu += divstatus(json[a].descricao, json[a].id, teste);
                $('#tbodyz').append(menu);
            }
        } else {
            for (a = 0; a < cx; a++) {
                var descricao = json[a].descricao;
                var id = json[a].id;
                var jsonteste = a;
                searchtip(descricao, id, jsonteste);
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

socket.on('bi-historyone', function (payload) {
    if (payload.contacts.length != 0) {
        var logs = JSON.parse(payload.logs);
        var contacts = JSON.parse(payload.contacts);
        $('#chathistory').empty();
        //var bot = JSON.parse(payload.bot);
        //console.log(logs);
        //onchatmsg(contacts, logs, 'chathistory', bot);
        onchatmsg(contacts, logs, 'chathistory');
        $('#modalHistorico').modal();
    } else {
        $('#myModal9').modal();
    }
});

socket.on('bi-report2', function (payload) {
    console.log(payload);
    if (payload.count > 0) {
        contadorglobal = payload.count;
        $('#contatotal2').text(payload.count);
        if (payload.count < 20) {
            $('#contatual2').text('1 - ' + payload.count);
        }
        document.getElementById("datatables_info2").style.display = "block";
        document.getElementById("datatables").style.display = "block";

        var tbres = payload.reportadata;
        var qnt = tbres.length;
        var countPed = tbres.pedidos;
        contg = 1;
        var pagct = 0;

        for (i = 0; i < qnt; i++) {
            var table = '';
            table += tabsup(tbres[i].sessionid, tbres[i].mobile, tbres[i].cpf, tbres[i].atendente, tbres[i].hora, tbres[i].data, tbres[i].status, tbres[i].atendir, tbres[i].filename, tbres[i].rgm_aluno, tbres[i].nome);
            $('#tableresult').append(table);
        }

        //Paginação botoes Começo ----------------------------------------------------------
        if (checkNext == "True") {
            parametrosetas = 0;
            var pag = '';
            pag += pagtab2('next');
            $('#pagtab2').append(pag);
            for (i = 0; i < payload.count; i++) {
                if (i > pagct) {
                    var pag = '';
                    pag += pagtab(contg, pagct);
                    $('#pagtab2').append(pag);
                    if (contg > 5) {
                        document.getElementById(pagct).style.display = "none";
                    }
                    pagct = pagct + 20;
                    contg = contg + 1;
                }
            }
            var pag2 = '';
            pag2 += pagtab2('back');
            $('#pagtab2').append(pag2);
        }
        //Paginação botoes fim ----------------------------------------------------------
        if (marcabtnpag != "" && marcabtnpag != null) {
            $("#" + marcabtnpagOld).removeClass("active");
            $("#" + marcabtnpag).addClass("active");
            marcabtnpagOld = marcabtnpag;
            marcabtnpag = '';
        }
        marcabtnpag = '';
        document.getElementById("btnexcel").style.display = "block";
    } else {
        document.getElementById("btnexcel").style.display = "none";
        document.getElementById("datatables_info2").style.display = "none";
        $('#modaltitle1').text('Sem Resultados!');
        $('#modaltitle2').text('Nenhum Registro Encontrado !');
        $('#modalubc1').modal();
    }
});

$('#btnnovo').on('click', function () {
    $('#idescnew').val('');
    $('#modal-default').modal();
});

$('#btnsavenew').on('click', function () {

    var descricao = $('#idescnew').val();
    if (descricao != '') {
        socket.emit('add_sta', { descricao: descricao.toUpperCase() });
        $('#modal-default').modal('toggle');
    } else {
        alert('Preencha Todos os Campos');
    }
});

$('#btnsaveedt').on('click', function () {

    if ($('#idescedt').val() != "") {

        var descricao = $('#idescedt').val();
        socket.emit('upd_sta', { id: ida, descricao: descricao.toUpperCase() });
        ida = 0;

        $('#modal-default2').modal('toggle');
    }

});

$('#btnbusca').on('click', function () {
    console.log($('#iCEL').val(), $('iCPF').val(), $('#iRGM').val());
    if ($('#iCEL').val() != "" || $('iCPF').val() != "" || $('#iRGM').val() != "") {
        testsock2();
        //$('#pagtab').empty();
        $('#pagtab2').empty();
        $('#tableresult').empty();
    } else {
        $('#modaltitle1').text('Campos em Branco!');
        $('#modaltitle2').text('Preencha o Campo de Celular, CNPJ ou No. Pedido para Prosseguir com a Busca!');
        $('#modalubc1').modal();
    }
});

function funcpag(data) {
    parametrosetas = 0;
    testsock3(data);
    marcabtnpag = data;
    //$('#pagtab').empty();
    $('#pagtab2').empty();
    $('#tableresult').empty();
    var data2 = Number(data) + 20;
    data = Number(data) + 1;
    if (data == 0) {
        //$('#contatual').text('1 - 20');
        $('#contatual2').text('1 - 20');
    } else if (contadorglobal <= data2) {
        //$('#contatual').text(data + ' - ' + contadorglobal);
        $('#contatual2').text(data + ' - ' + contadorglobal);
    } else {
        //$('#contatual').text(data + ' - ' + data2);
        $('#contatual2').text(data + ' - ' + data2);
    }
}

function testsock3(data) {
    if (globalqry != null) {
        var payload = { params: "" + globalqry2 + "" + globalqry + "", limit: data };
    } else {
        var payload = { params: "" + globalqry2 + "", limit: data };
    }
    console.log(payload);
    socket.emit('bi-report2', payload);
}

function openbox1(box) {

    var descricao = $('#de' + box).text();
    ida = $('#id' + box).text();
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

function testsock2() {

    var v_number = $('#iCEL').val();
    var v_CPF = $('#iCPF').val();
    var v_rgm = $('#iRGM').val();

    globalqry2 = "";

    if (v_CPF != "") {
        globalqry2 += "WHERE cpf= '" + v_CPF + "'";
    }

    if (v_number != "") {
        if (globalqry2 != "") {
            globalqry2 += " and mobile= '55" + v_number + "'";
        } else {
            globalqry2 += "WHERE mobile= '55" + v_number + "'";
        }
    }

    if (v_rgm != "") {
        if (globalqry2 != "") {
            globalqry2 += " and rgm_aluno= '" + v_rgm + "'";
        } else {
            globalqry2 += "WHERE rgm_aluno= '" + v_rgm + "'";
        }
    }

    console.log(globalqry2);
    testsock();
}

function testsock() {
    if (globalqry != null) {
        if (globalqry2 == "") {
            var payload = { params: "" + globalqry2 + "" + globalqry + "", limit: 0, transbordoDt: "sessionStorage.fkid" };
        } else {
            var payload = { params: "" + globalqry2 + " AND " + globalqry + "", limit: 0, transbordoDt: "sessionStorage.fkid" };
        }
    } else {
        var payload = { params: "" + globalqry2 + "", limit: 0, transbordoDt: sessionStorage.fkid };
    }
    console.log(payload);
    socket.emit('bi-report2', payload);
}

function searchtip(descricao, id, jsonteste) {
    var input, filter;
    input = document.getElementById("buscarlista");
    //filter = input.value.toUpperCase();
    if (descricao.toUpperCase().indexOf(filter) > -1) {
        var menu = '';
        menu += divstatus(descricao, id, jsonteste);
        $('#tbodyz').append(menu);
    } else {
    }
}

function openhist(data) {
    var payload = { sessionid: data };
    socket.emit('bi-historyone', payload);
}

$('#confirmaenc').on('click', function () {
    socket.emit('del_sta', { id: ida });
});

$('#buscarlista').keyup(function () {
    socket.emit('bi-liststa', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });
});

$('#openpanfil').on('click', function (event) {
    $('#panfil').fadeIn();
    $('#closepanfil').show();
    $('#openpanfil').hide();
});

$('#closepanfil').on('click', function (event) {
    $('#panfil').fadeOut();
    $('#closepanfil').hide();
    $('#openpanfil').show();
});

$('#openpanres').on('click', function (event) {
    $('#panres').fadeIn();
    $('#closepanres').show();
    $('#openpanres').hide();
});

$('#closepanres').on('click', function (event) {
    $('#panres').fadeOut();
    $('#closepanres').hide();
    $('#openpanres').show();
});

$(function () {
    $('#daterange-1').daterangepicker({
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Salvar",
            "cancelLabel": "Cancelar",
            "fromLabel": "De",
            "toLabel": "Até",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Dom",
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sab"
            ],
            "monthNames": [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Dezembro"
            ],
            "firstDay": 1
        }
    });
    $('#daterange-1').val('');
});