var socket = io.connect();
var _tipoCliente, fileName, limitemail;
var jsonData = [];

if (sessionStorage.getItem('fkname') == null) {
    window.location = "index.html";
}

socket.emit('bi-getmailing');

socket.on('connect', function () {
    console.log('>>> CONECTADO');
});

socket.on('disconnect', function () {
    console.log('>>> DESCONECTADO');
});

socket.on('bi-addativo', function (payload) {
    //console.log(payload);
});

socket.on('bi-getmailing', function (payload) {
    createTable(payload);
});

socket.on('maillimite', function (payload) {
    limitemail = 1;
    $("#modal-aviso-texto").html("Limite de 300 registros semanais atingido!");
    $('#modal-aviso').modal('toggle');
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

$('#expCSV').on('click', function () {
    var csv = Papa.unparse(jsonData);
    var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var csvURL = window.URL.createObjectURL(csvData);
    var link = document.createElement("a");
    link.setAttribute("href", csvURL);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link);
    link.click();
});

$('#regCSV').on('click', function () {
    $("#modal-csv-texto").html("Numeros residenciais ou sem DDD serão desconsiderados!");
    $('#modal-csv').modal('toggle');
});

$("#csvFile").on('change', function (e) {
    var newArray = [];
    var file = e.target.files[0];
    fileName = e.target.files[0].name;
    if (e.target.files[0].name.indexOf(".csv") < 0) {
        $("#modal-aviso-texto").html("O arquivo selecionado não é um arquivo CSV!");
        $('#modal-aviso').modal('toggle');
    } else {
        parseMe(file, doStuff);
    }
});

$("#cancelreg").on('click', function () {
    $("#regFant").val('');
    $("#regName").val('');
    $("#regMobile").val('');
});

$("#regSalvar").on('click', function () {
    var _fantasia = $("#regFant").val();
    var _nome = $("#regName").val();
    var _mobile = $("#regMobile").val();
    var _tipo = $("input[name=regTipo]:checked").val();
    if (_fantasia != "" && _nome != "" && _tipo != "" && _mobile != "" && _mobile.length == 13) {
        var payload = {
            'nome': _nome,
            'fantasia': _fantasia,
            'mobile': _mobile,
            'tipo': _tipo,
        };
        socket.emit('bi-addativo', payload);
        $("#regFant").val('');
        $("#regName").val('');
        $("#regMobile").val('');
        $('#modal-default').modal('toggle');
    } else if (_mobile != "" && _mobile.length < 13) {
        $("#modal-aviso-texto").html("Numero invalido !<br>Digitar numero completo (Ex: 5511963684235)!");
        $('#modal-aviso').modal('toggle');
    } else {
        $("#modal-aviso-texto").text("Preencha todos os campos!");
        $('#modal-aviso').modal('toggle');
    }
});

function parseMe(url, callBack) {
    Papa.parse(url, {
        complete: function (results) {
            callBack(results.data);
        }
    });
}

async function doStuff(data) {
    var newArray = data;
    if (newArray.length > 3000000) {
        $("#modal-aviso-texto").html("O arquivo CSV ultrapassa o limite de 300 registros!");
        $('#modal-aviso').modal('toggle');
    } else {
        await insertCSV(newArray);
        socket.emit('bi-getmailing');
    }
}

function isNumber(event) {
    var keycode = event.keyCode;
    if (keycode > 47 && keycode < 58) {
        return true
    } else {
        return false
    }
}

async function insertCSV(data) {
    var headers = data[0];
    var arrPayload = [];
    limitemail = 0;
    console.log(headers);
    if (headers.length != 4 || headers[0].toLowerCase() != "telefone" || headers[1].toLowerCase() != "nome " || headers[2].toLowerCase() != "cpf" || headers[3].toLowerCase() != "banco") {
        $("#modal-aviso-texto").text("Mailing invalido!");
        $('#modal-aviso').modal();
        document.getElementById("csvFile").value = "";
    } else {
        console.log(data)
        $("#modal-aviso-texto").text("Carregando Mailing");
        $('#modal-aviso').modal();
        for (i = 1; i < data.length; i++) {
            var _telefone = data[i][0];
            var _nome = data[i][1];
            var _cpf = data[i][2];
            var _banco = data[i][3];
            var _quantidade = data.length - 1;
            var payload = {
                'telefone': _telefone,
                'nome': _nome,
                'cpf': _cpf,
                'banco': _banco,
                'filename': fileName,
                'quantidade': _quantidade
            };
            //console.log(payload);
            arrPayload.push(payload);
            //await socket.emit('bi-addativo', payload);
            //if (limitemail == 1) { break }
        }
        console.log(arrPayload)
        await socket.emit('bi-addativo', arrPayload);
        $("#modal-mailing-texto").text("Mailing Finalizado");
        $('#modal-mailing').modal();
        document.getElementById("csvFile").value = "";
    }
}


function selTipo() {
    $("#csvFile").click();
}

function createTable(payload) {
    var data = JSON.parse(payload);
    jsonData = data;
    if (data.length > 0) {
        $("#mailtable").show();
        var dataSet = [];
        for (i = 0; i < data.length; i++) {
            var _tipo;
            var _dtcadastro = new Date(data[i].dtcadastro);
            _dtcadastro = _dtcadastro.toLocaleDateString("pt-BR");
            var elmt = [
                data[i].filename,
                data[i].mobile,
                data[i].nome,
                data[i].cpf,
                data[i].banco,
                data[i].quantidade,
                _dtcadastro
            ]
            dataSet.push(elmt);
        }
        $('#mailtable').DataTable({
            "destroy": true,
            "autoWidth": true,
            "pageLength": 10,
            "lengthChange": false,
            "data": dataSet,
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
                "sSearch": "Pesquisar ",
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
            },
        });
    } else {
        //$("#mailtable").hide();
        //$("#modal-aviso-texto").html("Nenhum registro encontrado!");
        //$('#modal-aviso').modal('toggle');
    }
}

function retira_acentos(str) {
    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr = "";
    for (i = 0; i < str.length; i++) {
        troca = false;
        for (a = 0; a < com_acento.length; a++) {
            if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca = true;
                break;
            }
        }
        if (troca == false) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
} 