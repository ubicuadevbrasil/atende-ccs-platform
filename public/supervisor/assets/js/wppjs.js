// ===============================================================================
//
// Ubicua Js
//

function divatend(perfil, nome, usuario, id, a) {
    var msg = "<tr id='" + id + "'>";
    msg += "<td><span>" + a + "</span><span id='id" + a + "' style='display:none'>" + id + "</span></td>";
    msg += "<td><span id='nm" + a + "'>" + nome + "</span></td>";
    msg += "<td><span id='us" + a + "'>" + usuario + "</span></td>";
    msg += "<td><span id='pf" + a + "'>" + perfil + "</span></td>";
    msg += "<td style='padding-left: 1.5vw'> ";
    msg += "<button class='buttonatend' onclick='openbox3(" + a + ")'><i class='ion-ios-locked'></i></button>";
    msg += "</td>";
    msg += "<td style='padding-left: 1vw;'>";
    msg += "<button class='buttonatend' onclick='openbox1(" + a + ")'><i class='fa fa-edit'></i></button>";
    msg += "</td>";
    msg += "<td style='padding-left: 1.5vw'> ";
    msg += "<button class='buttonatend' onclick='openbox2(" + a + ")'><i class='fa fa-trash-o'></i></button>";
    msg += "</td>";
    msg += "</tr>";

    return (msg);
}

function divstatus(descricao, id, a, pedido) {
    var msg = "<tr id='" + id + "'>";
    msg += "<td><span>" + a + "</span><span id='id" + a + "' style='display:none'>" + id + "</span></td>";
    msg += "<td><span id='de" + a + "'>" + descricao + "</span></td>";
    if (pedido == 0) {
        msg += "<td><span id='ped" + a + "' style='margin-left:10px'>NÃO</span></td>";
    } else if (pedido == 1) {
        msg += "<td><span id='ped" + a + "' style='margin-left:10px'>SIM</span></td>";
    }
    msg += "<td style='padding-left: 1vw;'>";
    msg += "<button class='buttonatend' onclick='openbox1(" + a + ")'><i class='fa fa-edit'></i></button>";
    msg += "</td>";
    msg += "<td style='padding-left: 1.5vw'> ";
    msg += "<button class='buttonatend' onclick='openbox2(" + a + ")'><i class='fa fa-trash-o'></i></button>";
    msg += "</td>";
    msg += "</tr>";

    return (msg);
}

function tbl(nome, tempo, ip, a) {
    var msg = "<tr>";
    msg += "<td>" + a + "</td>";
    msg += "<td>" + nome + "</td>";
    msg += "<td>" + tempo + "</td>";
    msg += "<td>" + ip + "</td>";
    msg += "</tr>";

    return (msg);
}

function getperfil(id) {
    var perfil;
    if (id == 1) {
        perfil = "Gerente";
    } else if (id == 2) {
        perfil = "Supervisor";
    } else if (id == 3) {
        perfil = "Atendente";
    } else {
        perfil = "NA";
    }
    return perfil;
}

function tabsup(id, numb, cpf, name, hour, date, state, atendir, filename, rgm, nome) {

    if (numb == null || numb == "" || numb == "null") {
        numb = '-';
    }
    if (cpf == null || cpf == "" || cpf == "null") {
        cpf = '-';
    }
    if (name == null || name == "" || name == "null") {
        name = '-';
    }
    if (hour == null || hour == "" || hour == "null") {
        hour = '-';
    }
    if (date == null || date == "" || date == "null") {
        date = '-';
    }
    if (state == null || state == "" || state == "null") {
        state = '-';
    }
    if (atendir == null || atendir == "" || atendir == "null") {
        atendir = '-';
    }
    if (filename == null || filename == "" || filename == "null") {
        filename = '-';
    }
    if (nome == null || nome == "" || nome == "null") {
        nome = '-';
    }
    if (rgm == null || rgm == "" || nome == "null") {
        rgm = '-';
    }

    var tab = "<tr id='count" + id + "' class='gradeA odd' role='row'>";
    tab += "<td class='sorting_1'>" + nome + "</td>";
    tab += "<td>" + rgm + "</td>";
    tab += "<td>" + cpf + "</td>";
    tab += "<td>" + numb + "</td>";
    tab += "<td>" + name + "</td>";
    tab += "<td>" + hour + "</td>";
    tab += "<td>" + date + "</td>";
    tab += "<td>" + state + "</td>";
    tab += "<td>" + atendir + "</td>";
    tab += "<td>" + filename + "</td>";
    tab += "<td id='" + id + "' class='text-center' onclick='openhist(this.id)'><i class='fa fa-comments' style='cursor: pointer;'></i></td>";
    tab += "</tr>";

    return (tab);
}

function pagtab(contg, id) {
    var tab = "<li id='" + id + "' class='goon' onclick='funcpag(this.id)'>";
    tab += "<a href='#'>" + contg + "</a>";
    tab += "</li>";

    return (tab);
}

function pagtab2(data) {
    //console.log(data);
    if (data == 'next') {
        var tab = "<li class='paginate_button previous' id='datatables_previous' onclick='showbtns(0)'>";
        tab += "<span href='#'><i class='fa fa-angle-left'></i></span></li>";
        return (tab);
    } else if (data == 'back') {
        var tab = "<li class='paginate_button next' id='datatables_next' onclick='showbtns(1)'>";
        tab += "<span href='#'><i class='fa fa-angle-right'></i></span></li>";
        return (tab);
    }
}

function onformataperiodo(dt) {

    var diai = dt.substr(0, 2);
    var mesi = dt.substr(3, 2);
    var anoi = dt.substr(6, 4);
    var diaf = dt.substr(13, 2);
    var mesf = dt.substr(16, 2);
    var anof = dt.substr(19, 4);

    return " a.dtin BETWEEN '" + anoi + "-" + mesi + "-" + diai + " 00:00:00' AND '" + anof + "-" + mesf + "-" + diaf + " 23:59:59'";
}

function onformataperiodoTrans(dt) {

    var diai = dt.substr(0, 2);
    var mesi = dt.substr(3, 2);
    var anoi = dt.substr(6, 4);
    var diaf = dt.substr(13, 2);
    var mesf = dt.substr(16, 2);
    var anof = dt.substr(19, 4);

    return "" + anoi + "-" + mesi + "-" + diai + " 00:00:00," + anof + "-" + mesf + "-" + diaf + " 23:59:59";
}

var parametrosetas = 0;

function showbtns(data) {
    var contador = $('li.goon').length;
    contador = contador - 5;
    //console.log(contador, parametrosetas);

    if (data == 1) {
        if (parametrosetas < contador) {
            //console.log(parametrosetas);
            parametrosetas = parametrosetas + 5
            $('li.goon').slice(parametrosetas, parametrosetas + 5).show();
            $('li.goon').slice(parametrosetas - 5, parametrosetas).hide();
        }
    } else if (data == 0) {
        if (parametrosetas > 0) {
            //console.log(parametrosetas);
            $('li.goon').slice(parametrosetas - 5, parametrosetas).show();
            $('li.goon').slice(parametrosetas, parametrosetas + 5).hide();
            parametrosetas = parametrosetas - 5;
        }
    }

}
