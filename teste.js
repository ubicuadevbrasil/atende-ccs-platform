// Setup Chatcore Const
const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const redis = require('redis');
const cassandra = require('cassandra-driver');
const bodyparser = require('body-parser');
const md5 = require('md5');
const helmet = require('helmet');
const foreachasync = require('foreachasync').forEachAsync;
const cors = require('cors');
const request = require('request');
const emoji = require('emoji');
const excel = require('exceljs');
const http = require('http');
const cdn = "https://cdn.ubicuacloud.com/file/";
// Let Port
let port = process.env.PORT;
if (port == null || port == "") {
    port = 443;
    //console.log('Listening to port ' + port);
}
// User & Fila Vars
var users = [];
var filain = [];
// Function Platforma Ubicua
require('ubc/tools.js')();
var dbcc = require('ubc/dbcc.js');
// HTTPS OPTIONS
var options = {
    key: fs.readFileSync("/etc/letsencrypt/live/atende.ubicuacloud.com.br/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/atende.ubicuacloud.com.br/fullchain.pem")
};
// Create App
var app = express();
// Core Chat Room
var numUsers = 0;
// WA ENDPOINT OUT
var _host = "LON";
// Platform Config
app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use(helmet());

var server = require('https').createServer(options, app);
var io = require('socket.io').listen(server);

io.origins('*:*')

app.post('/api/v1/message', function (req, res, next) {
    var _hostin = "LON";
    var _event = req.body.event;
    if (_event === "message") {
        var _uid = req.body.uid;
        var _dtin = getTimestamp();
        var _contact_uid = req.body.contact.uid;
        var _contact_name = req.body.contact.name;
        var _contact_type = req.body.contact.type;
        var _message_type = req.body.message.type;
        var _message_ack = req.body.message.ack;
        var _message_cuid = req.body.message.cuid;
        var _message_dir = req.body.message.dir;
        var _message_dtm = req.body.message.dtm;
        var _message_type = req.body.message.type;
        var _message_uid = req.body.message.uid;
        var _body_caption = req.body.message.body.caption;
        var _body_mimetype = req.body.message.body.mimetype;
        var _body_size = req.body.message.body.size;
        var _body_thumb = req.body.message.body.thumb;
        var _body_url = req.body.message.body.url;
        var _body_duration = req.body.message.body.duration;
        var _body_contact = req.body.message.body.contact;
        var _body_vcard = req.body.message.body.vcard;
        var _body_name = req.body.message.body.name;
        var _body_lng = req.body.message.body.lng;
        var _body_lat = req.body.message.body.lat;
        if (_contact_uid.indexOf('g.us') > -1) {
            onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
        } else {
            if (_message_type === "chat") {
                _body_text = emoji.unifiedToHTML(req.body.message.body.text);
                var fields = 'body_text,';
                var values = '?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text];
                insertWbox(fields, values, params);
            } else if (_message_type === "image") {
                var fields = 'body_caption, body_mimetype, body_size, body_thumb, body_url,';
                var values = '?, ?, ?, ?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url];
                insertWbox(fields, values, params);
            } else if (_message_type === "video") {
                var fields = 'body_caption, body_mimetype, body_size, body_duration, body_thumb, body_url,';
                var values = '?, ?, ?, ?, ?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_thumb, _body_url];
                insertWbox(fields, values, params);
            } else if (_message_type === "audio") {
                var fields = 'body_caption, body_mimetype, body_size, body_duration, body_url,';
                var values = '?, ?, ?, ?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url];
                insertWbox(fields, values, params);
            } else if (_message_type === "ptt") {
                var fields = 'body_caption, body_mimetype, body_size, body_duration, body_url,';
                var values = '?, ?, ?, ?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url];
                insertWbox(fields, values, params);
            } else if (_message_type === "document") {
                var fields = 'body_caption, body_mimetype, body_size,  body_thumb, body_url,';
                var values = '?, ?, ?, ?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url];
                insertWbox(fields, values, params);
            } else if (_message_type === "vcard") {
                var fields = 'body_contact, body_vcard,';
                var values = '?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_contact, _body_vcard];
                insertWbox(fields, values, params);
            } else if (_message_type === "location") {
                var fields = 'body_name, body_lng, body_lat, body_thumb,';
                var values = '?, ?, ?, ?,';
                var params = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_name, _body_lng, _body_lat, _body_thumb];
                insertWbox(fields, values, params);
            }
        }
        dbcc.query("UPDATE db_sanofi_ccs.tab_config SET waendpoint=? WHERE id=1", [_hostin]);
        res.sendStatus(200);
    } else if (_event == "ack") {
        log("ACK Received", req.body);
        res.sendStatus(200);
    }
});

io.on('connection', function (socket) {

    // VARIABLE GLOBAL
    var addedUser = false;
    var _atendimentos = 10;
    var _registers = 44;

    socket.on('send_alarm', function (payload) {
        log("Novo Alarme Enviado...", payload);
        var _mobile = payload.mobile;
        var _message = payload.message;
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
                log("Response LON", body);
                var _response = JSON.parse(body);
                if (_response.success === true) {
                    log('>>> Alarme Enviando com Sucesso...', '>>> send_alarm')
                }
            });
        });
    });

    socket.on('send_chat', function (payload) {
        log("Nova Mensagem Enviada", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _message = payload.message;
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP", body);
                    var _response = JSON.parse(body);
                    if (_response.success === true) {
                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                            if (result.length > 0) {
                                var _id = _custom_uid;
                                var _sessionid = result[0].sessionid;
                                var _fromid = result[0].fkto;
                                var _fromname = result[0].fkname;
                                var _toid = result[0].mobile;
                                var _toname = result[0].name;
                                var _msgdir = "o";
                                var _msgtype = _type;
                                var _msgtext = _message;
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                                    log("Novo Registro LOG Inserido", _id);
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    socket.on('send_welcome', function (payload) {
        log("Nova Mensagem Enviada Welcome", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _message = "Seja bem vindo a plataforma de atendimento da Ubicua Cloud, estamos em fase de teste, perdÃ£o pela instabilidade.";
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP", body);
                    var _response = JSON.parse(body);
                    if (_response.success === true) {
                        var _id = _custom_uid;
                        var _fromid = 1;
                        var _fromname = "Sistema";
                        var _toid = _mobile;
                        var _msgdir = "o";
                        var _msgtype = _type;
                        var _msgtext = _message;
                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, fromid, fromname, toid, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?)", [_id, _fromid, _fromname, _toid, _msgdir, _msgtype, _msgtext], function (err, result) {
                            log("Novo Registro LOG Inserido", _id);
                        });
                    }
                });
            }
        });
    });

    socket.on('send_outof', function (payload) {
        log("Nova Mensagem Enviada Welcome", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _msgid = payload.id;
        var _message = "Estamos fora do ar.";
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP", body);
                    var _response = JSON.parse(body);
                    if (_response.success === true) {
                        // Armazenando Log da Conversa
                        var _id = _custom_uid;
                        var _fromid = 1;
                        var _fromname = "Sistema";
                        var _toid = _mobile;
                        var _msgdir = "o";
                        var _msgtype = _type;
                        var _msgtext = _message;
                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, fromid, fromname, toid, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?)", [_id, _fromid, _fromname, _toid, _msgdir, _msgtype, _msgtext], function (err, result) {
                            log("Novo Registro LOG Inserido", _id);
                        });
                        dbcc.query("UPDATE db_sanofi_ccs.tab_waboxappin SET status=1 WHERE id=?", [_msgid]);
                    }
                });
            }
        });
    });

    socket.on('bi-listagents', function (payload) {
        dbcc.query("SELECT * FROM tab_usuarios WHERE status=1 ORDER BY nome", [], function (err, result) {
            if (result.length > 0) {
                var _agents = JSON.stringify(result);
                socket.emit('bi-listagents', _agents);
            }
        });
    });

    socket.on('bi-score', function (payload) {
        dbcc.query("SELECT a.usuario , COUNT(*) as atendidas FROM tab_usuarios a INNER JOIN tab_atendein b on a.id = b.fkto GROUP BY a.usuario ", function (err, result) {
            if (result.length > 0) {
                var _score = []
                _score.push(result);
                dbcc.query("SELECT a.usuario , COUNT(*) as encerradas FROM tab_usuarios a INNER JOIN tab_encerrain b on a.id = b.fkto GROUP BY a.usuario ", function (err, result) {
                    if (result.length > 0) {
                        _score.push(result);
                        socket.emit('bi-score', _score);
                    }
                });
            }
        });
    });

    socket.on('bi-getmailing', function (payload) {
        dbcc.query("SELECT * FROM tab_ativo WHERE status=0 ORDER BY nome", function (err, result) {
            if (result.length > 0) {
                var _mailing = JSON.stringify(result);
                socket.emit('bi-getmailing', _mailing);
            } else {
                socket.emit('bi-getmailing', '[]');
            }
        });
    });

    socket.on('bi-mailativo', function (payload) {
        var _tipo = payload.tipo;
        dbcc.query("SELECT * FROM tab_ativo WHERE tipo=? AND status=0 ORDER BY nome", [_tipo], function (err, result) {
            if (result.length > 0) {
                var _mailing = JSON.stringify(result);
                socket.emit('bi-mailativo', _mailing);
            } else {
                socket.emit('bi-mailativo', '');
            }
        });
    });

    socket.on('bi-atendemail', function (payload) {
        var _fkto = payload.fkid;
        var _fkname = payload.fkname;
        var _mobile = payload.mobile;
        var _message = payload.message;
        var _atendir = 'out';
        var _dtin = getTimestamp();
        var _account = null;
        var _photo = null;
        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
            if (result.length == 0) {
                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                    var _sessionid = id[0].UUID;
                    dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname, atendir) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _account, _photo, _fkto, _fkname, _atendir],
                        function (err, result) {
                            if (err) {
                                log("Erro ao Encaminhar Usuario para Atendimento, Erro: " + err);
                            } else {
                                var dataSet = {
                                    mobile: _mobile,
                                    type: "chat",
                                    message: "OlÃ¡, sou o " + _fkname + " do Grupo Sanofi/Medley, temos uma oferta para vocÃª."
                                };
                                sendMyChat(dataSet);
                                updateMailing(_mobile);
                            }
                        });
                });
            } else {
                socket.emit('bi-atendemail', {
                    status: '400'
                });
            }
        });
    });

    socket.on('add_agent', function (payload) {
        var _perfil = payload.perfil;
        var _nome = payload.nome;
        var _usuario = payload.usuario;
        var _senha = payload.senha;
        dbcc.query("INSERT INTO tab_usuarios (id, perfil, nome, usuario, senha) VALUES(uuid(), ?, ?, ?, MD5(?))", [_perfil, _nome, _usuario, _senha], function (err, result) {
            dbcc.query("SELECT * FROM tab_usuarios WHERE status=1", [], function (err, result) {
                if (result.length > 0) {
                    var _agents = JSON.stringify(result);
                    socket.emit('bi-listagents', _agents);
                }
            });
        });
    });

    socket.on('bi-addativo', function (payload) {
        var _nome = payload.nome;
        var _fantasia = payload.fantasia;
        var _mobile = payload.mobile;
        var _tipo = payload.tipo;
        var _cnpj = payload.cnpj;
        var _bandeira = payload.bandeira;
        var _uf = payload.uf;
        var _filename = payload.filename;
        var _flagcampanha = payload.flagcampanha;
        if (_mobile.length < 13) {
            _mobile = "55" + _mobile;
        }
        if (_mobile.length >= 9) {
            const d1 = new Date();
            const d2 = d1 - 604800000;
            const d3 = new Date(d2);
            dbcc.query("SELECT COUNT(*) AS resultCount FROM tab_ativo WHERE dtcadastro BETWEEN '" + d3.toISOString() + "' AND '" + d1.toISOString() + "' AND STATUS = '0';", [], function (err, result) {
                if (result[0].resultCount < 300) {
                    console.log(result[0].resultCount);
                    dbcc.query("SELECT UUID() AS UUID;", [], function (err, result) {
                        if (err) { console.log(err); }
                        var _id = result[0].UUID;
                        dbcc.query("SELECT * FROM tab_ativo WHERE mobile='" + _mobile + "' and status = 0;", function (err, result) {
                            if (result.length < 1) {
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_ativo (id, tipo, nome, nomefantasia, mobile, cnpj, bandeira, uf, filename, flagcampanha) VALUES (?,?,?,?,?,?,?,?,?,?);", [_id, _tipo, _nome, _fantasia, _mobile, _cnpj, _bandeira, _uf, _filename, _flagcampanha], function (err, result) {
                                    if (err) { console.log(err); }
                                    dbcc.query("SELECT * FROM tab_ativo WHERE status=0", [], function (err, result) {
                                        if (err) { console.log(err); }
                                        if (result.length > 0) {
                                            var _ativo = JSON.stringify(result);
                                            socket.emit('bi-addativo', _ativo);
                                            return '200'
                                        }
                                    });
                                });
                            }
                        });
                    });
                } else {
                    socket.emit('maillimite', 'MAX');
                }
            });
        }
    });

    socket.on('upd_agent', function (payload) {
        var _id = payload.id;
        var _pwd = payload.pwd;
        if (_pwd == false) {
            var _perfil = payload.perfil;
            var _nome = payload.nome;
            var _usuario = payload.usuario;
            dbcc.query("UPDATE tab_usuarios SET perfil=?, nome=?, usuario=? WHERE id=?", [_perfil, _nome, _usuario, _id], function (err, result) {
                dbcc.query("SELECT * FROM tab_usuarios WHERE status=1", [], function (err, result) {
                    if (result.length > 0) {
                        var _agents = JSON.stringify(result);
                        socket.emit('bi-listagents', _agents);
                    }
                });
            });
        } else {
            var _senha = payload.senha;
            dbcc.query("UPDATE tab_usuarios SET senha=MD5(?) WHERE id=?", [_senha, _id], function (err, result) {
                dbcc.query("SELECT * FROM tab_usuarios WHERE status=1", [], function (err, result) {
                    if (result.length > 0) {
                        var _agents = JSON.stringify(result);
                        socket.emit('bi-listagents', _agents);
                    }
                });
            });
        }
    });

    socket.on('del_agent', function (payload) {
        var _id = payload.id;
        dbcc.query("UPDATE tab_usuarios SET status=0 WHERE id=?", [_id], function (err, result) {
            dbcc.query("SELECT * FROM tab_usuarios WHERE status=1", [], function (err, result) {
                if (result.length > 0) {
                    var _agents = JSON.stringify(result);
                    socket.emit('bi-listagents', _agents);
                }
            });
        });
    });

    socket.on('bi-liststa', function (payload) {
        dbcc.query("SELECT * FROM tab_statusen WHERE status=1 ORDER BY descricao", [], function (err, result) {
            if (result.length > 0) {
                var _status = JSON.stringify(result);
                socket.emit('bi-liststa', _status);
            }
        });
    });

    socket.on('add_sta', function (payload) {
        var _descricao = payload.descricao;
        var _pedido = payload.pedido;
        dbcc.query("INSERT INTO tab_statusen (descricao, pedido) VALUES(?, ?)", [_descricao, _pedido], function (err, result) {
            dbcc.query("SELECT * FROM tab_statusen WHERE status=1", [], function (err, result) {
                if (result.length > 0) {
                    var _status = JSON.stringify(result);
                    socket.emit('bi-liststa', _status);
                }
            });
        });
    });

    socket.on('upd_sta', function (payload) {
        var _id = payload.id;
        var _descricao = payload.descricao;
        var _pedido = payload.pedido;
        dbcc.query("UPDATE tab_statusen SET descricao=?, pedido=? WHERE id=?", [_descricao, _pedido, _id], function (err, result) {
            dbcc.query("SELECT * FROM tab_statusen WHERE status=1", [], function (err, result) {
                if (result.length > 0) {
                    var _status = JSON.stringify(result);
                    socket.emit('bi-liststa', _status);
                }
            });
        });
    });

    socket.on('del_sta', function (payload) {
        var _id = payload.id;
        dbcc.query("UPDATE tab_statusen SET status=0 WHERE id=?", [_id], function (err, result) {
            dbcc.query("SELECT * FROM tab_statusen WHERE status=1", [], function (err, result) {
                if (result.length > 0) {
                    var _status = JSON.stringify(result);
                    socket.emit('bi-liststa', _status);
                }
            });
        });
    });

    socket.on('send_media', function (payload) {
        log("Nova Media Enviada", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _hashfile = payload.hashfile;
        var _descfile = payload.descfile;
        var _urlbox = false;
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                if (_type == "image") {
                    _urlbox = 'https://www.waboxapp.com/api/send/image';
                } else {
                    _urlbox = 'https://www.waboxapp.com/api/send/media';
                }
                request.post({ url: 'https://www.waboxapp.com/api/send/image', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, url: cdn + _hashfile } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP", body);
                    var _response = JSON.parse(body);
                    if (_response.success === true) {
                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                            if (result.length > 0) {
                                var _id = _custom_uid;
                                var _sessionid = result[0].sessionid;
                                var _fromid = result[0].fkto;
                                var _fromname = result[0].fkname;
                                var _toid = result[0].mobile;
                                var _toname = result[0].name;
                                var _msgdir = "o";
                                var _msgtype = _type;
                                var _msgurl = cdn + _hashfile;
                                var _msgcaption = _descfile;
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
                                    log("Novo Registro LOG Inserido", _id);
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    socket.on('send_picture', function (payload) {
        log("Nova Picture Enviada", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _hashfile = payload.hashfile;
        var _descfile = payload.descfile;
        var _urlbox = false;
    });

    socket.on('send_register', function (payload) {
        var _mobile = payload.mobile;
        var _name = payload.name;
        dbcc.query("UPDATE db_sanofi_ccs.tab_atendein SET name=? WHERE mobile=?", [_name, _mobile], function (err, result) {
            dbcc.query("SELECT sessionid, mobile, name, account, photo FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                if (result.length > 0) {
                    var _sessionid = result[0].sessionid;
                    var _mobile = result[0].mobile;
                    var _name = result[0].name;
                    var _account = result[0].account;
                    var _photo = result[0].photo;
                    payload = { sessionid: _sessionid, mobile: _mobile, name: _name, account: _account, photo: _photo };
                    socket.emit('receive_register', payload);
                }
            });
        });
    });

    socket.on('bi-close_chat', function (payload) {
        var _mobile = payload.mobile;
        var _status = payload.status;
        var _cnpj = payload.cnpj;
        var _pedidos = payload.pedidos;
        var _atendir = payload.atendir;
        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
            if (result.length > 0) {
                var _sessionid = result[0].sessionid;
                var _encmessage = "Atendimento encerrado, obrigado pela participaÃ§Ã£o.";
                var _mobile = result[0].mobile;
                var _dtin = result[0].dtin;
                var _dtat = result[0].dtat;
                var _name = result[0].name;
                var _account = result[0].account;
                var _photo = result[0].photo;
                var _fkto = result[0].fkto;
                var _fkname = result[0].fkname;
                var _transfer = result[0].transfer;
                if (_transfer == null || _transfer == "") {
                    _transfer = 0;
                }
                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                    var _custom_uid = id[0].UUID;
                    request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _encmessage } }, function (err, httpResponse, body) {
                        log("Response WABOXAPP", body);
                        var _response = JSON.parse(body);
                        if (_response.success === true) {

                        }
                    });
                });
                dbcc.query("INSERT INTO db_sanofi_ccs.tab_encerrain (sessionid, mobile, dtin, dtat, name, account, photo, fkto, fkname, status, cnpj, transfer, atendir) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _dtat, _name, _account, _photo, _fkto, _fkname, _status, _cnpj, _transfer, _atendir], function (err, result) {
                    if (err) log("ERR" + err)
                    for (i = 0; i < _pedidos.length; i++) {
                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_pedidos (id, sessionid, segmento, pedido, valor) VALUES(uuid(), ?, ?, ?, ?)", [_sessionid, _pedidos[i].segmento, _pedidos[i].pedido, _pedidos[i].valor]);
                    }
                    dbcc.query("DELETE FROM db_sanofi_ccs.tab_atendein WHERE sessionid=?", [_sessionid]);
                    payload = { sessionid: _sessionid, mobile: _mobile };
                    socket.emit('bi-close_chat', payload);
                });
            }
        });
    });

    socket.on('bi-atendein', function (payload) {
        log("EVENT: bi-atendein", payload);
        dbcc.query("SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cnpj, B.nomefantasia, B.flagcampanha,  B.tipo FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile WHERE A.fkto=?", [payload.fkid], function (err, result) {
            if (result.length > 0) {
                var _contacts = JSON.stringify(result);
                var _sessionlist = "";
                for (i = 0; i < result.length; i++) {
                    if (result.length - 1 == i) {
                        _sessionlist += "'" + result[i].sessionid + "'";
                    } else {
                        _sessionlist += "'" + result[i].sessionid + "',";
                    }
                }
                dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                    var _logs = JSON.stringify(result);
                    socket.emit('bi-atendein', { contacts: _contacts, logs: _logs });
                });
            } else {
                socket.emit('bi-atendein', { contacts: [], logs: [] });
            }
        });
    });

    socket.on('bi-transferagent', function (payload) {
        log("Transfer Agent............................", payload);
        var _mobile = payload.mobile;
        var _transferid = payload.fkid;
        var _transfername = payload.fkname;
        var _message = payload.message;
        var _fkonline = false;
        for (var i in io.sockets.connected) {
            var _fkid = io.sockets.connected[i].fkid;
            if (_fkid === _transferid) {
                socket.to(i).emit('bi-transferok', payload);
                _fkonline = true;
            }
        }
        if (_fkonline == true) {
            dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                var _custom_uid = id[0].UUID;
                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                    if (result.length > 0) {
                        var _id = _custom_uid;
                        var _sessionid = result[0].sessionid;
                        var _fromid = result[0].fkto;
                        var _fromname = result[0].fkname;
                        var _toid = result[0].mobile;
                        var _toname = result[0].name;
                        var _msgdir = "o";
                        var _msgtype = "transfer";
                        var _msgtext = _message;
                        var _atendir = result[0].atendir;
                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                            log("Novo Registro LOG de Transferï¿½ncia Inserido", _id);
                            if (err) {
                                log(err);
                            } else {
                                dbcc.query('UPDATE tab_atendein SET transfer=1, fkto=?, fkname=? WHERE mobile=?', [_transferid, _transfername, _mobile], function (err, result) {
                                    if (err) {
                                        log(err);
                                    } else {
                                        payload = { mobile: _mobile, fkid: _transferid, fkname: _transfername, status: 1, atendir: _atendir };
                                        socket.emit('bi-transferagent', payload);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } else {
            payload = { mobile: _mobile, fkid: _transferid, fkname: _transfername, status: 0 };
            socket.emit('bi-transferagent', payload);
        }
    });

    socket.on('bi-transferok', function (payload) {
        dbcc.query("SELECT sessionid, mobile, account, photo FROM tab_atendein WHERE mobile=?", [payload.mobile], function (err, result) {
            if (result.length > 0) {
                var _contacts = JSON.stringify(result);
                var _sessionlist = "";
                for (i = 0; i < result.length; i++) {
                    if (result.length - 1 == i) {
                        _sessionlist += "'" + result[i].sessionid + "'";
                    } else {
                        _sessionlist += "'" + result[i].sessionid + "',";
                    }
                }
                dbcc.query("SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                    var _logs = JSON.stringify(result);
                    socket.emit('bi-atendein', { contacts: _contacts, logs: _logs });
                });
            } else {
                socket.emit('bi-atendein', { contacts: [], logs: [] });
            }
        });
    });

    socket.on('bi-historyone', function (payload) {
        dbcc.query("SELECT sessionid, dtin, mobile, account, photo FROM tab_encerrain WHERE sessionid=? ORDER BY dtin DESC LIMIT 1", [payload.sessionid], function (err, result) {
            if (result.length > 0) {
                var _contacts = JSON.stringify(result);
                var _sessionlist = "";
                for (i = 0; i < result.length; i++) {
                    if (result.length - 1 == i) {
                        _sessionlist += "'" + result[i].sessionid + "'";
                    } else {
                        _sessionlist += "'" + result[i].sessionid + "',";
                    }
                }
                dbcc.query("SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                    var _logs = JSON.stringify(result);
                    socket.emit('bi-historyone', { contacts: _contacts, logs: _logs });
                });
            } else {
                socket.emit('bi-historyone', { contacts: [], logs: [] });
            }
        });
    });

    socket.on('bi-lasthistory', function (payload) {
        dbcc.query("SELECT sessionid, dtin, mobile, account, photo FROM tab_encerrain WHERE mobile=? ORDER BY dtin DESC LIMIT 1", [payload.mobile], function (err, result) {
            if (result.length > 0) {
                var _contacts = JSON.stringify(result);
                var _sessionlist = "";
                for (i = 0; i < result.length; i++) {
                    if (result.length - 1 == i) {
                        _sessionlist += "'" + result[i].sessionid + "'";
                    } else {
                        _sessionlist += "'" + result[i].sessionid + "',";
                    }
                }
                dbcc.query("SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                    var _logs = JSON.stringify(result);
                    socket.emit('bi-lasthistory', { contacts: _contacts, logs: _logs });
                });
            } else {
                socket.emit('bi-lasthistory', { contacts: [], logs: [] });
            }
        });
    });

    socket.on('bi-report1toxlsx', function (payload) {
        var _params = payload.params;
        var qry = "SELECT tab_encerrain.sessionid, cnpj, atendir, tab_usuarios.nome as atendente, substr(mobile, 3, 11) as mobile, DATE_FORMAT(dtin, '%H:%i') as hora, ";
        qry += "DATE_FORMAT(dtin, '%d/%m/%Y') as data, (tab_statusen.descricao) as status, tab_pedidos.pedido, tab_pedidos.segmento, tab_pedidos.valor FROM tab_encerrain ";
        qry += "LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) LEFT JOIN tab_pedidos ";
        qry += "ON (tab_encerrain.sessionid = tab_pedidos.sessionid) WHERE " + _params + " ORDER BY dtin, sessionid;";
        dbcc.query(qry, [], function (err, result) {
            if (err) {
                log("Erro: " + err);
            } else {
                var workbook = excel.Workbook;
                var wb = new workbook();
                var ws = wb.addWorksheet('report');
                var _line = 2;
                var _path = "public/supervisor/report/";
                var _namexlsx = "report" + Date.now() + ".xlsx";
                ws.getCell('A1').value = "NÃºmero do Cliente";
                ws.getCell('B1').value = "InteraÃ§Ã£o";
                ws.getCell('C1').value = "CNPJ";
                ws.getCell('D1').value = "Nome do Antendente";
                ws.getCell('E1').value = "Hora";
                ws.getCell('F1').value = "Data";
                ws.getCell('G1').value = "Status";
                ws.getCell('H1').value = "No. Pedido";
                ws.getCell('I1').value = "Segmento";
                ws.getCell('J1').value = "Valor";
                var _sessionlast;
                foreachasync(result, function (element, index) {
                    ws.getCell('A' + _line).value = element.mobile;
                    ws.getCell('B' + _line).value = element.atendir;
                    ws.getCell('C' + _line).value = element.cnpj;
                    ws.getCell('D' + _line).value = element.atendente;
                    ws.getCell('E' + _line).value = element.hora;
                    ws.getCell('F' + _line).value = element.data;
                    ws.getCell('G' + _line).value = element.status;
                    ws.getCell('H' + _line).value = element.pedido;
                    ws.getCell('I' + _line).value = element.segmento;
                    ws.getCell('J' + _line).value = element.valor;
                    _line = _line + 1;
                }).then(function () {
                    try {
                        wb.xlsx.writeFile(_path + _namexlsx).then(function () { });
                    } catch (err) {
                        log("Error writing to file ", err);
                    }
                    var payload = { url: "https://ubc.ex-aluno-edu.com.br/supervisor/report/" + _namexlsx };
                    socket.emit('bi-report1toxlsx', payload);
                });
            }
        });
    });

    socket.on('bi-report1', function (payload) {
        var _params = payload.params;
        var _limit = payload.limit;
        var qry = "SELECT count(*) as total FROM tab_encerrain LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) WHERE " + _params;
        dbcc.query(qry, [], function (err, result) {
            if (err) {
                log("Erro: " + err);
            } else {
                var _count = result[0].total;
                if (_count == 0) {
                    var payload = { count: 0, reportadata: '' };
                    socket.emit('bi-report1', payload);
                } else {
                    var qry = "SELECT sessionid, cnpj, atendir, tab_usuarios.nome as atendente, substr(mobile, 3, 11) as mobile, DATE_FORMAT(dtin, '%H:%i') as hora, DATE_FORMAT(dtin, '%d/%m/%Y') as data, (tab_statusen.descricao) as status FROM tab_encerrain LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) WHERE " + _params + " ORDER BY dtin LIMIT " + _limit + ", 20;";
                    console.log(qry);
                    dbcc.query(qry, [], function (err, result) {
                        if (err) {
                            log("Erro: " + err);
                        } else {
                            console.log(result);
                            var _reportdata = [];
                            var _lenchat = result.length - 1;
                            foreachasync(result, function (element, index) {
                                var _sessionid = element.sessionid;
                                var _serialized = {
                                    sessionid: element.sessionid,
                                    cnpj: element.cnpj,
                                    atendente: element.atendente,
                                    mobile: element.mobile,
                                    hora: element.hora,
                                    data: element.data,
                                    status: element.status,
                                    atendir: element.atendir
                                };
                                async function buscapedidos(sid, index) {
                                    var _pedidos = await onPedidos(sid);
                                    _serialized.pedidos = _pedidos;
                                    _reportdata.push(_serialized);
                                    if (_lenchat == index) {
                                        var payload = { count: _count, reportadata: _reportdata };
                                        socket.emit('bi-report1', payload);
                                    }
                                }
                                buscapedidos(_sessionid, index);
                            }).then(function () {
                                log('BI-REPORT1 >>> All searchs have finished!', 'bi-report1');
                            });
                        }
                    });
                }
            }
        });
    });

    socket.on('bi-answer_new_queue', function (payload) {
        var _fkto = payload.fkid;
        var _fkname = payload.fkname;
        dbcc.query('SELECT * FROM tab_filain WHERE status=1 ORDER BY dtin LIMIT 1', [], function (err, result) {
            if (err) {
                log(err);
            } else {
                var _mobile = result[0].mobile;
                var _dtin = result[0].dtin;
                var _account = result[0].account;
                var _photo = result[0].photo;
                var _atendir = result[0].atendir;
                dbcc.query("UPDATE tab_filain SET status=2 WHERE mobile=" + _mobile);
                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                    var _sessionid = id[0].UUID;
                    dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname) VALUES(?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _account, _photo, _fkto, _fkname], function (err, result) {
                        if (err) {
                            log("Erro ao Encaminhar Usuï¿½rio para Atendimento, Erro: " + err);
                        } else {
                            dbcc.query("DELETE FROM tab_filain WHERE mobile=" + _mobile);
                            var payload = {
                                sessionid: _sessionid,
                                mobile: _mobile,
                                account: _account,
                                photo: _photo,
                                atendir: _atendir
                            };
                            console.log(payload);
                            socket.emit('bi-answer_new_queue', payload);
                        }
                    });
                });
            }
        });
    });

    socket.on('bi-statusen', function () {
        dbcc.query('SELECT * FROM tab_statusen WHERE status=1', [], function (err, result) {
            if (err) {
                log(err);
            } else {
                socket.emit('bi-statusen', JSON.stringify(result));
            }
        });
    });

    socket.on('force_disconnect', function (payload) {
        socket.to(payload.socketid).emit('force_disconnect');
    });

    socket.on('sentinel_message_send', function (payload) {
        var _fkonline = false;
        for (var i in io.sockets.connected) {
            var _fkid = io.sockets.connected[i].fkid;
            var _fkname = io.sockets.connected[i].fkname;
            if (_fkid === payload.fkto) {
                var _id = payload.id;
                var _sessionid = payload.sessionid;
                var _fromid = payload.contact_uid;
                var _fromname = payload.name;
                var _toid = payload.fkto;
                var _toname = payload.fkname;
                var _msgdir = "i";
                var _msgtype = payload.message_type;
                var _msgtext = payload.body_text;
                var _msgurl = payload.body_url;
                var _msgcaption = payload.body_caption;
                if (payload.message_type == "chat") {
                    dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                        log("Novo Registro LOG Inserido", _id);
                    });
                } else {
                    dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
                        log("Novo Registro LOG Inserido", _id);
                    });
                }
                socket.to(i).emit('receive_chat', payload);
                _fkonline = true;
            }
        }
        if (_fkonline == false) {
            socket.emit('sentinel_message_user_offline', payload);
        } else {
            dbcc.query("UPDATE db_sanofi_ccs.tab_waboxappin SET status=1 WHERE id=?", [payload.id]);
        }
    });

    socket.on('sentinel_confirm_send', function (payload) {
        socket.broadcast.emit('sentinel_confirm_send', payload);
    });

    socket.on('sentinel_clients_alive', function () {
        var payload = "[";
        for (var i in io.sockets.connected) {
            payload += { fkname: io.sockets.connected[i].fkname, fkdt: io.sockets.connected[i].fkon, fkip: io.sockets.connected[i].fkip };
            socket.broadcast.emit('sentinel_clients_alive');
        }
        socket.broadcast.emit('sentinel_clients_alive');
    });

    socket.on('sentinel_clients_queue', function (payload) {
        dbcc.query('SELECT * FROM db_sanofi_ccs.vw_fila;', [], function (err, result) {
            socket.broadcast.emit('sentinel_clients_queue', result);
        });
        var payload = "[";
        for (var i in io.sockets.connected) {
            linha = '{ "socketid": "' + i +
                '", "fkid": "' + io.sockets.connected[i].fkid +
                '", "fkname": "' + io.sockets.connected[i].fkname +
                '", "fkon": "' + io.sockets.connected[i].fkon +
                '", "fkip": "' + io.sockets.connected[i].fkip +
                '", "fkstatus": "' + io.sockets.connected[i].fkstatus + '"},';
            payload += linha;
        }
        var send = payload.substr(0, payload.length - 1);
        socket.broadcast.emit('sentinel_clients_alive', send + ']');
        dbcc.query("SELECT * FROM vw_agentes", [], function (err, result) {
            if (result.length > 0) {
                socket.broadcast.emit('view_agents', JSON.stringify(result));
            }
        });
    });

    socket.on('bi-auth', function (payload) {
        log("Novo Login de Usuï¿½rio", payload);
        var _fkname = payload.fkname;
        var _fkpass = payload.fkpass;
        var _key = payload.key;
        var _app = payload.app;
        if (_key == "a02c7f8c8bf9635037eb5653302f8b84") {
            dbcc.query('SELECT * FROM tab_usuarios WHERE usuario=? AND status=1 LIMIT 1', [_fkname], function (err, result) {
                if (result.length > 0) {
                    if (_app == 3) {
                        var _senha = result[0].senha;
                        if (md5(_fkpass) == _senha) {
                            var _status = result[0].status;
                            if (_status == 1) {
                                var _id = result[0].id;
                                var _nome = result[0].nome;
                                var payload = { response: 1, id: _id, nome: _nome };
                                socket.emit('bi-auth', payload);
                            } else {
                                socket.emit('bi-auth', { response: 2 });
                            }
                        } else {
                            socket.emit('bi-auth', { response: 3 });
                        }
                    } else if (_app == 2) {
                        if (_app == result[0].perfil) {
                            var _senha = result[0].senha;
                            if (md5(_fkpass) == _senha) {
                                var _status = result[0].status;
                                if (_status == 1) {
                                    var _id = result[0].id;
                                    var _nome = result[0].nome;
                                    var payload = { response: 1, id: _id, nome: _nome };
                                    socket.emit('bi-auth', payload);
                                } else {
                                    socket.emit('bi-auth', { response: 2 });
                                }
                            } else {
                                socket.emit('bi-auth', { response: 3 });
                            }
                        } else {
                            socket.emit('bi-auth', { response: 5 });
                        }
                    } else {
                        socket.emit('bi-auth', { response: 5 });
                    }
                } else {
                    socket.emit('bi-auth', { response: 4 });
                }
            });
        } else {
            socket.emit('bi-auth', { response: -1 });
        }
    });

    socket.on('add user', function (payload) {
        if (addedUser) return;
        socket.fkid = payload.fkid;
        socket.fkname = payload.fkname;
        socket.fkon = socket.handshake.time;
        socket.fkip = socket.handshake.address;
        socket.fkstatus = 'Online';
        log('USUARIO CONECTADO: ' + payload.fkname);
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        socket.broadcast.emit('user joined', {
            fkname: payload.fkname,
            numUsers: numUsers
        });
    });

    socket.on('alive', function () {
        onalive(socket.id);
    });

    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    socket.on('receive_picture', function (payload) {
        socket.emit('receive_picture', payload);
    });

    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;
            socket.disconnect();
        }
    });

    socket.on('sentinel', function () {
        socket.broadcast.emit('timestamp', {
            mili: new Date().getTime()
        });
        onkill();
    });

    socket.on('sentinel_waendpoint', function (payload) {
        dbcc.query("SELECT waendpoint FROM db_sanofi_ccs.tab_config WHERE id=1", [], function (err, result) {
            _host = result[0].waendpoint;
            socket.broadcast.emit('waendpoint', { server: _host });
        });
    });

    socket.on('sentinel_monitor', function (payload) {
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: '5511963684235', custom_uid: _custom_uid, text: payload } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP Monitor", body);
                });
            }
        });
    });

    function onPedidos(_sessionid) {
        return new Promise(function (resolve, reject) {
            dbcc.query("SELECT segmento, pedido, valor FROM tab_pedidos WHERE sessionid=?", [_sessionid], function (err, res) {
                resolve(res);
            });
        });
    }

    function updateMailing(mobile) {
        dbcc.query("UPDATE db_sanofi_ccs.tab_ativo SET status=1 WHERE mobile=" + mobile + "", function (err, res) {
            return res
        });
    }

    function sendMyChatOld(payload) {
        log("Nova Mensagem Enviada", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _message = payload.message;
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP", body);
                    var _response = JSON.parse(body);
                    if (_response.success === true) {
                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                            if (result.length > 0) {
                                var _id = _custom_uid;
                                var _sessionid = result[0].sessionid;
                                var _fromid = result[0].fkto;
                                var _fromname = result[0].fkname;
                                var _toid = result[0].mobile;
                                var _toname = result[0].name;
                                var _msgdir = "o";
                                var _msgtype = _type;
                                var _msgtext = _message;
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                                    log("Novo Registro LOG Inserido", _id);
                                    socket.emit('bi-atendemail', {
                                        status: '200'
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    function sendFirstTextMsg(payload) {
        log("Nova Mensagem Enviada", payload);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _message = payload.message;
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            if (_host == "LON") {
                request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
                    log("Response WABOXAPP", body);
                    var _response = JSON.parse(body);
                    if (_response.success === true) {
                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                            if (result.length > 0) {
                                var _id = _custom_uid;
                                var _sessionid = result[0].sessionid;
                                var _fromid = result[0].fkto;
                                var _fromname = result[0].fkname;
                                var _toid = result[0].mobile;
                                var _toname = result[0].name;
                                var _msgdir = "o";
                                var _msgtype = _type;
                                var _msgtext = _message;
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext)  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                                    log("Novo Registro LOG Inserido", _id);
                                    socket.emit('bi-atendemail', {
                                        status: '200'
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });

    }

    function sendMyChatOld2(payload) {
        sendFirstTextMsg(corJson)
        socket.broadcast.emit('receive_picture', corJson);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _message = payload.message;
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                if (result.length > 0) {
                    var _id = _custom_uid;
                    var _sessionid = result[0].sessionid;
                    var _fromid = result[0].fkto;
                    var _fromname = result[0].fkname;
                    var _toid = result[0].mobile;
                    var _toname = result[0].name;
                    var _msgdir = "o";
                    var _msgtype = _type;
                    var _msgtext = _message;
                    sendMyImagebv(_sessionid, _fromid, _fromname, _toid, _toname);
                    dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                        log("Novo Registro LOG Inserido", _id);
                        socket.emit('bi-atendemail', {
                            status: '200'
                        });
                    });
                }
            });
        });
    }

    function sendMyChat(payload) {
        var corJson = {
            'mobile': payload.mobile,
            'type': payload.type,
            'message': 'AtÃ© 88% de desconto em GenÃ©ricos Medley! Fluconazol atÃ© 88%, Pantoprazol atÃ© 82% e Cetoprofeno atÃ© 81%. Responda essa mensagem e aproveite.'
        }
        sendFirstTextMsg(payload);
        socket.broadcast.emit('receive_picture', corJson);
        var _mobile = payload.mobile;
        var _type = payload.type;
        var _message = 'AtÃ© 88% de desconto em GenÃ©ricos Medley! Fluconazol atÃ© 88%, Pantoprazol atÃ© 82% e Cetoprofeno atÃ© 81%. Responda essa mensagem e aproveite.';
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                if (result.length > 0) {
                    var _id = _custom_uid;
                    var _sessionid = result[0].sessionid;
                    var _fromid = result[0].fkto;
                    var _fromname = result[0].fkname;
                    var _toid = result[0].mobile;
                    var _toname = result[0].name;
                    var _msgdir = "o";
                    var _msgtype = 'image';
                    var _msgurl = "https://cdn.ubicuacloud.com/file/be5e3ad848e3b86369c0977106fd834b.jpg";
                    var _msgcaption = _message;
                    dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
                        log("Novo Registro LOG Inserido", _id);
                        socket.emit('bi-atendemail', {
                            status: '200'
                        });
                    });
                }
            });
        });
    }

    function sendMyImagebv(_sessionid, _fromid, _fromname, _toid, _toname) {
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
            var _custom_uid = id[0].UUID;
            var _id = _custom_uid;
            var _msgdir = "o";
            var _msgtype = 'image';
            var _msgurl = "https://cdn.ubicuacloud.com/file/be5e3ad848e3b86369c0977106fd834b.jpg";
            var _msgcaption = "";
            dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
                log("Novo Registro LOG Inserido", _id);
            });
        });
    }

});

// Function recusa mensagens de Grupo WhatsApp
function onrefusegroup(mobile) {
    var _mobile = mobile;
    var _message = "Prezado Cliente,\n\nEsse canal nÃ£o permite mensagens a partir de Grupo WhatsApp.";
    dbcc.query("SELECT uuid() as UUID;", function (err, id) {
        var _custom_uid = id[0].UUID;
        request.post({ url: 'https://www.waboxapp.com/api/send/chat', form: { token: 'ba14cf01786e1e3ee7309f8b276655155ced3f9bc7975', uid: '5511999698030', to: _mobile, custom_uid: _custom_uid, text: _message } }, function (err, httpResponse, body) {
        });
    });
}

//Function insert new message
function insertWbox(fields, values, params) {
    let insertFields = "INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack," + fields + "status)";
    let insertValues = "VALUES( uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?," + values + "0);"
    let qry = insertFields + " " + insertValues;
    dbcc.query(qry, params, function (err, rows, fields) {
        if (err) {
            log("Erro ao Receber Mensagem do WABOXAPP: " + err);
        } else {
            log("Nova Mensagem Recebida WABOXAPP...", ">>> insertWbox");
        }
    });
}

function onkill() {
    //console.log(new Date() + " >> onKill acionando!");
}

function onalive(fkid) {
    pool.getConnection(function (err, connection) {
        if (err) log(err);
        connection.query('UPDATE db_sanofi_ccscore.tab_fila SET alive=now() WHERE fkid=?', [fkid], function (err, results) {
            if (err) log(err);
            log('::::::::::::::::: ID ATUALIZOU ALIVE...' + fkid);
        });
    });
}

server.listen(port, function () {
    log('Chat Core - Ubicua Cloud Platform - Listening at Port ' + port, '>>> Ubicua Cloud Platform Corpflex 2018');
});

process.on('uncaughtException', function (err) {
    console.error(' ');
    console.error('----- ' + (new Date).toUTCString() + ' ----------------------------------');
    console.error(' ');
    console.error('Erro uncaughtException: ', err.message);
    console.error(err.stack);
    console.error(' ');
    return
});
