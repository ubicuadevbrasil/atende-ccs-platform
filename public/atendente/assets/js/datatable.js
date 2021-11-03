$(document).ready(function() {
    createTable()
})

var fields = {
    "opTable": [{
            "nomeEjs": "CPF/CNPJ",
            "nomeDatatable": "cpfCnpj",
        },
        {
            "nomeEjs": "Nome",
            "nomeDatatable": "nome",
        },
        {
            "nomeEjs": "Celular",
            "nomeDatatable": "celular",
        },
        {
            "nomeEjs": "N° Protocolo",
            "nomeDatatable": "numProtocolo",
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
            "nomeDatatable": "motivo",
        },
        {
            "nomeEjs": "Histórico",
            "nomeDatatable": "historico",
        },
    ]
}

var data = [{
        "cpfCnpj": '111',
        "nome": 'Chris',
        "celular": '+551198885849',
        "numProtocolo": '1221',
        "hora": '"12":10',
        "data": '12/02/2020',
        "motivo": 'bla bla bla bla',
        "historico": `<img class="historyImg" src="./assets/images/historicogray.png">`,

    },
    {
        "cpfCnpj": '211',
        "nome": 'Chris',
        "celular": '+551198885849',
        "numProtocolo": '1221',
        "hora": '"12":10',
        "data": '12/02/2020',
        "motivo": 'bla bla bla bla',
        "historico": `<img class="historyImg" src="./assets/images/historicogray.png">`,

    },
    {
        "cpfCnpj": '311',
        "nome": 'Chris',
        "celular": '+551198885849',
        "numProtocolo": '1221',
        "hora": '"12":10',
        "data": '12/02/2020',
        "motivo": 'bla bla bla bla',
        "historico": `<img class="historyImg" src="./assets/images/historicogray.png">`,

    },
    {
        "cpfCnpj": '411',
        "nome": 'Chris',
        "celular": '+5511988858498',
        "numProtocolo": '1221',
        "hora": '"12":10',
        "data": '12/02/2020',
        "motivo": 'bla bla bla bla',
        "historico": `<img class="historyImg" src="./assets/images/historicogray.png">`,

    }
]

var columns = []

function createTable() {
    fields["opTable"].forEach(coluna => {
        {

            $("#tableHead").append(`<th colspan=${coluna.colspan != "" ? coluna.colspan : 1} style="min-width: ${coluna.minWidth}vw">${coluna.nomeEjs}</th>`)
            $("#tableBody").append(`<td class=${coluna.class ? coluna.class : ""}></td>`)
            columns.push({ "data": coluna.nomeDatatable }, )
            if (coluna.colspan == "2") {
                $("#tableHeadCopy").append(`<th></th>`)
                columns.push({ "data": coluna.nomeDatatable2 }, )
            }
        }
    })

    $(document).ready(function() {
        $.fn.dataTable.ext.search.push(
            function(settings, searchData, index, rowData, counter) {
                var condicao = $(".cpfSearch").val();
                console.log(condicao)
                if (condicao.length === 0) {
                    return true;
                }
                if (searchData[0].indexOf(condicao) !== -1) {
                    return true;
                }

                return false;
            },
            function(settings, searchData, index, rowData, counter) {
                var condicao = $(".phoneSearch").val();
                console.log(condicao)
                if (condicao.length === 0) {
                    return true;
                }
                if (searchData[2].indexOf(condicao) !== -1) {
                    return true;
                }

                return false;
            },
            function(settings, searchData, index, rowData, counter) {
                var condicao = $(".protocolSearch").val();
                console.log(condicao)
                if (condicao.length === 0) {
                    return true;
                }
                if (searchData[3].indexOf(condicao) !== -1) {
                    return true;
                }

                return false;
            }
        );
        console.log(data)
        console.log(columns);
        var table = $('#dataTable').DataTable({
            "data": data,
            "columns": columns,
            "language": {
                "sEmptyTable": "Nenhum registro encontrado",
                //"sInfo": "",
                // "sInfoEmpty": "",
                // "sInfoFiltered": "",
                // "sInfoPostFix": "",
                // "sInfoThousands": ".",
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
            paging: false,
            info: false,
            searchDelay: 1000,
            searching: true
        });
        $(".searchInput").click(function() {
            console.log($(".cpfSearch").val());
            table.draw();
        })
    });

    return table
}

$('.dateRangePicker').daterangepicker({
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    }
});

$('.dateRangePicker').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});

$('.dateRangePicker').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});