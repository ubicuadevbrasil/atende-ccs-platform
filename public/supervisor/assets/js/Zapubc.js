

function histmsg(contacts, logs) {

  var cx = contacts.length;
  console.log(cx);

  var lx = logs.length;
  console.log(lx);

  for (a = 0; a < lx; a++) {
    for (i = 0; i < cx; i++) {

      if (contacts[i].sessionid == logs[a].sessionid) {

        if (logs[a].msgdir === 'i') {

          if (logs[a].msgtype === 'chat') {

            var btime2 = conversor_remessa(logs[a].dt);

            var menu = '';
            menu += msgtxtl(logs[a].msgtext, contacts[i].mobile, btime2);

            $('#chat' + contacts[i].mobile).append(menu);

          } else if (logs[a].msgtype === 'image') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewimgtx(logs[a].msgurl, contacts[i].mobile, btime2, logs[a].msgcaption);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewimg(logs[a].msgurl, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }


          } else if (logs[a].msgtype === 'video') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewvidtx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewvid(logs[a].msgurl, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }

          } else if (logs[a].msgtype === 'ptt') {

            var btime2 = conversor_remessa(logs[a].dt);

            var menu = '';
            menu += previewaud(logs[a].msgurl, contacts[i].mobile, btime2);

            $('#chat' + contacts[i].mobile).append(menu);

          } else if (logs[a].msgtype === 'audio') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewaudtx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewaud(logs[a].msgurl, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }

          } else if (logs[a].msgtype === 'document') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewdoctx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewdoc(logs[a].msgurl, contacts[i].mobile, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }

          }

          //----------------------------------------------------------------------------------------------------------------------------------------

        } else if (logs[a].msgdir === 'o') {

          if (logs[a].msgtype === 'chat') {

            var btime2 = conversor_remessa(logs[a].dt);

            var menu = '';
            menu += msgtxtr(logs[a].msgtext, operador, btime2);

            $('#chat' + contacts[i].mobile).append(menu);

          } else if (logs[a].msgtype === 'image') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewimgtxr(logs[a].msgurl, operador, btime2, logs[a].msgcaption);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewimgr(logs[a].msgurl, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }


          } else if (logs[a].msgtype === 'video') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewvidtxr(logs[a].msgurl, logs[a].msgcaption, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewvidr(logs[a].msgurl, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }

          } else if (logs[a].msgtype === 'ptt') {

            var btime2 = conversor_remessa(logs[a].dt);

            var menu = '';
            menu += previewaudr(logs[a].msgurl, operador, btime2);

            $('#chat' + contacts[i].mobile).append(menu);

          } else if (logs[a].msgtype === 'audio') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewaudrtx(logs[a].msgurl, logs[a].msgcaption, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewaudr(logs[a].msgurl, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }

          } else if (logs[a].msgtype === 'document') {

            var btime2 = conversor_remessa(logs[a].dt);

            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {

              var menu = '';
              menu += previewdoctxr(logs[a].msgurl, logs[a].msgcaption, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            } else {

              var menu = '';
              menu += previewdocr(logs[a].msgurl, operador, btime2);

              $('#chat' + contacts[i].mobile).append(menu);

            }

          }

        }

      } else {

        //console.log('TESTEDERRO');

      }
    }
  }
}

/********************************************************************************************************************************************************/

function hidedivs() {

  var c = document.getElementById("chat11").children;
  console.log(c);

  for (i = 0; i < c.length; i++) {
    c[i].style.display = "none";
  }

}

/********************************************************************************************************************************************************/

function notactive() {

  var c = document.getElementById("ulConversation").children;
  console.log(c);

  for (i = 0; i < c.length; i++) {
    c[i].style.backgroundColor = "#fff";
  }

}

/********************************************************************************************************************************************************/

var imgcontactuid;

function openbox1(mobile) {

  contactuid = mobile;
  imgcontactuid = document.getElementById("i" + contactuid).src;

  console.log('mudei a variavel', mobile);
  console.log(mobile, imgcontactuid);
  $('#namchat11').text(mobile);
  $("#imgchat11").attr('src', imgcontactuid);

  hidedivs();
  notactive();

  document.getElementById("chat" + contactuid).style.display = "block";
  document.getElementById('id' + contactuid).style.backgroundColor = "#e8e8e8";

  var altchat = document.getElementById("chat11");
  var altscroll = document.getElementById("chat" + contactuid).offsetHeight;

  altchat.scrollBy(0, altscroll);

  $('#s' + contactuid).text(0);
  $('#s' + contactuid).fadeOut(1);

}

/********************************************************************************************************************************************************/

function gettime() {
  var d = new Date();
  var bhour = d.getHours();
  var bminute = d.getMinutes();

}

/********************************************************************************************************************************************************/

function attachcp() {

  if (contactuid != "") {

    $('#myModal3').modal();
    console.log('attach');

  } else {

    $('#myModal7').modal();

  }

}

/********************************************************************************************************************************************************/

$('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });

/********************************************************************************************************************************************************/

function pageScroll() {
  var altchat = document.getElementById('chat11');
  var altscroll = document.getElementById('chat11').offsetHeight;

  altchat.scrollBy(0, altscroll);
  //scrolldelay = setTimeout(pageScroll,10);
}

/********************************************************************************************************************************************************/
