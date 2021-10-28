/********************************************************************************************************************************************************/

var json;
var socket = io.connect();
var idcontato = 0;

/********************************************************************************************************************************************************/

socket.on('connect', function () {
  //alert("Connectado ao Socket.IO");

  socket.emit('bi-atendein', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337' });

  //socket.emit('add user', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337', fkname: 'Bruno Ferreira' });
});

var operador = "João";

/********************************************************************************************************************************************************/

socket.on('disconnect', function () {
  //alert("Desconectou");
});

/********************************************************************************************************************************************************/

socket.on('sentinel_clients_queue', function (payload) {
  var json = payload;
  $('#filain').text(payload[1].total);
  $('#nvatend').removeClass('form-loading');
});

/********************************************************************************************************************************************************/

socket.on('bi-close_chat', function (payload) {

  var json = payload;

  $('#contatos').removeClass('form-loading');

  $('#id' + json.mobile).remove();
  $('#chat' + json.mobile).remove();
  $("#imgchat11").attr('src', '');
  $('#namchat11').text('');


  contactuid = "";

  hidedivs();

  $('#newchat').fadeIn(1);

  $('#contatos').removeClass('form-loading');

});


/********************************************************************************************************************************************************/

socket.on('receive_register', function (payload) {

  var json = payload;

  console.log('receber nome', json);

  var mobid = json.mobile;

  $('#a' + mobid).text(json.name);
  $('#namchat11').text(json.name);

  if (json.photo != null) {
    $("#imgchat11").attr('src', 'http://appwa.ubicuacloud.com:443/file/' + json.photo);
  }

  if (json.account != null) {

  }

});

/********************************************************************************************************************************************************/

socket.on('bi-answer_new_queue', function (payload) {

  console.log(payload);
  console.log('acumulador');

  idcontato = idcontato + 1;
  console.log(idcontato);

  var numac = payload.mobile;


  console.log('a', payload.account);
  console.log('b', payload.mobile);

  var menu = '';
  menu += modalpis('', payload.mobile, payload.account, payload.photo);

  $('#ulConversation').append(menu);
  console.log('novo atendimento');

  var menu2 = '';
  menu2 += chatbox1(payload.mobile);

  if (document.getElementById("chat" + payload.mobile) == null) {
    $('#chat11').append(menu2);
  }

  if (payload.account != null) {

    console.log('pq?');
    $('#ac' + numac).show();
  } else {

    console.log('pq?2');
    $('#ac' + numac).hide();
  }

});

/********************************************************************************************************************************************************/

socket.on('bi-atendein', function (payload) {

  console.log(payload);
  console.log(payload.logs);

  if (payload.logs.length > 0 && payload.contacts.length > 0) {
    var logs = JSON.parse(payload.logs);
    var contacts = JSON.parse(payload.contacts);

    var cx = contacts.length;
    console.log(cx);

    var lx = logs.length;
    console.log(lx);

    for (i = 0; i < cx; i++) {

      $('#chat' + contacts[i].mobile).empty();

      if (contacts[i].account != null) {

        if (document.getElementById("id" + contacts[i].mobile) == null) {
          var menu = '';
          menu += modalpis('', contacts[i].mobile, contacts[i].account, contacts[i].photo);

          $('#ulConversation').append(menu);
          console.log('novo atendimento');

        }

        var menu2 = '';
        menu2 += chatbox1(contacts[i].mobile);

        if (document.getElementById("chat" + contacts[i].mobile) == null) {
          $('#chat11').append(menu2);
        }

      } else {

        if (document.getElementById("id" + contacts[i].mobile) == null) {
          var menu = '';
          menu += modalpis('', contacts[i].mobile, '', contacts[i].photo);

          $('#ulConversation').append(menu);
          console.log('novo atendimento');

        }

        var menu2 = '';
        menu2 += chatbox1(contacts[i].mobile);

        if (document.getElementById("chat" + contacts[i].mobile) == null) {
          $('#chat11').append(menu2);
        }

      }

      if (contacts[i].account != null) {

        console.log('com conta?');
        $('#ac' + contacts[i].mobile).show();
      } else {

        console.log('sem conta?');
        $('#ac' + contacts[i].mobile).hide();

      }

    }

    histmsg(contacts, logs);

  }

  socket.emit('add user', { fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337', fkname: 'Bruno Ferreira' });

});


/********************************************************************************************************************************************************/

$("#addfila").on("click", function () {
  socket.emit('zerafila');
  console.log('zerafila');
});

/********************************************************************************************************************************************************/

var msg = "";
var btype = "";
var bmessage = "";
var bcaption = "";
var contactuid = "";

socket.on('receive_chat', function (payload) {
  msg = payload;
  console.log(msg);

  btype = msg.message_type;
  console.log(btype);

  var d = new Date();
  var bhour = d.getHours();
  var bminute = d.getMinutes();

  var btime = '' + bhour + ':' + bminute + '';

  if (btype == 'chat') {

    bmessage = msg.body_text;
    var contact_uid = msg.contact_uid;

    var menu = '';
    menu += msgtxtl(bmessage, contact_uid, btime);

    $('#chat' + contact_uid).append(menu);

    var notifica = $('#s' + contact_uid).text();
    console.log(notifica);
    notifica = Number(notifica) + 1;
    $('#s' + contact_uid).text(notifica);
    $('#s' + contact_uid).fadeIn(1);

  } else if (btype == 'image') {

    bmessage = msg.body_url;
    var contact_uid = msg.contact_uid;
    bcaption = msg.body_caption;

    if (bcaption != '') {
      var menu = '';
      menu += previewimgtx(msg.body_url, contact_uid, btime, bcaption);
      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    } else {
      var menu = '';
      menu += previewimg(msg.body_url, contact_uid, btime);
      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    }

  } else if (btype == 'video') {

    bmessage = msg.body_url;
    var contact_uid = msg.contact_uid;
    bcaption = msg.body_caption;

    if (bcaption != '') {
      var menu = '';
      menu += previewvidtx(bmessage, bcaption, contact_uid, btime);
      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    } else {
      var menu = '';
      menu += previewvid(bmessage, contact_uid, btime);
      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    }

  } else if (btype == 'ptt') {

    bmessage = msg.body_url;
    var contact_uid = msg.contact_uid;

    var menu = '';
    menu += previewaud(bmessage, contact_uid, btime);
    $('#chat' + contact_uid).append(menu);

    var notifica = $('#s' + contact_uid).text();
    console.log(notifica);
    notifica = Number(notifica) + 1;
    $('#s' + contact_uid).text(notifica);
    $('#s' + contact_uid).fadeIn(1);

  } else if (btype == 'audio') {

    bmessage = msg.body_url;
    var contact_uid = msg.contact_uid;
    bcaption = msg.body_caption;

    if (bcaption != '') {
      var menu = '';
      menu += previewaudtx(bmessage, bcaption, contact_uid, btime);
      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    } else {
      var menu = '';
      menu += previewaud(bmessage, contact_uid, btime);
      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    }

  } else if (btype == 'document') {

    bmessage = msg.body_url;
    var contact_uid = msg.contact_uid;
    bcaption = msg.body_caption;

    if (bcaption != '') {

      var menu = '';
      menu += previewdoctx(bmessage, bcaption, contact_uid, btime);

      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    } else {

      var menu = '';
      menu += previewdoc(bmessage, contact_uid, btime);

      $('#chat' + contact_uid).append(menu);

      var notifica = $('#s' + contact_uid).text();
      console.log(notifica);
      notifica = Number(notifica) + 1;
      $('#s' + contact_uid).text(notifica);
      $('#s' + contact_uid).fadeIn(1);

    }

  }

});

/********************************************************************************************************************************************************/

$("#nvatend").on("click", function () {

  console.log('hoppi');
  var _filain = $('#filain').text();

  if (_filain > 0) {

    json = {
      fkid: 'a05c3708-32b3-11e8-9d7a-000c29369337',
      fkname: 'Bruno Ferreira'
    };

    console.log(json);
    socket.emit('bi-answer_new_queue', json);
    $('#nvatend').addClass('form-loading');

  } else {

    let modalTitle = "Aviso";
	let modalDesc = "Não Há Contatos na Fila!";
	callWarningModal(modalTitle,modalDesc)

  }

});

/********************************************************************************************************************************************************/

$("#sendmsgtxt").on("click", function () {

  console.log('hoppi');
  var msgtext = $('#inputmsgtxt').val();

  if (contactuid != "") {
    if (msgtext != '') {

      var json2 = {
        mobile: contactuid,
        type: "chat",
        message: "" + msgtext + ""
      }

      console.log(json2);
      socket.emit('send_chat', json2);

      var d = new Date();
      var bhour = d.getHours();
      var bminute = d.getMinutes();

      var btime = '' + bhour + ':' + bminute + '';

      var menu = '';
      menu += msgtxtr(json2.message, operador, btime);

      $('#chat' + contactuid).append(menu);

      console.log('final');

      $('#inputmsgtxt').val(null);

    } else {
      let modalTitle = "Aviso";
	let modalDesc = "Campo de Texto Vazio!";
	callWarningModal(modalTitle,modalDesc)
    }
  } else {
    let modalTitle = "Aviso";
let modalDesc = "Nenhum Atendimento Iniciado!";
callWarningModal(modalTitle,modalDesc)
  }



});

/********************************************************************************************************************************************************/

$('#bootbox-prompt').on('click', function () {

  if (contactuid != "") {

    bootbox.prompt({
      title: 'Registrar Nome',

      callback: function (result) {


        if (result == null) {

          alert('Registro Cancelado');

        } else if (result != null) {

          console.log(result);

          var json2 = {

            mobile: contactuid,
            name: result
          }

          console.log(json2);

          socket.emit('send_register', json2);

        }
      },


    });

  } else {
    let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle,modalDesc)
  }

});

/********************************************************************************************************************************************************/


$('#confirmaenc').on('click', function () {

  if (contactuid != "") {

    var json2 = {

      mobile: contactuid

    }

    console.log(json2);

    $('#contatos').addClass('form-loading');

    socket.emit('bi-close_chat', json2);

  } else {

    let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle,modalDesc)

  }

});

$('#encerrafila').on('click', function () {

  if (contactuid != "") {

    $('#myModal2').modal();

  } else {

    let modalTitle = "Aviso";
        let modalDesc = "Nenhum Contato Selecionado!";
        callWarningModal(modalTitle,modalDesc)

  }

});

/********************************************************************************************************************************************************/

var msgz = 0;

$("#btn").on("click", function () {

  console.log('opa');
  $("#ulConversation").html(

    $("#ulConversation").children("li").sort(function (a, b) {

      return $(a).val() - $(b).val();

    })

  );

});


$('#inseririmg').change(function () {
  console.log('bate');
  var file = this.files[0];
  // This code is only for demo ...
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  uplimg();
});

var hashimg = "";
var reshashimg;
var finhashimg;

function uplimg() {
  var file = inseririmg.files[0];
  console.log(">>>> Enviando novo img...");
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  console.log("");
  uploadFileimg(inseririmg.files[0]);

}

function uploadFileimg(file) {
  $('#modalloading').addClass('form-loading');
  var url = 'http://appwa.ubicuacloud.com:443/upload';
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open("POST", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Every thing ok, file uploaded
      console.log(xhr.responseText); // handle response.
      hashimg = xhr.responseText;
      reshashimg = JSON.parse(hashimg);
      finhashimg = reshashimg.hashfile;

      var imgtx = {
        mobile: contactuid,
        type: "image",
        hashfile: finhashimg,
        descfile: ""
      }

      console.log(imgtx);
      socket.emit('send_media', imgtx);

      $('#modalloading').removeClass('form-loading');

      $('#myModal3').modal('hide');

      var d = new Date();
      var bhour = d.getHours();
      var bminute = d.getMinutes();

      var btime = '' + bhour + ':' + bminute + '';


      var menu = '';
      menu += previewimgr('http://appwa.ubicuacloud.com:443/file/' + finhashimg, operador, btime);

      $('#chat' + contactuid).append(menu);

    }
  };
  fd.append("inseririmg", file);
  xhr.send(fd);
  $('#inseririmg').val('');
}

/********************************************************************************************************************************************************/

$('#inserirvid').change(function () {
  console.log('bate');
  var file = this.files[0];
  // This code is only for demo ...
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  uplvid();
});

var hashvid = "";
var reshashvid;
var finhashvid;

function uplvid() {
  var file = inserirvid.files[0];
  console.log(">>>> Enviando novo video...");
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  console.log("");
  uploadFilevid(inserirvid.files[0]);

}

function uploadFilevid(file) {
  $('#modalloading').addClass('form-loading');
  var url = 'http://appwa.ubicuacloud.com:443/upload';
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open("POST", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Every thing ok, file uploaded
      console.log(xhr.responseText); // handle response.
      hashvid = xhr.responseText;
      reshashvid = JSON.parse(hashvid);
      finhashvid = reshashvid.hashfile;

      var vidtx = {
        mobile: contactuid,
        type: "video",
        hashfile: finhashvid,
        descfile: ""
      }

      console.log(vidtx);
      socket.emit('send_media', vidtx);

      $('#modalloading').removeClass('form-loading');

      $('#myModal3').modal('hide');

      var d = new Date();
      var bhour = d.getHours();
      var bminute = d.getMinutes();

      var btime = '' + bhour + ':' + bminute + '';


      var menu = '';
      menu += previewvidr('http://appwa.ubicuacloud.com:443/file/' + finhashvid, operador, btime);

      $('#chat' + contactuid).append(menu);

    }
  };
  fd.append("inserirvid", file);
  xhr.send(fd);
  $('#inserirvid').val('');
}

/********************************************************************************************************************************************************/

$('#inseriraudio').change(function () {
  console.log('bate');
  var file = this.files[0];
  // This code is only for demo ...
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  uplaudio();
});

var hashaudio = "";
var reshashaudio;
var finhashaudio;

function uplaudio() {
  var file = inseriraudio.files[0];
  console.log(">>>> Enviando novo audio...");
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  console.log("");
  uploadFileaudio(inseriraudio.files[0]);

}

function uploadFileaudio(file) {
  $('#modalloading').addClass('form-loading');
  var url = 'http://appwa.ubicuacloud.com:443/upload';
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open("POST", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Every thing ok, file uploaded
      console.log(xhr.responseText); // handle response.
      hashaudio = xhr.responseText;
      reshashaudio = JSON.parse(hashaudio);
      finhashaudio = reshashaudio.hashfile;

      var audiotx = {
        mobile: contactuid,
        type: "audio",
        hashfile: finhashaudio,
        descfile: ""
      }

      console.log(audiotx);
      socket.emit('send_media', audiotx);

      $('#modalloading').removeClass('form-loading');

      $('#myModal3').modal('hide');

      var d = new Date();
      var bhour = d.getHours();
      var bminute = d.getMinutes();

      var btime = '' + bhour + ':' + bminute + '';


      var menu = '';
      menu += previewaudr('http://appwa.ubicuacloud.com:443/file/' + finhashaudio, operador, btime);

      $('#chat' + contactuid).append(menu);

    }
  };
  fd.append("inseriraudio", file);
  xhr.send(fd);
  $('#inseriraudio').val('');
}

/********************************************************************************************************************************************************/

$('#inserirdoc').change(function () {
  console.log('bate');
  var file = this.files[0];
  // This code is only for demo ...
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  upldoc();
});

var hashdoc = "";
var reshashdoc;
var finhashdoc;
var nomedoc;

function upldoc() {
  var file = inserirdoc.files[0];
  console.log(">>>> Enviando novo doc...");
  console.log("name : " + file.name);
  nomedoc = file.name;
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  console.log("");
  uploadFiledoc(inserirdoc.files[0]);

}

function uploadFiledoc(file) {
  $('#modalloading').addClass('form-loading');
  var url = 'http://appwa.ubicuacloud.com:443/upload';
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open("POST", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Every thing ok, file uploaded
      console.log(xhr.responseText); // handle response.
      hashdoc = xhr.responseText;
      reshashdoc = JSON.parse(hashdoc);
      finhashdoc = reshashdoc.hashfile;

      var doctx = {
        mobile: contactuid,
        type: "document",
        hashfile: finhashdoc,
        descfile: nomedoc
      }

      console.log(doctx);
      socket.emit('send_media', doctx);

      $('#modalloading').removeClass('form-loading');

      $('#myModal3').modal('hide');

      var d = new Date();
      var bhour = d.getHours();
      var bminute = d.getMinutes();

      var btime = '' + bhour + ':' + bminute + '';


      var menu = '';
      menu += previewdoctxr('http://appwa.ubicuacloud.com:443/file/' + finhashdoc, nomedoc, operador, btime);

      $('#chat' + contactuid).append(menu);

    }
  };
  fd.append("inserirdoc", file);
  xhr.send(fd);
  $('#inserirdoc').val('');
}

/********************************************************************************************************************************************************/
