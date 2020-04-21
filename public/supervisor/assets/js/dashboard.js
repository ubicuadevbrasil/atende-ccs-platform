var sid;
var socket = io.connect();
var operador = sessionStorage.getItem('fkname');

$('#lboperador').text(operador);

if (sessionStorage.getItem('fkname') == null) {
    window.location = "index.html";
}

socket.on('sentinel_clients_queue', function (payload) {
    console.log(payload)
    $("#EmAtendimento").text(payload[0].total);
    $("#aguardando").text(payload[1].total);
    $("#AtendimentoEncerrados").text(payload[2].total);
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
    var tempmed = payload[3].total;
    var atendeIn = payload[0].total;
    var media = Math.round(tempmed / atendeIn);
    if (media > 0) {
    } else {
        media = 0;
    }
    $("#TempoMedio").text(media + " minutos");
});

socket.on('sentinel_clients_alive', function (payload) {
    //console.log(payload)
    var tt = JSON.parse(payload);
    var _addtr;
    var _count = 1;
    for (i = 0; i < tt.length; i++) {
        if (tt[i].fkid.length == 36) {
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

function onforcedisconnect(socketid) {
    sid = socketid;
    $('#modal-default1').modal();
}

$('#confirmadeslogar').on('click', function () {
    //$('#modal-default4').modal('toggle');
    var payload = { socketid: sid };
    socket.emit('force_disconnect', payload);
});