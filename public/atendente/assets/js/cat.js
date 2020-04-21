function onhistorytmsg(contacts, logs, area) {

  var cx = contacts.length;
  var lx = logs.length;
  for (a = 0; a < lx; a++) {
    for (i = 0; i < cx; i++) {
      if (contacts[i].sessionid == logs[a].sessionid) {
        if (logs[a].msgdir === 'i') {
          if (logs[a].msgtype === 'chat') {
            var btime2 = conversor_remessa(logs[a].dt);
            var menu = '';
            menu += msgtxtl(logs[a].msgtext, contacts[i].mobile, btime2);
            $('#' + area).append(menu);
          } else if (logs[a].msgtype === 'image') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewimgtx(logs[a].msgurl, contacts[i].mobile, btime2, logs[a].msgcaption);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewimg(logs[a].msgurl, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            }
          } else if (logs[a].msgtype === 'video') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewvidtx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewvid(logs[a].msgurl, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            }
          } else if (logs[a].msgtype === 'ptt') {
            var btime2 = conversor_remessa(logs[a].dt);
            var menu = '';
            menu += previewaud(logs[a].msgurl, contacts[i].mobile, btime2);
            $('#' + area).append(menu);
          } else if (logs[a].msgtype === 'audio') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewaudtx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewaud(logs[a].msgurl, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            }
          } else if (logs[a].msgtype === 'document') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewdoctx(logs[a].msgurl, logs[a].msgcaption, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewdoc(logs[a].msgurl, contacts[i].mobile, btime2);
              $('#' + area).append(menu);
            }
          }
        } else if (logs[a].msgdir === 'o') {
          if (logs[a].msgtype === 'chat') {
            var btime2 = conversor_remessa(logs[a].dt);
            var menu = '';
            menu += msgtxtr(logs[a].msgtext, logs[a].fromname, btime2);
            $('#' + area).append(menu);
          } else if (logs[a].msgtype === 'image') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewimgtxr(logs[a].msgurl, logs[a].fromname, btime2, logs[a].msgcaption);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewimgr(logs[a].msgurl, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            }
          } else if (logs[a].msgtype === 'video') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewvidtxr(logs[a].msgurl, logs[a].msgcaption, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewvidr(logs[a].msgurl, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            }
          } else if (logs[a].msgtype === 'ptt') {
            var btime2 = conversor_remessa(logs[a].dt);
            var menu = '';
            menu += previewaudr(logs[a].msgurl, logs[a].fromname, btime2);
            $('#' + area).append(menu);
          } else if (logs[a].msgtype === 'audio') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewaudrtx(logs[a].msgurl, logs[a].msgcaption, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewaudr(logs[a].msgurl, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            }
          } else if (logs[a].msgtype === 'document') {
            var btime2 = conversor_remessa(logs[a].dt);
            if (logs[a].msgcaption != null && logs[a].msgcaption != "") {
              var menu = '';
              menu += previewdoctxr(logs[a].msgurl, logs[a].msgcaption, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            } else {
              var menu = '';
              menu += previewdocr(logs[a].msgurl, logs[a].fromname, btime2);
              $('#' + area).append(menu);
            }
          }
        }
      } else {}
    }
  }
}
