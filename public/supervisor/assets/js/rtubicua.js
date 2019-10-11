(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.rtUbicuaPlatform = factory();
  }
}(this, function () {
  'use strict';

  function attachOnLoadHandler(cb) {
    if (window.attachEvent) {
      window.attachEvent('onload', cb);
    } else if (window.onload) {
      var curronload = window.onload;

      window.onload = function (evt) {
        curronload(evt);
        cb(evt);
      };
    } else {
      window.onload = cb;
    }
  }

  var rtUbicuaPlatform = (function () {

    // Constants
    var key = "a02c7f8c8bf9635037eb5653302f8b84";
    var cluster = "br";
    var application = 2;
    var encrypted = true;
    var socket = null;

    function initialize() {

      socket = io.connect('https://ccs.sanofi-mobile.com.br');

      socket.on('connect', function () {
        console.log("Conectado ao RT Ubicua Platform !");
      });

      socket.on('disconnect', function () {
        console.log("Aplicação Desconectado do RT Ubicua Platform !");
      });

      socket.on('bi-auth', function (payload) {
        if (payload.response == 1) {
          sessionStorage.setItem('fkid', payload.id);
          sessionStorage.setItem('fkname', payload.nome);
          window.location.href = "chat.html";
        } else if (payload.response == 2) {
          alert('Usuário Bloqueado !');
        } else if (payload.response == 3) {
          alert('Senha Inválida !');
        } else if (payload.response == 4) {
          alert('Usuário Inválido !');
        } else if (payload.response == 5) {
          alert('Login Não Autorizado !');
        } else if (payload.response == -1) {
          socket.disconnect(true);
        }
      });

    }

    function onlogin(fkname, fkpass) {
      var payload = { fkname: fkname, fkpass: fkpass, key: key, cluster: cluster, app: application };
      socket.emit('bi-auth', payload);
    }

    function onclose() {
      socket.disconnect(true);
    }

    // Return
    return {
      key: key,
      onlogin: onlogin,
      onclose: onclose,
      initialize: initialize,
    };
  })();

  return rtUbicuaPlatform;
}));

