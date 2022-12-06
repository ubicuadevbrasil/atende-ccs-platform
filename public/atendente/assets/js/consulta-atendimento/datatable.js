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
var table = null;

var fields = {
    "opTable": [{
            "nomeEjs": "CPF/CNPJ",
            "nomeDatatable": "cpf",
        },
        {
            "nomeEjs": "Nome",
            "nomeDatatable": "nome",
        },
        {
            "nomeEjs": "Celular",
            "nomeDatatable": "mobile",
        },
        {
            "nomeEjs": "N° Protocolo",
            "nomeDatatable": "protocolo",
        },
        {
            "nomeEjs": "Hora",
            "nomeDatatable": "hora",
        },
        {
            "nomeEjs": "Data",
            "nomeDatatable": "data",
        },
        {
            "nomeEjs": "Motivo",
            "nomeDatatable": "status",
        },
        {
            "nomeEjs": "Histórico",
            "nomeDatatable": "historico",
        },
    ]
}

async function createTable(data) {
    var columns = []
    console.log(data)
    console.log(columns)
    $("#tableHead").html("")
    fields["opTable"].forEach(coluna => {
        {
            $("#tableHead").append(`<th colspan=${coluna.colspan != "" ? coluna.colspan : 1} style="min-width: ${coluna.minWidth}vw">${coluna.nomeEjs}</th>`)
            $("#tableBody").append(`<td class=${coluna.class ? coluna.class : ""}></td>`)
            columns.push({ "data": coluna.nomeDatatable }, )
        }
    })

    var table = await $('#dataTable').DataTable({
        "data": data,
        "columns": columns,
        "language": {
            "sEmptyTable": "Nenhum registro encontrado",
            "sLengthMenu": "",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            },

        },
        scrollY: false,
        scrollX: true,
        //scrollCollapse: true,
        paging: true,
        info: false,
        searchDelay: 1000,
        searching: true,
        "ordering": false
    });
    $(".searchInput").click(function() {
        console.log($(".cpfSearch").val());
        table.draw();
    })

    return table
}

$('.dateRangePicker').daterangepicker({
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": " - ",
        "applyLabel": "Aplicar",
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
            "Sáb"
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
        "firstDay": 0
    },
});

// Cria datatable
socket.on('bi-report2', function (payload) {
    console.log(payload);
    data = payload.reportadata
    data.forEach(element => {
        element.historico = `<img id="historyButton" onclick="getHistory('${element.sessionid}')" class="historyImg" src="./assets/images/historicogray.png">`
    });
    if (table != null) {
        $('#dataTable').DataTable().clear().destroy()
    }
    table = createTable(data)
});

// Historico de Conversa com o Usuario
function getHistory(sessionid) {
    console.log('> Consulta historico do atendente');
    console.log(sessionid)
    if (sessionid) {
        // Limpa janela de Chat atual
        $("#chatHistory").empty();
        // Evento para buscar historico do Cliente
        socket.emit('bi-historyone', {
            sessionid: sessionid
        });
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle, modalDesc)
    }   
}

// Historico de conversa do Cliente
socket.on('bi-historyone', async function (payload) {
    console.log('> Busca historico do Cliente')
    console.log(payload);
    if (payload.logs.length != 0) {
        let logs = JSON.parse(payload.logs);
        let contacts = JSON.parse(payload.contacts);
        await historyMessage(contacts, logs, 'chatHistory');
        $("#historicoModal").fadeIn("fast");
    } else {
        let modalTitle = "Aviso";
        let modalDesc = "Não Há Nenhum Histórico Desse Contato!";
        callWarningModal(modalTitle, modalDesc)
    }
});

$('#btnBusca').on('click', function () {
    testsock2();
    $('#pagtab2').empty();
    $('#tableresult').empty();
});

function testsock() {
    console.log($('#phoneSearch').val(), $('#cpfSearch').val(), $('#protocolSearch').val());
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

function testsock2() {

    var v_number = $('#phoneSearch').val();
    var v_CPF = $('#cpfSearch').val();
    var v_banco = $('#protocolSearch').val();
    var date = getDate($("#dateSearch").val());
    console.log(date)
    globalqry2 = "";

    if (v_CPF != "") {
        globalqry2 += "WHERE cpf= '" + v_CPF.replace('.','').replace('.','').replace('-','') + "'";
    }

    if (v_number != "") {
        if (globalqry2 != "") {
            globalqry2 += " and mobile= '55" + v_number.replace(' ','').replace('-','') + "'";
        } else {
            globalqry2 += "WHERE mobile= '55" + v_number.replace(' ','').replace('-','') + "'";
        }
    }

    if (v_banco != "") {
        if (globalqry2 != "") {
            globalqry2 += " and protocolo= '" + v_banco + "'";
        } else {
            globalqry2 += "WHERE protocolo= '" + v_banco + "'";
        }
    }

    if (date != "") {
        if (globalqry2 != "") {
            globalqry2 += " and dtfilter BETWEEN '" + date[0] + "' AND '" + date[1] + "'";
        } else {
            globalqry2 += "WHERE dtfilter BETWEEN '" + date[0] + "' AND '" + date[1] + "'";
        }
    }

    console.log(globalqry2);
    testsock();
}

function getDate(date) {
    if (date != "--Selecione--") {
        date = date.split("-")

        var date_start = date[0].split("/")
        date_start = new Date(date_start[2], (date_start[1] - 1), date_start[0], 0, 0, 0, 0).toISOString()
        date_start = date_start.split("T")
        date_start = date_start[0] + " 00:00:00"
        var date_end = date[1].split("/")
        date_end = new Date(date_end[2], (date_end[1] - 1), date_end[0], 0, 0, 0, 0).toISOString()
        date_end = date_end.split("T")
        date_end = date_end[0] + " 23:59:59"

        return [date_start, date_end]
    } else {
        return []
    }
}