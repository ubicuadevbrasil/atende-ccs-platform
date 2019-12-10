function modalpis(info, mobile, account, imageuser, atendir, atendircolor) {

    var texto = "<li id='id" + mobile + "' class='onhoverli'>";
    texto += "<div id='sid" + mobile + "' class='widget-followers-item onhoverli' onclick='openbox1(" + mobile + ")'>";
    texto += "<img id='i" + mobile + "'' src='https://cdn.ubicuacloud.com/file/" + imageuser + "' alt='' class='widget-followers-avatar border-round'>";
    texto += "<div class='widget-followers-controls'>";
    texto += "<span id='s" + mobile + "' class='badge badge-primary' style='margin-right:5px'>" + info + "</span>";
    texto += "<a id='ac" + mobile + "'href='#' class='btn btn-sm btn-success'>";
    texto += "<i class='" + atendir + "'></i>" + account + "";
    texto += "</a>";
    texto += "<i id='reply" + mobile + "' class='" + atendir + "' style='font-size:25px; " + atendircolor + "'></i>";
    texto += "</div>";
    texto += "<a id='a" + mobile + "' href='#' class='widget-followers-name'>" + mobile + "</a>";
    texto += "<a href='#' class='widget-followers-username'>" + mobile + "</a>";
    texto += "</div>";
    texto += "</li>";
    return texto;
}

function chatbox1(numcl) {
    var msg = "<div id='chat" + numcl + "'' style='display: none'>";
    msg += "</div>";
    return (msg);
}

function msgtxtr(teste, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='word-wrap: break-word'>";
    msg += "" + teste + "";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function msgtxtl(teste, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px;'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "" + teste + "";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function msgtxtc(teste) {
    var msg = "<center><div class='center' style='padding-top: 5px; width: 100px;'>";
    msg += "<div class='' style='background-color: #99ddff; word-wrap: break-word; border-radius: 10px;'>";
    msg += "<center><i class='fa fa-calendar'></i> " + teste + "</center>";
    msg += "</div></div></center>";

    return (msg);
}

//******************************************************************************************************************************

function previewimgtx(pvimg, lname, ltime, caption) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-image'></i></span><a target='_blank' href='" + pvimg + "'> Recebeu uma Imagem</a><br>";
    msg += "<span class='blahspan' style='padding: 5px'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";


    return (msg);
}

function previewimg(pvimg, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-image'></i></span><a target='_blank' href='" + pvimg + "'> Recebeu uma Imagem</a><br>";
    msg += "</div>";
    msg += "</div>";


    return (msg);
}

//******************************************************************************************************************************

function previewvid(pvvid, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-videocam'></i></span><a target='_blank' href='" + pvvid + "'> Recebeu um Video</a><br>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewvidtx(pvvid, caption, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-videocam'></i></span><a target='_blank' href='" + pvvid + "'> Recebeu um Video</a><br>";
    msg += "<span class='blahspan' style='padding: 5px'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

//******************************************************************************************************************************

function previewaud(pvaud, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-musical-note'></i></span><a target='_blank' href='" + pvaud + "'> Recebeu um Audio</a><br>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewaudtx(pvaud, caption, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #FFFFFF; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-musical-note'></i></span><a target='_blank' href='" + pvaud + "'> Recebeu um Audio</a><br>";
    msg += "<span class='blahspan' style='padding: 5px'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

//******************************************************************************************************************************

function previewdoc(pvdoc, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px;'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6;'>";
    msg += "<span class='step size-21'><i class='icon ion-android-document'></i></span><a target='_blank' href='" + pvdoc + "'> Recebeu um Documento</a>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewdoctx(pvdoc, caption, lname, ltime) {
    var msg = "<div class='widget-chat-item left' style='margin-left: 0px; margin-right: 55px;'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6;'>";
    msg += "<span class='step size-21'><i class='icon ion-android-document'></i></span><a target='_blank' href='" + pvdoc + "'> Recebeu um Documento</a><br>";
    msg += "<span class='blahspan' style='padding: 5px; display: none;'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}


//******************************************************************************************************************************
//*********|---------|****|*****************************************************************************************************
//*********|*********|****|*****************************************************************************************************
//*********|*********|****|*****************************************************************************************************
//*********|*********|****|*****************************************************************************************************
//*********|---------|****|*****************************************************************************************************
//*********|\*************|*****************************************************************************************************
//*********|*\************|*****************************************************************************************************
//*********|**\***********|*****************************************************************************************************
//*********|***\**********|*****************************************************************************************************
//*********|****\*********|*****************************************************************************************************
//******************************************************************************************************************************

function previewimgtxr(pvimg, lname, ltime, caption) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text far fa-images' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<a target='_blank' href='" + pvimg + "'><img src='" + pvimg + "' alt='Smiley face' style='max-width: 15vw;'></a><br>";
    //msg += "<span class='step size-21'><i class='icon ion-image'></i></span><a target='_blank' href='" + pvimg + "'> Enviou uma Imagem</a></i><br>";
    msg += "<span class='blahspan' style='padding: 5px'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewimgr(pvimg, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text far fa-images' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<a target='_blank' href='" + pvimg + "'><img src='" + pvimg + "' alt='Smiley face' style='max-width: 15vw;'></a><br>";
    //msg += "<span class='step size-21'><i class='icon ion-image'></i></span><a target='_blank' href='" + pvimg + "'> Enviou uma Imagem</a></i><br>";
    msg += "</div>";
    msg += "</div>";


    return (msg);
}



//******************************************************************************************************************************

function previewvidtx(pvvid, caption, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #f4f4f4; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-videocam'></i></span><a target='_blank' href='" + pvvid + "'> Enviou um Video</a><br>";
    msg += "<span class='blahspan' style='padding: 5px'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewvidr(pvvid, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #f4f4f4; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-videocam'></i></span><a target='_blank' href='" + pvvid + "'> Enviou um Video</a><br>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

//******************************************************************************************************************************

function previewaudr(pvaud, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-24'><i class='icon ion-ios-musical-note'></i></span><a target='_blank' href='" + pvaud + "'> Enviou um Audio</a><br>";
    msg += "</div>";
    msg += "</div>";
    return (msg);
}

function previewaudtxr(pvaud, caption, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style='background-color: #dcf8c6; word-wrap: break-word'>";
    msg += "<span class='step size-21'><i class='icon ion-ios-musical-note'></i></span><a target='_blank' href='" + pvaud + "'> Recebeu um Audio</a><br>";
    msg += "<span class='blahspan' style='padding: 5px'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewdocr(pvdoc, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px;'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style=''>";
    msg += "<span class='step size-21'><i class='icon ion-android-document'></i></span><a target='_blank' href='" + pvdoc + "'> Enviou um Documento</a>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

function previewdoctxr(pvdoc, caption, lname, ltime) {
    var msg = "<div class='widget-chat-item right' style='margin-right: 0px; margin-left: 55px;'>";
    msg += "<span class='widget-chat-date pull-right'>" + ltime + "</span>";
    msg += "<div class='widget-chat-heading'><a href='#' title=''>" + lname + "</a></div>";
    msg += "<div class='widget-chat-text' style=''>";
    msg += "<span class='step size-21'><i class='icon ion-android-document'></i></span><a target='_blank' href='" + pvdoc + "'> Enviou um Documento</a><br>";
    msg += "<span class='blahspan' style='padding: 5px; background-color: #f4f4f4; display:none;'>" + caption + "</span>";
    msg += "</div>";
    msg += "</div>";

    return (msg);
}

//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************
//******************************************************************************************************************************


function conversor_remessa(data) {

    var dateTime = new Date(data);
    var minutos = dateTime.getMinutes();
    var horas = dateTime.getHours();
    var segundos = dateTime.getSeconds();
    if (horas < 10) {
        horas = "0" + horas;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }
    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    if (segundos == 0) {
        segundos = "00";
    }
    var dataFormatada = (horas + ":" + minutos);
    return (dataFormatada);
}
