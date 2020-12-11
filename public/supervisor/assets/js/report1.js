var checkNext;
var contadorglobal = 0;
var contg;
var globalqry
var globalqry2 = "";
var globalqry3 = "";
var globalqry4 = "";
var ida = 0;
var idcontato = 0;
var json;
var marcabtnpag, marcabtnpagOld;
var operador = sessionStorage.getItem('fkname');
var socket = io.connect();
var toExcelParams;

$('#lboperador').text(operador);

if (sessionStorage.getItem('fkname') == null) {
    window.location = "index.html";
}

socket.on('connect', function () {
    console.log('CONECTADO');

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
    console.log('Desconectado');
});

socket.on('bi-report1', function (payload) {
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

socket.on('bi-report1toxlsx', function (payload) {
    document.getElementById("modaltitle4").href = payload.url;
    $('#modalubc2').modal();
});

socket.on('bi-loginstoxlsx', function (payload) {
    $('#btnLogins').removeClass('form-loading');
    document.getElementById("modaltitle4").href = payload.url;
    $('#modalubc2').modal();
});

socket.on('bi-blocktoxls', function (payload) {
    $('#btnBloqueio').removeClass('form-loading');
    if (payload.url != "") {
        document.getElementById("modaltitle4").href = payload.url;
        $('#modalubc2').modal();
    } else {
        alert("Sem dados de bloqueio neste periodo")
    }
});

socket.on('bi-historyone', function (payload) {
    console.log(payload)
    if (payload.contacts.length != 0) {
        var logs = JSON.parse(payload.logs);
        var contacts = JSON.parse(payload.contacts);
        //var bot = JSON.parse(payload.bot);
        //console.log(logs);
        $('#chathistory').empty();
        //onchatmsg(contacts, logs, 'chathistory', bot);
        onchatmsg(contacts, logs, 'chathistory');
        $('#modalHistorico').modal();
    } else {
        $('#myModal9').modal();
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

$('#printToPdf').on('click', function () {
    print(1)
})

function print(quality) {
    var log = document.getElementById('chathistory');
    var wnd = window.open("", "_blank", "resizable=no, scrollbars=yes, titlebar=no, width=600, height=600, top=10, left=10");
    var fileName = new Date;
    fileName = fileName.toISOString();
    wnd.document.write(
        "<!doctype html>" +
        "<html><head>" +
        "<meta charset='appropriate charset here'>" +
        "<title>Ubicua</title>" +
        "<link href='https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,600,700,300&subset=latin' rel='stylesheet' type='text/css'>" +
        "<link href='assets/css/ionicons.min.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/font-awesome.min.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/bootstrap.min.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/pixeladmin.min.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/widgets.min.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/ubicua.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/themes/adminflare.min.css' rel='stylesheet' type='text/css' media='all'>" +
        "<link href='assets/css/print.css' rel='stylesheet' type='text/css' media='all'>" +
        "</head><body>" +
        "<div id='printPDF' style='max-width: 800px'>" + log.innerHTML + "</div>" +
        "<script src='assets/js/jquery.min.js'></" +
        "script>" +
        "<script src='assets/js/html2canvas.min.js'></" +
        "script>" +
        "<script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js'></" +
        "script>" +
        "<script>" +
        "function print(quality) {const filename  = '" + fileName + ".pdf';html2canvas(document.querySelector('#printPDF'), {scale: quality,useCORS : true}).then(canvas => {let pdf = new jsPDF('p', 'mm', 'a4');pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 200, 220);pdf.save(filename);});}</" +
        "script>" +
        "</body></html>"
    );
    wnd.document.close();
    return false; //
}

function testsock2() {
    var str = $('#daterange-1').val();
    if (str != "") {
        globalqry = onformataperiodo(str);
        globalqry3 = onformataperiodoTrans(str);
        //console.log("g - " + globalqry);

    }

    var v_number = $('#iCEL').val();
    var v_CPF = $('#iCPF').val();
    var v_rgm = $('#iRGM').val();
    var v_direction = $('#iDirection').val();

    globalqry2 = "";

    if (v_CPF != "") {
        globalqry2 += "cpf= '" + v_CPF + "'";
    }

    if (v_number != "") {
        if (globalqry2 != "") {
            globalqry2 += " and mobile= '55" + v_number + "'";
        } else {
            globalqry2 += "mobile= '55" + v_number + "'";
        }
    }

    if (v_rgm != "") {
        if (globalqry2 != "") {
            globalqry2 += " and rgm_aluno= '" + v_rgm + "'";
        } else {
            globalqry2 += "rgm_aluno= '" + v_rgm + "'";
        }
    }

    if (v_direction != "") {
        if (globalqry2 != "") {
            globalqry2 += " and atendir= '" + v_direction + "'";
        } else {
            globalqry2 += "atendir= '" + v_direction + "'";
        }
    }
    testsock();
}

function testsock() {
    console.log(globalqry3)
    if (globalqry != null) {
        if (globalqry2 == "") {
            var payload = { params: globalqry2, limit: 0, transbordoDt: globalqry3 };
        } else {
            var payload = { params: "WHERE " + globalqry2, limit: 0, transbordoDt: globalqry3 };
        }
    } else {
        if (globalqry2 == "") {
            var payload = { params: globalqry2, limit: 0, transbordoDt: globalqry3 };
        } else {
            var payload = { params: "WHERE " + globalqry2, limit: 0, transbordoDt: globalqry3 };
        }
    }
    console.log(payload);
    socket.emit('bi-report1', payload);
    toExcelParams = payload;
}

function tableToExcel(data) {
    var payload = data;
    //console.log(payload);

    socket.emit('bi-report1toxlsx', payload);
}

function funcpag(data) {
    testsock3(data);
    marcabtnpag = data;
    $('#tableresult').empty();
    var data2 = Number(data) + 20;
    data = Number(data) + 1;
    if (data == 0) {
        $('#contatual2').text('1 - 20');
    } else if (contadorglobal <= data2) {
        $('#contatual2').text(data + ' - ' + contadorglobal);
    } else {
        $('#contatual2').text(data + ' - ' + data2);
    }
}

function testsock3(data) {
    if (globalqry != null) {
        if (globalqry2 == "") {
            var payload = { params: globalqry2, limit: data, transbordoDt: globalqry3 };
        } else {
            var payload = { params: "WHERE " + globalqry2, limit: data, transbordoDt: globalqry3 };
        }
    } else {
        if (globalqry2 == "") {
            var payload = { params: globalqry2, limit: data, transbordoDt: globalqry3 };
        } else {
            var payload = { params: "WHERE " + globalqry2, limit: data, transbordoDt: globalqry3 };
        }
    }
    console.log(payload);
    checkNext = "False";
    socket.emit('bi-report1', payload);
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

function searchtip(descricao, id, jsonteste) {
    var input, filter;
    input = document.getElementById("buscarlista");
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

function formatDateRange(date) {
    let dateRange = date.map(date => {
        let dt = date.split("/")
        return new Date(`${dt[1]}/${dt[0]}/${dt[2]}`).toISOString()
    })

    return dateRange
}

$('#btnbusca').on('click', function () {
    checkNext = "True";
    if ($('#iCEL').val() != "" || $('#iCPF').val() != "" || $('#iNPED').val() != "" || $('#daterange-1').val() != "") {
        testsock2();
        $('#pagtab2').empty();
        $('#tableresult').empty();
    } else {
        $('#modaltitle1').text('Campos em Branco!');
        $('#modaltitle2').text('Preencha o Campo de Celular, CPF ou No. Pedido para Prosseguir com a Busca!');
        $('#modalubc1').modal();
    }
});

$('#btnexcel').on('click', function () {
    //console.log(toExcelParams);

    tableToExcel(toExcelParams);
});

$('#btnLogins').on('click', function () {
    console.log('Call Socket');
    $('#btnLogins').addClass('form-loading');

    var str = $('#daterange-1').val();

    if (str != "") {
        globalqry4 = onformataperiodo(str);
        globalqry4 = globalqry4.replace("a.dtin", " AND date ")
        socket.emit('bi-loginstoxlsx', globalqry4);
    } else {
        $('#btnLogins').removeClass('form-loading');
        alert("Periodo de Data não selecionado")
    }
});

$('#btnBloqueio').on('click', function () {
    $('#btnBloqueio').addClass('form-loading');
    var date_range = $('#daterange-1').val() 

    if (date_range != "") {
        date_range = formatDateRange(String($('#daterange-1').val()).split("-").map(date => date.trim()));
        console.log(date_range)
        socket.emit('bi-blocktoxls', { dt: date_range })
    } else {
        $('#btnBloqueio').removeClass('form-loading');
        alert("Periodo de Data não selecionado")
    }
});

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