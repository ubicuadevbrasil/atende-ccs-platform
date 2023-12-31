var sid;
const socket = io.connect();
const agentFkid = sessionStorage.getItem('fkid');
const agentFkname = sessionStorage.getItem('fkname');
const operador = sessionStorage.getItem('fkname');

$('#lboperador').text(operador);

if (sessionStorage.getItem('fkname') == null) {
    window.location = "index.html";
}

socket.on("connect", function () {
    console.log("Connected")
    socket.emit('sentinel_clients_queue')
    socket.emit('bi-balanceamento')
})

let balanceamentoInterval = setInterval(() => {
    console.log('bi-balanceamento')
    socket.emit('bi-balanceamento')
 }, 5000);

let queueInterval = setInterval(() => {
    socket.emit('sentinel_clients_queue')
}, 15000);

socket.on('bi-balanceamento', function (payload) {
    console.log("Testando 123: ", payload);
    $("#atendeinCel").empty()
    for (let i = 0; i < payload.length; i++) {
        let card = `
        <div>
            <div class="box bg-info darken">
                <div class="box-cell p-x-3 p-y-1">
                    <div class="font-weight-semibold font-size-12">Balanceamento<br>(${payload[i].infraMobile.replace('@c.us','')})</div>
                    <div class="font-weight-bold font-size-20">
                    <small class="font-weight-light font-size-12"></small>
                    <br>
                    <div class="font-weight-semibold font-size-12">Enviadas: ${payload[i].total}</div>
                    <div class="font-weight-semibold font-size-12">Recebidas: ${payload[i].msgIn}</div>
                    <div class="font-weight-semibold font-size-12">Atendimentos: ${payload[i].atendeIn}</div>
                    </div>
                    <i class="box-bg-icon middle right font-size-52 ion-ios-people"></i>
                </div>
            </div>
        </div>
        `
        $("#atendeinCel").append(card)
    }
})

socket.on('sentinel_clients_queue', function (payload) {
    console.log(payload)
    $("#EmAtendimento").text(payload[0].total);
    $("#aguardando").text(payload[1].total);
    $("#AtendimentoEncerrados").text(payload[2].total);
    // Prioritarios
    $("#EmAtendimentoPrior").text(payload[6].total);
    $("#aguardandoPrior").text(payload[5].total);
    $("#AtendimentoEncerradosPrior").text(payload[7].total);
    if (payload[1].total > 0) {
        $("#btntempo").show();
        // Calculando tempo em fila
        var _time = payload[4].total;
        var _minutes = _time / 60;
        var _rmin = Math.floor(_minutes);
        var _total = _rmin * 60;
        var _seconds = _time - _total;
        if (_time < 60) {
            $("#taf").text(_time + " segundos");
        } else if (_time > 60 && _time < 120) {
            $("#taf").text(_rmin + " minuto e " + _seconds + " segundos");
        } else {
            $("#taf").text(_rmin + " minutos e " + _seconds + " segundos");
        }
    } else {
        $("#btntempo").hide();
    }
    if (payload[5].total > 0) {
        $("#btntempoPrior").show();
        // Calculando tempo em fila
        var _time = payload[9].total;
        var _minutes = _time / 60;
        var _rmin = Math.floor(_minutes);
        var _total = _rmin * 60;
        var _seconds = _time - _total;
        if (_time < 60) {
            $("#tafPrior").text(_time + " segundos");
        } else if (_time > 60 && _time < 120) {
            $("#tafPrior").text(_rmin + " minuto e " + _seconds + " segundos");
        } else {
            $("#tafPrior").text(_rmin + " minutos e " + _seconds + " segundos");
        }
    } else {
        $("#btntempoPrior").hide();
    }
    // var tempmed = payload[3].total;
    // var atendeIn = payload[0].total;
    // var media = Math.round(tempmed / atendeIn);
    // if (media > 0) {
    // } else {
    //     media = 0;
    // }
    // $("#TempoMedio").text(media + " minutos");

    let seconds = payload[7].total;
    let timeEdt = new Date(seconds * 1000).toISOString().substr(11, 8)
    let timeText = timeEdt.split(":")[0] + ":" + timeEdt.split(":")[1]
    $("#TempoMedio").text(timeText);

    // var tempmedPrior = payload[8].total;
    // var atendeInPrior = payload[6].total;
    // var mediaPrior = Math.round(tempmedPrior / atendeInPrior);
    // if (mediaPrior > 0) {
    // } else {
    //     mediaPrior = 0;
    // }
    // $("#TempoMedioPrior").text(mediaPrior + " minutos");

    // let secondsPrior = payload[7].total;
    // let timeEdtPrior = new Date(secondsPrior * 1000).toISOString().substr(11, 8)
    // let timeTextPrior = timeEdtPrior.split(":")[0] + ":" + timeEdtPrior.split(":")[1]
    // $("#TempoMedioPrior").text(timeTextPrior);
});

socket.on('sentinel_clients_alive', function (payload) {
    console.log(payload)
    var tt = JSON.parse(payload);
    var _addtr;
    var _count = 1;
    console.log(tt);
    for (i = 0; i < tt.length; i++) {
        if (tt[i].fkid && tt[i].fkid.length == 36) {
            var _dt1 = new Date(tt[i].fkon);
            var _dt2 = new Date();
            var _timediff = Math.abs(_dt2.getTime() - _dt1.getTime());
            var _secdiff = Math.floor((_timediff / 1000 / 60) << 0);
            var _tempoon = '';
            if (_secdiff < 1) {
                _tempoon = "Menos de 1 minuto";
            } else if (_secdiff == 1) {
                _tempoon = "1 minuto";
            } else {
                _tempoon = _secdiff + " minutos";
            }
            _ip = tt[i].fkip;
            _addtr += "<tr><td>" + _count + "</td><td><img src='assets/images/avatar.png' alt='' style='width:26px;height:26px;' class='border-round'>&nbsp;&nbsp;" + tt[i].fkname + "</a></td><td>" + _tempoon + "</td><td width='150px;'><span class='label label-success pull-left' id='atendein" + tt[i].fkid + "'>0</span></td><td><span class='label label-warning pull-left' id='encerrain" + tt[i].fkid + "'>0</span></td><td><button class='buttonatend' onclick='onforcedisconnect(\"" + tt[i].socketid + "\")'><i class='dropdown-icon fa fa-power-off'></i></button></td></tr>";
            _count = _count + 1;
        }
    }
    $("#tbody").text('');
    $("#tbody").append(_addtr);
});

socket.on('view_agents', function (payload) {
    console.log(payload)
    var ta = JSON.parse(payload);
    for (i = 0; i < ta.length; i++) {
        $('#' + ta[i].atendimentos + ta[i].fkto).text(ta[i].total);
    }

});

socket.on('disconnect', function () {
    console.log('> Desconectado');
});

function onforcedisconnect(socketid) {
    sid = socketid;
    $('#modal-default1').modal();
}

$('#confirmadeslogar').on('click', function () {
    //$('#modal-default4').modal('toggle');
    var payload = { socketid: sid };
    socket.emit('force_disconnect', payload);
    socket.emit('sentinel_clients_queue')
});