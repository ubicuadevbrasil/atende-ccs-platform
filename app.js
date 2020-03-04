// Setup Chat Core Ubicua Cloud Platform
const express = require('express');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const bodyparser = require('body-parser');
const cors = require('cors');
const request = require('request');
const emoji = require('emoji');
const excel = require('exceljs');
const foreachasync = require('foreachasync').forEachAsync;
const helmet = require('helmet');

const port = process.env.PORT || 443;

// Constantes
const cdn = "https://cdn.ubicuacloud.com/file/";
const _mobileUid = "5511969009126@c.us";

// Function Platforma Ubicua
require('ubc/tools.js')();
var dbcc = require('ubc/dbcc.js');

var options = {
        key: fs.readFileSync('/etc/letsencrypt/live/ccs.sanofi-mobile.com.br/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/ccs.sanofi-mobile.com.br/fullchain.pem')
};

// Config App Express
var app = express();
app.use(helmet());
var server = require('https').createServer(options, app);

var io = require('socket.io')(server);

io.origins('*:*')

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

// Request HTTPS
app.get('/.well-known/acme-challenge/GXWwzwd5XBYsP0nuC-_b_sblfG-aaKG3BAIsbX3tc94', function (req, res) {
        res.send('GXWwzwd5XBYsP0nuC-_b_sblfG-aaKG3BAIsbX3tc94.WJdCUT79yCG6vkn1fZDc6qfJm78Ksc0SohKQIFQfIhM');
});

app.get('/alive', function (req, res) {
        console.log(req.ip);
        res.send('Sorry');
});

app.get('/v1/push/keys', function (req, res) {
        console.log('====================================');
        console.log('Push');
        res.sendStatus(200);
        console.log('====================================');
});

app.post('/whatsapp', function (req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var _mobile = req.body.mobile;
        var _msg = req.body.msg;
        console.log(req);
        console.log("Nova Mensagem From: " + _mobile + " >>> " + _msg);
});

app.post('/api/v1/message', function (req, res, next) {

        var _hostin = "LON";
        var _event = req.body.event;
        if (_event === "message") {
                log("Event: Message", req.body);
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
                if (_contact_uid.indexOf('status') < 0) {
                        if (_message_type === "chat") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_text = emoji.unifiedToHTML(req.body.message.body.text);
                                        console.log('======================================\n');
                                        console.log(_body_text);
                                        console.log('======================================\n\n');
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "image") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_caption = req.body.message.body.caption;
                                        var _body_mimetype = req.body.message.body.mimetype;
                                        var _body_size = req.body.message.body.size;
                                        var _body_thumb = req.body.message.body.thumb;
                                        var _body_url = req.body.message.body.url;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "video") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_caption = req.body.message.body.caption;
                                        var _body_mimetype = req.body.message.body.mimetype;
                                        var _body_size = req.body.message.body.size;
                                        var _body_duration = req.body.message.body.duration;
                                        var _body_thumb = req.body.message.body.thumb;
                                        var _body_url = req.body.message.body.url;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_thumb, _body_url";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_thumb, _body_url], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "audio") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_caption = req.body.message.body.caption;
                                        var _body_mimetype = req.body.message.body.mimetype;
                                        var _body_size = req.body.message.body.size;
                                        var _body_duration = req.body.message.body.duration;
                                        var _body_url = req.body.message.body.url;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "ptt") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_caption = req.body.message.body.caption;
                                        var _body_mimetype = req.body.message.body.mimetype;
                                        var _body_size = req.body.message.body.size;
                                        var _body_duration = req.body.message.body.duration;
                                        var _body_url = req.body.message.body.url;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "document") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_caption = req.body.message.body.caption;
                                        var _body_mimetype = req.body.message.body.mimetype;
                                        var _body_size = req.body.message.body.size;
                                        var _body_thumb = req.body.message.body.thumb;
                                        var _body_url = req.body.message.body.url;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size,  body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "vcard") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_contact = req.body.message.body.contact;
                                        var _body_vcard = req.body.message.body.vcard;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_contact, body_vcard, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_contact, _body_vcard";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_contact, _body_vcard], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        } else if (_message_type === "location") {
                                if (_contact_uid.indexOf('g.us') > -1) {
                                        onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
                                } else {
                                        var _body_name = req.body.message.body.name;
                                        var _body_lng = req.body.message.body.lng;
                                        var _body_lat = req.body.message.body.lat;
                                        var _body_thumb = req.body.message.body.thumb;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_name, body_lng, body_lat, body_thumb, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_name, _body_lng, _body_lat, _body_thumb";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_name, _body_lng, _body_lat, _body_thumb], function (err, rows, fields) {
                                                if (err) { log("Erro ao Receber Mensagem do WABOXAPP: " + err); } else { log("Nova Mensagem Recebida WABOXAPP..."); }
                                        });
                                }
                        }
                }

                dbcc.query("UPDATE db_sanofi_ccs.tab_config SET waendpoint=? WHERE id=1", [_hostin]);
                res.sendStatus(200);
        } else if (_event == "ack") {
                log("ACK Received", req.body);
                res.sendStatus(200);
        }
});

app.post('/api/v2/message', function (req, res, next) {

        log("Event: Message", req.body);
        var _key = req.body.token;
        var _type = req.body.event;
        var _hostin = "BRA";
        if (_type === "message") {
                var _uid = req.body.uid;
                var _dtin = getTimestamp();
                var _contact_uid = req.body.contact_uid;
                var _contact_name = req.body.contact_name;
                var _contact_type = req.body.contact_type;
                var _message_ack = req.body.message_ack;
                var _message_cuid = req.body.message_cuid;
                var _message_dir = req.body.message_dir;
                var _message_dtm = req.body.message_dtm;
                var _message_type = req.body.message_type;
                var _message_uid = req.body.message_uid;
                if (_message_type === "chat") {
                        var _body_text = emoji.unifiedToHTML(req.body.body_text);
                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text";
                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text], function (err, rows, fields) {
                                if (err) {
                                        log("Erro ao Receber Mensagem do BRA: " + err);
                                } else {
                                        dbcc.query("UPDATE db_sanofi_ccs.tab_config SET waendpoint=? WHERE id=1", [_hostin]);
                                        log("Nova Mensagem Recebida BRA...");
                                }
                        });
                        res.json({ "key": _key, "ack": "3" });
                }
        } else {
                res.status(200).send('Ok');
        }
});

app.post('/api/bot/transbordo', function (req, res, next) {
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        console.log(req.body);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {
                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'atosBot') && (password == 'd8511353660467bb8e8c68016053bd9e')) {
                        var _cnpj = req.body.cnpj.replace(/[^\w\s]/gi, '');
                        dbcc.query('SELECT * FROM tab_filain WHERE status=1 and mobile=?', [_cnpj], function (err, result) {
                                if (result.length == 0) {
                                        dbcc.query('SELECT * FROM tab_atendein WHERE status=0 and mobile=?', [_cnpj], function (err, result) {
                                                if (result.length == 0) {
                                                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_filain (mobile, sessionBot, status, origem) VALUES (?,?,1,'bot')", [_cnpj, req.body.sessionid], function (err, result) {
                                                                if (err) {
                                                                        console.log(err);
                                                                        res.json({ status: 'falha', resultado: 'err' });
                                                                } else {
                                                                        // Necessario Mandar mensagem de boas vindas via API ATOS
                                                                        var _normal = "Seja bem vindo ao novo canal exclusivo para Clientes Conecta PDV. Adicione esse número de telefone e faça seus pedidos via WhatsApp de segunda a sexta das 09h às 20h.\n\nPara agilizar seu atendimento, por favor informe seu nome e CNPJ.";
                                                                        var _feriado = "Nosso time de analistas está em horário de descanso. Mas fique tranquilo, retornamos no próximo dia útil a partir das 9h pronto para te auxiliar ok?! Fique a vontade para entrar em contato novamente ou aguarde nosso contato. Até mais!";
                                                                        var _treinamento = "Nosso time de analistas está em treinamento. Mas fique tranquilo, assim que possível, entraremos em contato com você neste mesmo número, ok?! Até mais!";
                                                                        var _message = "";
                                                                        dbcc.query('SELECT training from tab_treinamento where id="c102ba05-422c-11ea-8db1-000c290cc03d"', function (err, result) {
                                                                                if (result[0].training == 'true') {
                                                                                        _message = _treinamento
                                                                                        sendWelcome(req.body.sessionid, _cnpj, _message)
                                                                                } else if (new Date().getHours() >= 20) {
                                                                                        _message = _feriado
                                                                                        sendWelcome(req.body.sessionid, _cnpj, _message)
                                                                                }
                                                                        });
                                                                        res.json({ status: '200', resultado: 'Usuario inserido em nossa plataforma' });
                                                                }
                                                        });
                                                } else {
                                                        res.json({ status: '400', resultado: 'Usuario já se encontra em nossa plataforma' });

                                                }
                                        });
                                } else {
                                        res.json({ status: '400', resultado: 'Usuario já se encontra em nossa plataforma' });

                                }
                        });
                } else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
});

app.post('/api/bot/message', function (req, res, next) {
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        console.log(req.body);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {
                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'atosBot') && (password == 'd8511353660467bb8e8c68016053bd9e')) {
                        var _cnpj = req.body.cnpj.replace(/[^\w\s]/gi, '');
                        dbcc.query('SELECT * FROM tab_filain WHERE status=1 and mobile=? and sessionBot=?', [_cnpj, req.body.sessionid], function (err, result) {
                                if (result.length == 0) {
                                        dbcc.query('SELECT * FROM tab_atendein WHERE status=0 and mobile=? and sessionBot=?', [_cnpj, req.body.sessionid], function (err, result) {
                                                if (result.length == 0) {
                                                        res.json({
                                                                status: '400',
                                                                resultado: 'Usuario não se encontra cadastrado em nossa plataforma'
                                                        });
                                                } else {
                                                        var _hostin = "LON";
                                                        var _uid = '5511969009126';
                                                        var _dtin = getTimestamp();
                                                        var _contact_uid = _cnpj;
                                                        var _contact_name = '';
                                                        var _contact_type = 'User';
                                                        var _message_type = 'chat';
                                                        var _message_ack = '2';
                                                        var _message_cuid = '';
                                                        var _message_dir = 'i';
                                                        var _message_dtm = new Date().getTime();
                                                        var _message_uid = 'custom_uid';
                                                        var _body_text = req.body.message;
                                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text";
                                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text], function (err, rows, fields) {
                                                                if (err) {
                                                                        res.json({
                                                                                status: 'falha',
                                                                                resultado: 'err'
                                                                        });
                                                                } else {
                                                                        res.json({
                                                                                status: '200',
                                                                                resultado: 'Mensagem Cadastrada'
                                                                        });
                                                                }
                                                        });
                                                }
                                        });
                                } else {
                                        var _hostin = "LON";
                                        var _uid = '5511969009126';
                                        var _dtin = getTimestamp();
                                        var _contact_uid = _cnpj;
                                        var _contact_name = '';
                                        var _contact_type = 'User';
                                        var _message_type = 'chat';
                                        var _message_ack = '2';
                                        var _message_cuid = '';
                                        var _message_dir = 'i';
                                        var _message_dtm = new Date().getTime();
                                        var _message_uid = 'custom_uid';
                                        var _body_text = req.body.message;
                                        var qry = 'INSERT INTO db_sanofi_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                                        var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text";
                                        dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text], function (err, rows, fields) {
                                                if (err) {
                                                        res.json({
                                                                status: 'falha',
                                                                resultado: 'err'
                                                        });
                                                } else {
                                                        res.json({
                                                                status: '200',
                                                                resultado: 'Mensagem Cadastrada'
                                                        });
                                                }
                                        });
                                }
                        });
                } else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
})

app.post('/api/bot/chat', function (req, res, next) {
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        console.log(req.body);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {
                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'atosBot') && (password == 'd8511353660467bb8e8c68016053bd9e')) {
                        var _cnpj = req.body.cnpj.replace(/[^\w\s]/gi, '');
                        var _sessionBot = req.body.sessionid;
                        var _email = req.body.email;
                        var _origem = 'bot';
                        var _destino, _dten;
                        var _telefone = req.body.telefone;
                        var _chatBot = JSON.stringify(req.body.chat);
                        var _dtin = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        if (req.body.transfer != null && req.body.transfer != '' && req.body.sessionid != null && req.body.sessionid != '') {
                                if (req.body.transfer == 'false') {
                                        _destino = 'bot';
                                        _dten = new Date().toISOString().slice(0, 19).replace('T', ' ');
                                } else {
                                        _destino = 'human';
                                }
                                dbcc.query('SELECT * FROM tab_transbordo WHERE sessionBot=?', [_sessionBot], function (err, result) {
                                        if (result.length == 0) {
                                                dbcc.query("INSERT INTO tab_transbordo (id,cnpj,sessionBot,email,origem,destino,telefone,chatBot,dtin,dten) VALUES (uuid(),?,?,?,?,?,?,?,?,?)", [_cnpj, _sessionBot, _email, _origem, _destino, _telefone, _chatBot, _dtin, _dten], function (err, result) {
                                                        if (err) {
                                                                res.json({ status: 'falha', resultado: err });
                                                        } else {
                                                                res.json({ status: '200', resultado: 'Historico gravado com sucesso' });
                                                        }
                                                });
                                        } else {
                                                if (_dten != null) {
                                                        dbcc.query("UPDATE tab_transbordo SET cnpj = ?, email = ?, telefone = ?, chatBot = ?, destino = ?, dtin = ?, dten = ? WHERE sessionBot = ?;", [_cnpj, _email, _telefone, _chatBot, _destino, _dtin, _dten, _sessionBot], function (err, result) {
                                                                if (err) {
                                                                        res.json({ status: 'falha', resultado: err });
                                                                } else {
                                                                        res.json({ status: '200', resultado: 'Historico atualizado com sucesso' });
                                                                }
                                                        });
                                                } else {
                                                        dbcc.query("UPDATE tab_transbordo SET cnpj = ?, email = ?, telefone = ?, chatBot = ?, destino = ?, dtin = ? WHERE sessionBot = ?;", [_cnpj, _email, _telefone, _chatBot, _destino, _dtin, _sessionBot], function (err, result) {
                                                                if (err) {
                                                                        res.json({ status: 'falha', resultado: err });
                                                                } else {
                                                                        res.json({ status: '200', resultado: 'Historico atualizado com sucesso' });
                                                                }
                                                        });
                                                }

                                        }
                                });
                        }
                } else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
});

app.post('/api/bot/status', function (req, res, next) {
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        console.log(req.body);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {
                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'atosBot') && (password == 'd8511353660467bb8e8c68016053bd9e')) {
                        var _sessionBot = req.body.sessionid;
                        var _consultar_pedido = req.body.consultar_pedido;
                        var _orcamento = req.body.orcamento;
                        var _novo_pedido = req.body.novo_pedido;
                        var _vacina = req.body.vacina;
                        var _convert_compra = req.body.convert_compra;
                        var _pedidos = req.body.pedidos;
                        var _transbordo_intent = req.body.transbordo_intent
                        if (req.body.sessionid != null && req.body.sessionid != '') {
                                dbcc.query(`
                                UPDATE tab_transbordo SET 
                                consultar_pedido = ?, 
                                orcamento = ?, 
                                novo_pedido = ?, 
                                vacina = ?, 
                                convert_compra = ?, 
                                pedidos = ?,
                                transbordo_intent = ?
                                WHERE sessionBot = ?;`,
                                        [_consultar_pedido, _orcamento, _novo_pedido, _vacina, _convert_compra, _pedidos, _transbordo_intent, _sessionBot], function (err, result) {
                                                if (err) {
                                                        console.log(err)
                                                        res.json({ status: 'falha', resultado: err });
                                                } else {
                                                        res.json({ status: '200', resultado: 'Status atualizado com sucesso' });
                                                }
                                        });
                        }
                } else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
});

app.get('/api/ubicua/report', function (req, res, next) {
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        console.log(req.body);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {
                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'ubicua') && (password == '1zvzrAFyIwKhWqIoyRU9whpdBYoK')) {
                        dbcc.query('CALL rt_painelop();', function (err, result) {
                                if (err) {
                                        console.log(err)
                                        res.json({ status: 'falha', resultado: err });
                                } else {
                                        res.json({ status: '200', resultado: result });
                                }
                        });
                } else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
});
// API Report Tracking
app.get('/tracking/api/:dtini/:dtfim', function (req, res) {

        var _dtini = req.params.dtini + ' 00:00:00';
        var _dtfim = req.params.dtfim + ' 23:59:59';
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {

                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'sanofi') && (password == 'S@n0f1_')) {
                        dbcc.query("INSERT INTO tab_api_log (dtable, log) VALUES('tracking', 'granted');");
                        var results = [];
                        dbcc.query("SELECT db_sanofi_ccs.tab_encerrain.*, db_sanofi_ccs.tab_statusen.descricao AS statusd FROM db_sanofi_ccs.tab_encerrain LEFT JOIN db_sanofi_ccs.tab_statusen ON ( db_sanofi_ccs.tab_encerrain.status = db_sanofi_ccs.tab_statusen.id) WHERE db_sanofi_ccs.tab_encerrain.dtin BETWEEN ? AND ? ORDER BY db_sanofi_ccs.tab_encerrain.dtin", [_dtini, _dtfim], function (err, rows, fields) {
                                res.send(JSON.stringify(rows));
                        });
                } else {
                        dbcc.query("INSERT INTO tab_api_log (dtable, log) VALUES('tracking', 'danied');");
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
});

// API Report Pedidos
app.get('/requests/api/:dtini/:dtfim', function (req, res) {

        var _dtini = req.params.dtini + ' 00:00:00';
        var _dtfim = req.params.dtfim + ' 23:59:59';
        var auth = req.headers['authorization'];
        console.log("Authorization Header is: ", auth);
        if (!auth) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                res.end('Sorry! Invalid Authentication.');
        } else if (auth) {

                var tmp = auth.split(' ');
                var buf = new Buffer(tmp[1], 'base64');
                var plain_auth = buf.toString();
                console.log("Decoded Authorization ", plain_auth);
                var creds = plain_auth.split(':');
                var username = creds[0];
                var password = creds[1];
                if ((username == 'sanofi') && (password == 'S@n0f1_')) {
                        dbcc.query("INSERT INTO tab_api_log (dtable, log) VALUES('pedidos', 'granted');");
                        var results = [];
                        dbcc.query("SELECT * FROM tab_pedidos WHERE dtpedido BETWEEN ? and ? ORDER BY dtpedido;", [_dtini, _dtfim], function (err, rows, fields) {
                                res.send(JSON.stringify(rows));
                        });
                } else {
                        dbcc.query("INSERT INTO tab_api_log (dtable, log) VALUES('pedidos', 'granted');");
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.end('Sorry! Unauthorized Access.');
                }
        }
});

// Function recusa mensagens de Grupo WhatsApp
function onrefusegroup(admin) {

        var _mobile = admin;
        var _message = "Prezado Cliente,\n\nEsse canal não permite mensagens a partir de Grupo WhatsApp.";
        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                var _custom_uid = id[0].UUID;
                let teste = {
                        infra: _mobileUid,
                        id: _mobile + '@c.us',
                        msg: _message,
                        media: 'chat'
                }
                request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                });
        });
}

async function loginAtos() {
        return new Promise((resolve, reject) => {
                var _url = 'https://ubicuacloud.appspot.com/api/login/';
                var _payload = {
                        "user_name": "ubicua",
                        "password": "senha$00"
                };
                request.post({ url: _url, form: _payload }, function (err, httpResponse, body) {
                        var __responde = JSON.parse(body);
                        resolve(__responde.token)

                });
        });
}

function sendWelcome(sessionBot, mobile, message) {
        dbcc.query("SELECT uuid() as UUID;", async function (err, id) {
                var _custom_uid = id[0].UUID;
                loginAtos().then(async result => {
                        var _hashToken = result;
                        var options = {
                                auth: {
                                        'bearer': _hashToken
                                },
                                uri: 'https://ubicuacloud.appspot.com/api/transbordo/send-message/' + sessionBot + '/',
                                method: 'POST',
                                json: {
                                        "text": message
                                }
                        };
                        console.log("> Options Configs");
                        await request(options, function (error, response, body) {
                                console.log("statusCode" + response.statusCode);
                                //console.log("body" + response.body);
                                if (!error && response.statusCode == 200) {
                                        console.log("> Bot OK");
                                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [mobile], function (err, result) {
                                                if (result.length > 0) {
                                                        // Armazenando Log da Conversa
                                                        var _id = _custom_uid;
                                                        var _sessionid = result[0].sessionid;
                                                        var _fromid = result[0].fkto;
                                                        var _fromname = result[0].fkname;
                                                        var _toid = result[0].mobile;
                                                        var _toname = result[0].name;
                                                        var _msgdir = "o";
                                                        var _msgtype = 'chat';
                                                        var _msgtext = message;
                                                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
                                                                log("Novo Registro LOG Inserido", _id);
                                                        });
                                                }
                                        });
                                }
                        });
                })
        });
}

// Core Chat Room
var numUsers = 0;
// WA ENDPOINT OUT
var _host = "LON";
io.on('connection', function (socket) {

        // VARIABLE GLOBAL
        var addedUser = false;
        var _atendimentos = 10;
        var _registers = 44;

	/* Descomentar para fazer segurança 4o. nivel
	if ( socket.handshake.headers.referer == "https://ccs.sanofi-mobile.com.br/" ){
		console.log("Origin OK :: " + md5(socket.handshake.headers.referer));
	}else{
		console.log("Origin ERROR :: []");
		socket.emit('denied', {payload: "Servidor RT Ubicua Platform Recursou Sua Conexão..."});
	}*/

        // when the client emits 'new message', this listens and executes
        socket.on('new message', function (payload) {
                // we tell the client to execute 'new message'
                log('Nova Mensagem De: ' + payload.fkid + ' Nome: ' + payload.fkname + ' Para: ' + payload.fkto + ' Mensagem: ' + payload.payload);
                // search user to send message
                socket.broadcast.emit('receive_msg', { fkto: payload.fkto, msg: payload.payload });
                var _userfound = false;
                for (var i in io.sockets.connected) {
                        var _fkid = io.sockets.connected[i].fkid;
                        var _fkname = io.sockets.connected[i].fkname;
                        if (_fkid === payload.fkto) {
                                socket.to(i).emit('new message', { fkname: socket.fkname, msg: payload.msg });
                                socket.broadcast.emit('receive_msg', { fkto: payload.fkto, msg: payload.msg });
                                _userfound = true;
                        }
                }
                if (_userfound == false) {
                        socket.emit('deu bosta', { message: 'User não disponivel' });
                }
        });

        socket.on('nova mensagem', function (payload) {
                socket.broadcast.emit('nova mensagem', {
                        msg: payload.nome,
                        mobile: '11999713755'
                });
        });

        socket.on('send_alarm', function (payload) {
                log("Novo Alarme Enviado...", payload);
                var _mobile = payload.mobile;
                var _message = payload.message;
                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                        var _custom_uid = id[0].UUID;
                        let teste = {
                                infra: _mobileUid,
                                id: _mobile + '@c.us',
                                msg: _message,
                                media: 'chat'
                        }
                        request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                                console.log(teste)
                                log("Response WABOXAPP", body);
                                var _response = body;
                                if (_response === 'ok') {
                                        console.log('Alarme Enviando com Sucesso...')
                                }
                        });
                });
        });

        socket.on('send_chat', async function (payload) {
                log("> Nova Mensagem Enviada", payload);
                var _mobile = payload.mobile;
                var _type = payload.type;
                var _message = payload.message;
                var _host, _sessionBot;
                findHost(_mobile).then(result => {
                        _host = result[0];
                        _sessionBot = result[1];
                        dbcc.query("SELECT uuid() as UUID;", async function (err, id) {
                                var _custom_uid = id[0].UUID;
                                console.log("> UUID PRONTO");
                                if (_host == "wpp") {
                                        let teste = {
                                                infra: _mobileUid,
                                                id: _mobile + '@c.us',
                                                msg: _message,
                                                media: 'chat'
                                        }
                                        request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                                                console.log(teste)
                                                log("Response WABOXAPP", body);
                                                var _response = body;
                                                if (_response === 'ok') {
                                                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                                                                if (result.length > 0) {
                                                                        // Armazenando Log da Conversa
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
                                } else if (_host == "bot") {
                                        console.log("> Bot WAY");
                                        loginAtos().then(async result => {
                                                var _hashToken = result;
                                                var options = {
                                                        auth: {
                                                                'bearer': _hashToken
                                                        },
                                                        uri: 'https://ubicuacloud.appspot.com/api/transbordo/send-message/' + _sessionBot + '/',
                                                        method: 'POST',
                                                        json: {
                                                                "text": _message
                                                        }
                                                };
                                                console.log("> Options Configs");
                                                await request(options, function (error, response, body) {
                                                        console.log("statusCode" + response.statusCode);
                                                        console.log("body" + response.body);
                                                        if (!error && response.statusCode == 200) {
                                                                console.log("> Bot OK");
                                                                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                                                                        if (result.length > 0) {
                                                                                // Armazenando Log da Conversa
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
                                        })
                                }
                        });
                })
        });

        async function findHost(mobile) {
                return new Promise((resolve, reject) => {
                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [mobile], function (err, result) {
                                if (err) {
                                        console.log("> Erro Tratativa Bot: " + err)
                                }
                                if (result[0].origem != "wpp") {
                                        _host = 'bot'
                                        _sessionBot = result[0].sessionBot
                                        resolve([
                                                _host,
                                                _sessionBot
                                        ])
                                        console.log("> Tratativa Selecionada BOT");
                                } else {
                                        _host = 'wpp'
                                        resolve([
                                                _host,
                                                ''
                                        ])
                                        console.log("> Tratativa Selecionada WPP");
                                }
                        });
                })
        }

        socket.on('send_welcome', function (payload) {
                log("Nova Mensagem Enviada Welcome", payload);
                var _mobile = payload.mobile;
                var _type = payload.type;
                //var _message = payload.message;
                var _normal = "Seja bem vindo ao novo canal exclusivo para Clientes Conecta PDV. Adicione esse número de telefone e faça seus pedidos via WhatsApp de segunda a sexta das 09h às 20h.\n\nPara agilizar seu atendimento, por favor informe seu nome e CNPJ.";
                var _feriado = "Nosso time de analistas está em horário de descanso. Mas fique tranquilo, retornamos no próximo dia útil a partir das 9h pronto para te auxiliar ok?! Fique a vontade para entrar em contato novamente ou aguarde nosso contato. Até mais!";
                var _treinamento = "Nosso time de analistas está em treinamento. Mas fique tranquilo, assim que possível, entraremos em contato com você neste mesmo número, ok?! Até mais!";
                var _ok_message = "";

                dbcc.query('SELECT training from tab_treinamento where id="c102ba05-422c-11ea-8db1-000c290cc03d"', function (err, result) {
                        if (err) {
                                log(err)
                        } else {
                                var _message = "";
                                if (result[0].training == 'true') {
                                        _message = _treinamento
                                } else if (new Date().getHours() > 21 || new Date().getHours() < 10) {
                                        _message = _feriado
                                } else {
                                        _message = _ok_message
                                }
                                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                                        var _custom_uid = id[0].UUID;
                                        if (_host == "LON" && _message != _ok_message) {
                                                let teste = {
                                                        infra: _mobileUid,
                                                        id: _mobile + '@c.us',
                                                        msg: _message,
                                                        media: 'chat'
                                                }
                                                request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                                                        console.log(teste)
                                                        log("Response WABOXAPP", body);
                                                        var _response = body;
                                                        if (_response === 'ok') {
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
                                                        }
                                                });
                                        }
                                });
                        }
                });
        });

        // CRUD Atendente/Supervisor
        socket.on('bi-listagents', function (payload) {

                dbcc.query("SELECT * FROM tab_usuarios WHERE status=1 ORDER BY nome", [], function (err, result) {
                        if (result.length > 0) {
                                var _agents = JSON.stringify(result);
                                socket.emit('bi-listagents', _agents);
                        }
                });
        });

        socket.on('add_agent', function (payload) {
                console.log(payload);
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

        socket.on('upd_agent', function (payload) {
                console.log(payload);
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
                console.log(payload);
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

        // CRUD Status de Atendimento
        socket.on('bi-liststa', function (payload) {

                dbcc.query("SELECT * FROM tab_statusen WHERE status=1 ORDER BY descricao", [], function (err, result) {
                        if (result.length > 0) {
                                var _status = JSON.stringify(result);
                                socket.emit('bi-liststa', _status);
                        }
                });
        });

        socket.on('add_sta', function (payload) {
                console.log(payload);
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
                console.log(payload);
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
                console.log(payload);
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
                var _base64 = payload.base64;
                var _urlbox = false;
                dbcc.query("SELECT uuid() as UUID;", async function (err, id) {
                        var _custom_uid = id[0].UUID;
                        if (_host == "LON") {
                                var teste;
                                if (_type != 'document' && _type != 'video') {
                                        teste = {
                                                infra: _mobileUid,
                                                id: _mobile + '@c.us',
                                                msg: '',
                                                media: _type,
                                                image: await loadBase64(_hashfile, _type)
                                        }
                                } else {
                                        teste = {
                                                infra: _mobileUid,
                                                id: _mobile + '@c.us',
                                                msg: cdn + _hashfile,
                                                media: 'chat',
                                        }
                                }
                                request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                                        console.log(teste)
                                        log("Response WABOXAPP", body);
                                        var _response = body;
                                        if (_response === 'ok') {
                                                //dbcc.query("INSERT INTO  db_sanofi_ccs.tab_sikmedia (id, toid, typefile, hashfile, descfile) VALUES(?, ?, ?, ?, ?)", [_custom_uid, _mobile, _type, _hashfile, _descfile]);
                                                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                                                        if (result.length > 0) {
                                                                // Armazenando Log da Conversa
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
                        } else {
                                log("Response BRA");
                                var _message = cdn + _hashfile;
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_outbound (mobile, msg) VALUES(?, ?);", [_mobile + "@c.us", _message], function (err, result) {
                                        dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                                                if (result.length > 0) {
                                                        // Armazenando Log da Conversa
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
                                });
                        }
                });
        });

        function loadBase64(hashFile, fileType) {
                return new Promise(function (resolve, reject) {
                        request.get({ url: "https://cdn.ubicuacloud.com/base64/" + hashFile }, function (err, httpResponse, body) {
                                if (err) {
                                        console.log(err)
                                        //reject(err)
                                }
                                if (fileType == 'image') {
                                        resolve('data:image/jpeg;base64,' + body)
                                } else if (fileType == 'video') {
                                        resolve('data:video/mp4;base64,' + body)
                                } else if (fileType == 'audio') {
                                        resolve('data:audio/mp3;base64,' + body)
                                }
                        })
                })
        }

        socket.on('send_register', function (payload) {
                console.log(payload);
                var _mobile = payload.mobile;
                var _name = payload.name;
                dbcc.query("UPDATE db_sanofi_ccs.tab_atendein SET name=? WHERE mobile=?", [_name, _mobile]);
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

        socket.on('bi-close_chat', function (payload) {
                console.log("BI CLOSE CHAT ---------------------------");
                console.log(payload);
                console.log("-----------------------------------");
                var _mobile = payload.mobile;
                var _status = payload.status;
                var _cnpj = payload.cnpj;
                var _pedidos = payload.pedidos;
                var _atendir = payload.atendir;
                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                        if (err) { console.log(err) };
                        if (result.length > 0) {
                                var _sessionid = result[0].sessionid;
                                var _mobile = result[0].mobile;
                                var _dtin = result[0].dtin;
                                var _dtat = result[0].dtat;
                                var _name = result[0].name;
                                var _account = result[0].account;
                                var _photo = result[0].photo;
                                var _fkto = result[0].fkto;
                                var _fkname = result[0].fkname;
                                var _sessionBot = result[0].sessionBot;
                                var _origem = result[0].origem;
                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_encerrain (sessionid, mobile, dtin, dtat, name, account, photo, fkto, fkname, status, cnpj, atendir, sessionBot, origem) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _dtat, _name, _account, _photo, _fkto, _fkname, _status, _cnpj, _atendir, _sessionBot, _origem], function (err, result) {
                                        if (err) { console.log(err) };
                                        for (i = 0; i < _pedidos.length; i++) {
                                                dbcc.query("INSERT INTO db_sanofi_ccs.tab_pedidos (id, sessionid, segmento, pedido, valor) VALUES(uuid(), ?, ?, ?, ?)", [_sessionid, _pedidos[i].segmento, _pedidos[i].pedido, _pedidos[i].valor], function (err, result) {
                                                        if (err) { console.log(err) }
                                                });
                                        }
                                        dbcc.query("DELETE FROM db_sanofi_ccs.tab_atendein WHERE sessionid=?", [_sessionid]);
                                        dbcc.query("UPDATE tab_logs SET stread = 1 WHERE fromid = '?';", [_mobile], function (err, result) {
                                                if (err) { console.log(err) };
                                        });
                                        insertTransbordo(_sessionBot, _sessionid);
                                        payload = { sessionid: _sessionid, mobile: _mobile };
                                        socket.emit('bi-close_chat', payload);
                                });
                        }
                });
        });

        function insertTransbordo(_sessionBot, _sessionid) {
                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_transbordo where sessionBot=? AND dten IS NULL LIMIT 1", [_sessionBot], function (err, result) {
                        if (err) { console.log(err) };
                        if (result.length > 0) {
                                dbcc.query("SELECT * FROM tab_logs WHERE sessionid =?", [_sessionid], function (err, result) {
                                        var _hist = JSON.stringify(result);
                                        var _dten = new Date().toISOString().slice(0, 19).replace('T', ' ');
                                        dbcc.query("UPDATE tab_transbordo SET chatHuman=?, dten=? WHERE sessionBot=? LIMIT 1", [_hist, _dten, _sessionBot], function (err, result) {
                                                if (err) { console.log(err) }
                                        });
                                });
                        }
                });
        }

        socket.on('listafila', function () {

                console.log("Listando Fila...................................");
                dbcc.query('SELECT * FROM tab_filain WHERE status=1', [], function (err, result) {
                        if (result.length == 0) {
                                console.log("Nenhum Usuário na Fila\n\n");
                        } else {
                                console.log("LISTA FILA: [[[");
                                console.log(result);
                                console.log("]]]");
                        }
                });
        });

        socket.on('bi-atendein', function (payload) {
                log("EVENT: bi-atendein", payload);
                dbcc.query("SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cnpj, B.nomefantasia, B.flagcampanha,  B.tipo, c.sessionBot, c.origem FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile LEFT JOIN tab_transbordo AS c ON A.sessionBot = c.sessionBot WHERE A.fkto=? GROUP BY mobile ORDER BY A.dtin", [payload.fkid], function (err, result) {
                        if (result.length > 0) {
                                var _contacts = JSON.stringify(result);
                                var _sessionlist = "";
                                var _sessionBotlist = "";
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                _sessionlist += "'" + result[i].sessionid + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionid + "',";
                                        }
                                }
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                _sessionBotlist += "'" + result[i].sessionBot + "'";
                                        } else {
                                                _sessionBotlist += "'" + result[i].sessionBot + "',";
                                        }
                                }
                                dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                                        var _logs = JSON.stringify(result);
                                        dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + _sessionBotlist + ") ORDER BY sessionid, dt;", function (err, result) {
                                                var _bot = JSON.stringify(result);
                                                dbcc.query("SELECT sessionBot, chatbot FROM db_sanofi_ccs.tab_transbordo WHERE sessionBot IN (" + _sessionBotlist + ") and origem = 'bot' ORDER BY sessionBot, dtin;", function (err, result) {
                                                        if (err) { console.log(err) }
                                                        var _webb = JSON.stringify(result);
                                                        socket.emit('bi-atendein', { contacts: _contacts, logs: _logs, bot: _bot, webb: _webb });
                                                });
                                        });
                                });
                        } else {
                                socket.emit('bi-atendein', { contacts: [], logs: [] });
                        }
                });
        });

        /*socket.on('bi-atendein_old', function (payload) {
                log("EVENT: bi-atendein", payload);
                dbcc.query("SELECT sessionid, mobile, account, photo, atendir FROM tab_atendein WHERE fkto=?", [payload.fkid], function (err, result) {
                        if (result.length > 0) {
                                var _contacts = JSON.stringify(result);
                                var _sessionlist = "";
                                console.log(result.length);
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                console.log('opa');
                                                _sessionlist += "'" + result[i].sessionid + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionid + "',";
                                        }
                                }
                                console.log("SESSIONLIST [" + _sessionlist + "]");
                                dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                                        var _logs = JSON.stringify(result);
                                        socket.emit('bi-atendein', { contacts: _contacts, logs: _logs });
                                });
                        } else {
                                socket.emit('bi-atendein', { contacts: [], logs: [] });
                        }
                });
        });*/

        socket.on('bi-training', function () {
                dbcc.query('SELECT training from tab_treinamento where id="c102ba05-422c-11ea-8db1-000c290cc03d"', function (err, result) {
                        if (err) {
                                log(err)
                        } else {
                                socket.emit('bi-training', result);
                        }
                });
        });

        socket.on('upd_training', function (payload) {
                var _bool = payload.bool;
                console.log(_bool)
                dbcc.query('UPDATE tab_treinamento SET training=? where id="c102ba05-422c-11ea-8db1-000c290cc03d"', [_bool.toString()], function (err, result) {
                        if (err) { log(err) } else {
                                dbcc.query('SELECT training from tab_treinamento where id="c102ba05-422c-11ea-8db1-000c290cc03d"', function (err, result) {
                                        if (err) {
                                                log(err)
                                        } else {
                                                //socket.emit('bi-training', result);
                                        }
                                });
                        }
                });
        })

        socket.on('bi-transferagent', function (payload) {

                log("Transfer Agent............................", payload);
                var _mobile = payload.mobile;
                var _transferid = payload.fkid;
                var _transfername = payload.fkname;
                var _message = payload.message;
                // Verificar se  atendente está online e enviar a transferência de atendimento
                var _fkonline = false;
                for (var i in io.sockets.connected) {
                        var _fkid = io.sockets.connected[i].fkid;
                        if (_fkid === _transferid) {
                                console.log('Atendente Online >>> Transfer Agent Emitido...');
                                socket.to(i).emit('bi-transferok', payload);
                                _fkonline = true;
                        }
                }
                if (_fkonline == true) {
                        console.log('Transfer Agent TRUE');
                        // TransferenciaOk armazena Logs
                        dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                                var _custom_uid = id[0].UUID;
                                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                                        if (result.length > 0) {
                                                // Armazenando Log da Conversa
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
                                                        log("Novo Registro LOG de Transferência Inserido", _id);
                                                        if (err) {
                                                                log(err);
                                                        } else {
                                                                // Alterar Antedente
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
                        console.log('Transfer Agent FALSE');
                        payload = { mobile: _mobile, fkid: _transferid, fkname: _transfername, status: 0 };
                        socket.emit('bi-transferagent', payload);
                }
        });

        socket.on('bi-transferok', function (payload) {

                console.log('Confirmation Transfer Agent Ok....');
                console.log(payload);
                dbcc.query("SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cnpj, B.nomefantasia, B.flagcampanha,  B.tipo, c.sessionBot, c.origem FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile LEFT JOIN tab_transbordo AS c ON A.sessionBot = c.sessionBot WHERE A.mobile=? GROUP BY mobile ORDER BY A.dtin", [payload.mobile], function (err, result) {
                        if (result.length > 0) {
                                var _contacts = JSON.stringify(result);
                                var _sessionlist = "";
                                var _sessionBotlist = "";
                                console.log(result.length);
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                console.log('opa');
                                                _sessionlist += "'" + result[i].sessionid + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionid + "',";
                                        }
                                }
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                _sessionBotlist += "'" + result[i].sessionBot + "'";
                                        } else {
                                                _sessionBotlist += "'" + result[i].sessionBot + "',";
                                        }
                                }
                                console.log("SESSIONLIST [" + _sessionlist + "]");
                                dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY sessionid, dt;", function (err, result) {
                                        var _logs = JSON.stringify(result);
                                        dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + _sessionBotlist + ") ORDER BY sessionid, dt;", function (err, result) {
                                                var _bot = JSON.stringify(result);
                                                dbcc.query("SELECT sessionBot, chatbot FROM db_sanofi_ccs.tab_transbordo WHERE sessionBot IN (" + _sessionBotlist + ") and origem = 'bot' ORDER BY sessionBot, dtin;", function (err, result) {
                                                        if (err) { console.log(err) }
                                                        var _webb = JSON.stringify(result);
                                                        socket.emit('bi-atendein', { contacts: _contacts, logs: _logs, bot: _bot, webb: _webb });
                                                });
                                        });
                                });
                        } else {
                                socket.emit('bi-atendein', { contacts: [], logs: [] });
                        }
                });
        });

        socket.on('bi-historyone', function (payload) {

                console.log('Request History, Session ID: ' + payload.sessionid + '...');
                console.log(payload);
                dbcc.query("SELECT sessionid, dtin, mobile, account, photo, sessionBot FROM tab_encerrain WHERE sessionid=? ORDER BY dtin DESC LIMIT 1", [payload.sessionid], function (err, result) {
                        if (result.length > 0) {
                                var _contacts = JSON.stringify(result);
                                var _sessionlist = "";
                                var _sessionbotlist = "";
                                console.log(result.length);
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                console.log('opa');
                                                _sessionlist += "'" + result[i].sessionid + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionid + "',";
                                        }
                                }
                                _sessionlist += ","
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                console.log('opa');
                                                _sessionlist += "'" + result[i].sessionBot + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionBot + "',";
                                        }
                                }
                                console.log("SESSIONLIST [" + _sessionlist + "]");
                                dbcc.query("SELECT a.sessionid, a.dt, a.fromname, a.msgdir, a.msgtype, a.msgtext, a.msgurl, a.msgcaption FROM tab_logs AS a WHERE a.sessionid IN (" + _sessionlist + ") ORDER BY a.dt;", function (err, result) {
                                        var _logs = JSON.stringify(result);
                                        socket.emit('bi-historyone', { contacts: _contacts, logs: _logs });
                                        /*dbcc.query("SELECT chatBot, origem FROM tab_transbordo WHERE sessionBot IN (" + _sessionbotlist + ");", function (err, result) {
                                                var _bot = JSON.stringify(result);
                                                socket.emit('bi-historyone', { contacts: _contacts, logs: _logs, bot: _bot });
                                        });*/
                                });
                        } else {
                                socket.emit('bi-historyone', { contacts: [], logs: [] });
                        }
                });
        });

        socket.on('bi-lasthistory', function (payload) {

                console.log('Request Last History, Mobile: ' + payload.mobile + '...');
                console.log(payload);
                dbcc.query("SELECT sessionid, dtin, mobile, account, photo, sessionBot, origem FROM tab_encerrain WHERE mobile=? AND dtin BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE() + INTERVAL 1 DAY ORDER BY dtin DESC", [payload.mobile], function (err, result) {
                        if (result.length > 0) {
                                var _contacts = JSON.stringify(result);
                                var _sessionlist = "";
                                var _sessionbotlist = "";
                                var _origem = result[0].origem;
                                console.log(result.length);
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                console.log('opa');
                                                _sessionlist += "'" + result[i].sessionid + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionid + "',";
                                        }
                                }
                                _sessionlist += ","
                                for (i = 0; i < result.length; i++) {
                                        if (result.length - 1 == i) {
                                                console.log('opa');
                                                _sessionlist += "'" + result[i].sessionBot + "'";
                                        } else {
                                                _sessionlist += "'" + result[i].sessionBot + "',";
                                        }
                                }
                                console.log("SESSIONLIST [" + _sessionlist + "]");
                                dbcc.query("SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY dt;", function (err, result) {
                                        var _logs = JSON.stringify(result);
                                        //socket.emit('bi-lasthistory', { contacts: _contacts, logs: _logs });
                                        dbcc.query("SELECT chatBot, origem FROM tab_transbordo WHERE sessionBot IN (" + _sessionlist + ");", function (err, result) {
                                                var _bot = JSON.stringify(result);
                                                socket.emit('bi-lasthistory', { contacts: _contacts, logs: _logs, bot: _bot, origem: _origem });
                                        });
                                });
                        } else {
                                socket.emit('bi-lasthistory', { contacts: [], logs: [] });
                        }
                });
        });

        socket.on('bi-report1toxlsx', function (payload) {

                console.log('Request Report 1 to XLSX, Parameters: ' + payload.params + '...');
                var _params = payload.params;
                /*var qry = "SELECT tab_encerrain.sessionid, cnpj, atendir, tab_usuarios.nome as atendente, substr(mobile, 3, 11) as mobile, DATE_FORMAT(dtin, '%H:%i') as hora, ";
                qry += "DATE_FORMAT(dtin, '%d/%m/%Y') as data, (tab_statusen.descricao) as status, tab_pedidos.pedido, tab_pedidos.segmento, tab_pedidos.valor FROM tab_encerrain ";
                qry += "LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) LEFT JOIN tab_pedidos ";
                qry += "ON (tab_encerrain.sessionid = tab_pedidos.sessionid) WHERE " + _params + " ORDER BY dtin, sessionid;";*/
                var qry = "select ativ.filename,a.sessionid, a.cnpj, atendir, u.nome as atendente, substr(a.mobile, 3, 11) as mobile, DATE_FORMAT(a.dtin, '%H:%i') as hora, DATE_FORMAT(a.dtin, '%d/%m/%Y') as data, (b.descricao) as status, p.pedido, p.segmento, p.valor from tab_encerrain as a LEFT JOIN tab_statusen as b ON(a.status = b.id) LEFT JOIN tab_pedidos as p ON(a.sessionid = p.sessionid) LEFT JOIN tab_usuarios as u ON(a.fkto = u.id) LEFT JOIN tab_ativo as ativ on (a.mobile = ativ.mobile) WHERE " + _params + " GROUP BY a.sessionid ORDER BY a.dtin, a.sessionid desc;";
                console.log(qry)
                dbcc.query(qry, [], function (err, result) {
                        if (err) {
                                log("Erro: " + err);
                        } else {
                                // Create Worksheet
                                var workbook = excel.Workbook;
                                var wb = new workbook();
                                var ws = wb.addWorksheet('report');
                                var _line = 2;
                                var _path = "/home/ubicua/chatcore/public/supervisor/report/";
                                var _namexlsx = "report" + Date.now() + ".xlsx";
                                ws.getCell('A1').value = "Número do Cliente";
                                ws.getCell('B1').value = "Interação";
                                ws.getCell('C1').value = "CNPJ";
                                ws.getCell('D1').value = "Nome do Antendente";
                                ws.getCell('E1').value = "Hora";
                                ws.getCell('F1').value = "Data";
                                ws.getCell('G1').value = "Status";
                                ws.getCell('H1').value = "No. Pedido";
                                ws.getCell('I1').value = "Segmento";
                                ws.getCell('J1').value = "Valor";
                                ws.getCell('K1').value = "FileName";
                                // Data
                                var _sessionlast;
                                foreachasync(result, function (element, index) {
                                        console.log(element)
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
                                        ws.getCell('K' + _line).value = element.filename;
                                        _line = _line + 1;
                                }).then(function () {
                                        console.log('BI-REPORT1toXLXS >>> All searchs have finished!');
                                        try {
                                                wb.xlsx.writeFile(_path + _namexlsx).then(function () { });
                                        } catch (err) {
                                                log("Error writing to file ", err);
                                        }
                                        var payload = { url: "https://ccs.sanofi-mobile.com.br/supervisor/report/" + _namexlsx };
                                        socket.emit('bi-report1toxlsx', payload);
                                });
                        }
                });
        });

        socket.on('old_bi-report1toxlsx', function (payload) {

                console.log('Request Report 1 to XLSX, Parameters: ' + payload.params + '...');
                var _params = payload.params;
                var qry = "SELECT tab_encerrain.sessionid, cnpj, tab_usuarios.nome as atendente, substr(mobile, 3, 11) as mobile, DATE_FORMAT(dtin, '%H:%i') as hora, ";
                qry += "DATE_FORMAT(dtin, '%d/%m/%Y') as data, (tab_statusen.descricao) as status, tab_pedidos.pedido, tab_pedidos.segmento, tab_pedidos.valor FROM tab_encerrain ";
                qry += "LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) LEFT JOIN tab_pedidos ";
                qry += "ON (tab_encerrain.sessionid = tab_pedidos.sessionid) WHERE " + _params + " ORDER BY dtin, sessionid;";
                dbcc.query(qry, [], function (err, result) {
                        if (err) {
                                log("Erro: " + err);
                        } else {
                                // Create Worksheet
                                var workbook = excel.Workbook;
                                var wb = new workbook();
                                var ws = wb.addWorksheet('report');
                                var _line = 2;
                                var _path = "/home/ubicua/chatcore/public/supervisor/report/";
                                var _namexlsx = "report" + Date.now() + ".xlsx";
                                ws.getCell('A1').value = "Número do Cliente";
                                ws.getCell('B1').value = "CNPJ";
                                ws.getCell('C1').value = "Nome do Antendente";
                                ws.getCell('D1').value = "Hora";
                                ws.getCell('E1').value = "Data";
                                ws.getCell('F1').value = "Status";
                                // Data
                                var _sessionlast;
                                foreachasync(result, function (element, index) {
                                        var _sessionid = element.sessionid;
                                        if (index == 0) {
                                                _sessionlast = _sessionid;
                                                ws.getCell('A' + _line).value = element.mobile;
                                                ws.getCell('B' + _line).value = element.cnpj;
                                                ws.getCell('C' + _line).value = element.atendente;
                                                ws.getCell('D' + _line).value = element.hora;
                                                ws.getCell('E' + _line).value = element.data;
                                                ws.getCell('F' + _line).value = element.status;
                                                var _elsegmento = element.segmento;
                                                if (_elsegmento != null) {
                                                        _line = _line + 1;
                                                        ws.getCell('D' + _line).value = "No. Pedido";
                                                        ws.getCell('E' + _line).value = "Segmento";
                                                        ws.getCell('F' + _line).value = "Valor";
                                                        _line = _line + 1;
                                                        ws.getCell('D' + _line).value = element.pedido;
                                                        ws.getCell('E' + _line).value = element.segmento;
                                                        ws.getCell('F' + _line).value = element.valor;
                                                }
                                        } else {
                                                if (_sessionid == _sessionlast) {
                                                        var _elsegmento = element.segmento;
                                                        if (_elsegmento != null) {
                                                                _line = _line + 1;
                                                                ws.getCell('D' + _line).value = element.pedido;
                                                                ws.getCell('E' + _line).value = element.segmento;
                                                                ws.getCell('F' + _line).value = element.valor;
                                                        }
                                                } else {
                                                        _sessionlast = _sessionid;
                                                        _line = _line + 1;
                                                        ws.getCell('A' + _line).value = element.mobile;
                                                        ws.getCell('B' + _line).value = element.cnpj;
                                                        ws.getCell('C' + _line).value = element.atendente;
                                                        ws.getCell('D' + _line).value = element.hora;
                                                        ws.getCell('E' + _line).value = element.data;
                                                        ws.getCell('F' + _line).value = element.status;
                                                        var _elsegmento = element.segmento;
                                                        if (_elsegmento != null) {
                                                                _line = _line + 1;
                                                                ws.getCell('D' + _line).value = "No. Pedido";
                                                                ws.getCell('E' + _line).value = "Segmento";
                                                                ws.getCell('F' + _line).value = "Valor";
                                                                _line = _line + 1;
                                                                ws.getCell('D' + _line).value = element.pedido;
                                                                ws.getCell('E' + _line).value = element.segmento;
                                                                ws.getCell('F' + _line).value = element.valor;
                                                        }
                                                }
                                        }
                                }).then(function () {
                                        console.log('BI-REPORT1toXLXS >>> All searchs have finished!');
                                        try {
                                                wb.xlsx.writeFile(_path + _namexlsx).then(function () { });
                                        } catch (err) {
                                                log("Error writing to file ", err);
                                        }
                                        var payload = { url: "https://ccs.sanofi-mobile.com.br/supervisor/report/" + _namexlsx };
                                        socket.emit('bi-report1toxlsx', payload);
                                });
                        }
                });
        });

        socket.on('bi-report1', function (payload) {

                console.log('Request Report 1, Parameters: ' + payload.params + '...');
                var _params = payload.params;
                var _limit = payload.limit;
                var qry = "SELECT count(*) as total from tab_encerrain as a LEFT JOIN tab_statusen as b ON(a.status = b.id) LEFT JOIN tab_pedidos as p ON(a.sessionid = p.sessionid) LEFT JOIN tab_usuarios as u ON(a.fkto = u.id) LEFT JOIN tab_ativo as ativ on (a.mobile = ativ.mobile) LEFT JOIN tab_transbordo AS trans ON (a.sessionBot = trans.sessionBot) WHERE " + _params + "GROUP BY a.sessionid LIMIT 1";
                dbcc.query(qry, [], function (err, result) {
                        if (err) {
                                log("Erro: " + err);
                        } else {
                                var _count = result[0].total;
                                if (_count == 0) {
                                        var payload = { count: 0, reportadata: '' };
                                        socket.emit('bi-report1', payload);
                                } else {
                                        //var qry = "SELECT sessionid, cnpj, atendir, tab_usuarios.nome as atendente, substr(mobile, 3, 11) as mobile, DATE_FORMAT(dtin, '%H:%i') as hora, DATE_FORMAT(dtin, '%d/%m/%Y') as data, (tab_statusen.descricao) as status FROM tab_encerrain LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) WHERE " + _params + " ORDER BY dtin LIMIT " + _limit + ", 20;";
                                        var qry = "select ativ.filename,a.sessionid, a.cnpj, atendir, u.nome as atendente, substr(a.mobile, 3, 11) as mobile, DATE_FORMAT(a.dtin, '%H:%i') as hora, DATE_FORMAT(a.dtin, '%d/%m/%Y') as data, (b.descricao) as status, p.pedido, p.segmento, p.valor, trans.origem, trans.destino from tab_encerrain as a LEFT JOIN tab_statusen as b ON(a.status = b.id) LEFT JOIN tab_pedidos as p ON(a.sessionid = p.sessionid) LEFT JOIN tab_usuarios as u ON(a.fkto = u.id) LEFT JOIN tab_ativo as ativ on (a.mobile = ativ.mobile) LEFT JOIN tab_transbordo AS trans ON (a.sessionBot = trans.sessionBot) WHERE " + _params + " GROUP BY a.sessionid ORDER BY a.dtin, a.sessionid desc LIMIT " + _limit + ", 20;";
                                        dbcc.query(qry, [], function (err, result) {
                                                if (err) {
                                                        log("Erro: " + err);
                                                } else {
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
                                                                        atendir: element.atendir,
                                                                        filename: element.filename,
                                                                        origem: element.origem,
                                                                        destino: element.destino
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
                                                                console.log('BI-REPORT1 >>> All searchs have finished!');
                                                        });
                                                }
                                        });
                                }
                        }
                });
        });

        socket.on('OLD_bi-report1', function (payload) {

                console.log('Request Report 1, Parameters: ' + payload.params + '...');
                console.log(payload.params);
                var _params = payload.params;
                var _limit = payload.limit;
                var qry = "SELECT count(*) as total FROM tab_encerrain LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) WHERE " + _params;
                console.log('Query : ');
                console.log(qry);
                console.log('\n');
                dbcc.query(qry, [], function (err, result) {
                        if (err) {
                                log("Erro: " + err);
                        } else {
                                var _count = result[0].total;
                                if (_count == 0) {
                                        var payload = { count: 0, reportadata: '' };
                                        socket.emit('bi-report1', payload);
                                } else {
                                        var qry = "SELECT sessionid, cnpj, tab_usuarios.nome as atendente, substr(mobile, 3, 11) as mobile, DATE_FORMAT(dtin, '%H:%i') as hora, DATE_FORMAT(dtin, '%d/%m/%Y') as data, pedido, segmento, valor, (tab_statusen.descricao) as status FROM tab_encerrain LEFT JOIN tab_usuarios ON (tab_encerrain.fkto = tab_usuarios.id) LEFT JOIN tab_statusen ON (tab_encerrain.status = tab_statusen.id) WHERE " + _params + " ORDER BY dtin LIMIT " + _limit + ", 20;";
                                        dbcc.query(qry, [], function (err, result) {
                                                if (err) {
                                                        log("Erro: " + err);
                                                } else {
                                                        var _reportdata = JSON.stringify(result);
                                                        var payload = { count: _count, reportadata: _reportdata };
                                                        socket.emit('bi-report1', payload);
                                                }
                                        });
                                }
                        }
                });
        });

        socket.on('bi-answer_new_queue', function (payload) {

                var _fkto = payload.fkid;
                var _fkname = payload.fkname;
                console.log(payload);
                dbcc.query('SELECT a.mobile, a.dtin, a.account, a.photo, a.sessionBot, a.origem, b.origem AS fonte FROM tab_filain AS a LEFT JOIN db_sanofi_ccs.tab_transbordo AS b ON a.sessionBot = b.sessionBot WHERE a.status=1 ORDER BY a.dtin LIMIT 1;', [], function (err, result) {
                        if (err) {
                                log(err);
                        } else {
                                var _mobile = result[0].mobile;
                                var _dtin = result[0].dtin;
                                var _account = result[0].account;
                                var _photo = result[0].photo;
                                var _atendir = result[0].atendir;
                                var _sessionBot = result[0].sessionBot;
                                var _origem = result[0].origem;
                                var _fonte = result[0].fonte;
                                dbcc.query("SELECT * FROM db_sanofi_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
                                        if (result.length == 0) {
                                                dbcc.query("UPDATE tab_filain SET status=2 WHERE mobile=" + _mobile);
                                                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                                                        var _sessionid = id[0].UUID;
                                                        dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot,origem) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _account, _photo, _fkto, _fkname, _sessionBot, _origem], function (err, result) {
                                                                if (err) {
                                                                        log("Erro ao Encaminhar Usuário para Atendimento, Erro: " + err);
                                                                } else {
                                                                        dbcc.query("DELETE FROM tab_filain WHERE mobile=" + _mobile);
                                                                        payload = { sessionid: _sessionid, mobile: _mobile, account: _account, photo: _photo, atendir: _atendir, fonte: _fonte };
                                                                        socket.emit('bi-answer_new_queue', payload);
                                                                }
                                                        });
                                                });
                                        }
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
                console.log('sentinel_message_send <> ');
                console.log(payload);
                var _fkonline = false;
                for (var i in io.sockets.connected) {
                        var _fkid = io.sockets.connected[i].fkid;
                        var _fkname = io.sockets.connected[i].fkname;
                        if (_fkid === payload.fkto || payload.fkto == "491b9564-2d79-11ea-978f-2e728ce88125") {
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
                                                if (err) { console.log(err) }
                                                log("Novo Registro LOG Inserido", _id);
                                        });
                                } else {
                                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
                                                if (err) { console.log(err) }
                                                log("Novo Registro LOG Inserido", _id);
                                        });
                                }
                                if (_toname != 'Bot') {
                                        socket.to(i).emit('receive_chat', payload);
                                }
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

        // Checking Clients is Alive
        socket.on('sentinel_clients_alive', function () {
                console.log("\n\n");
                console.log("----------------------------------------------------");
                console.log("----     R T   U B I C U A   P L A T F O R M    ----");
                console.log("----------------------------------------------------");
                console.log("Sentinel Clients Alive");
                console.log("Numero de Usuarios Conectados: " + numUsers + "  -  Data/Hora: " + getTimestamp());
                console.log("---------------------------------------------------------------------------------------------------------------");
                var payload = "[";
                for (var i in io.sockets.connected) {
                        console.log('Socket: ' + i + ' FKID: ' + io.sockets.connected[i].fkid + ' Name: ' + io.sockets.connected[i].fkname + ' Date: ' + io.sockets.connected[i].fkon + ' Address: ' + io.sockets.connected[i].fkip);
                        payload += { fkname: io.sockets.connected[i].fkname, fkdt: io.sockets.connected[i].fkon, fkip: io.sockets.connected[i].fkip };
                        socket.broadcast.emit('sentinel_clients_alive');
                }
                socket.broadcast.emit('sentinel_clients_alive');
                console.log("---------------------------------------------------------------------------------------------------------------\n");
        });

        // Checking Clients on Queue
        socket.on('sentinel_clients_queue', function (payload) {
                //console.log("\n\n");
                //console.log("----------------------------------------------------");
                //console.log("----     R T   U B I C U A   P L A T F O R M    ----");
                //console.log("----------------------------------------------------");
                //console.log("Sentinel Clients Queue");
                //console.log("---------------------------------------------------------------------------------------------------------------");
                dbcc.query('SELECT * FROM db_sanofi_ccs.vw_fila;', [], function (err, result) {
                        socket.broadcast.emit('sentinel_clients_queue', result);
                });
                //console.log(payload);
                //console.log("---------------------------------------------------------------------------------------------------------------");
                //console.log("Sentinel Clients Alive");
                //console.log("Numero de Usuarios Conectados: " + numUsers + "  -  Data/Hora: " + getTimestamp());
                //console.log("---------------------------------------------------------------------------------------------------------------");
                var payload = "[";
                for (var i in io.sockets.connected) {
                        //console.log('Socket: ' + i + ' FKID: ' + io.sockets.connected[i].fkid + ' Name: ' + io.sockets.connected[i].fkname);
                        //console.log('Socket: ' + i + ' FKID: ' + io.sockets.connected[i].fkid + ' Name: ' + io.sockets.connected[i].fkname + ' Date: ' + io.sockets.connected[i].fkon + ' Address: ' + io.sockets.connected[i].fkip + ' Status: ' + io.sockets.connected[i].fkstatus);
                        linha = '{ "socketid": "' + i +
                                '", "fkid": "' + io.sockets.connected[i].fkid +
                                '", "fkname": "' + io.sockets.connected[i].fkname +
                                '", "fkon": "' + io.sockets.connected[i].fkon +
                                '", "fkip": "' + io.sockets.connected[i].fkip +
                                '", "fkstatus": "' + io.sockets.connected[i].fkstatus + '"},';
                        payload += linha;
                }
                // vai
                var send = payload.substr(0, payload.length - 1);
                socket.broadcast.emit('sentinel_clients_alive', send + ']');
                dbcc.query("SELECT * FROM vw_agentes", [], function (err, result) {
                        if (result.length > 0) {
                                socket.broadcast.emit('view_agents', JSON.stringify(result));
                        }
                });
                //console.log("---------------------------------------------------------------------------------------------------------------\n");
        });

        socket.on('bi-auth', function (payload) {
                log("Novo Login de Usuário", payload);
                var _fkname = payload.fkname;
                var _fkpass = payload.fkpass;
                var _key = payload.key;
                var _app = payload.app;
                if (_key == "a02c7f8c8bf9635037eb5653302f8b84") {
                        dbcc.query('SELECT * FROM tab_usuarios WHERE usuario=? AND status=1 LIMIT 1', [_fkname], function (err, result) {
                                console.log(err);
                                if (result.length > 0) {
                                        // Validando Perfil
                                        if (_app == 3) {
                                                var _senha = result[0].senha;
                                                // Validando Senha
                                                if (md5(_fkpass) == _senha) {
                                                        console.log('senha ok');
                                                        var _status = result[0].status;
                                                        // Verificando Status do Usuário
                                                        if (_status == 1) {
                                                                var _id = result[0].id;
                                                                var _nome = result[0].nome;
                                                                var payload = { response: 1, id: _id, nome: _nome };
                                                                socket.emit('bi-auth', payload);
                                                        } else {
                                                                socket.emit('bi-auth', { response: 2 });
                                                        }
                                                } else {
                                                        console.log('emitiu');
                                                        socket.emit('bi-auth', { response: 3 });
                                                }
                                        } else if (_app == 2) {
                                                if (_app == result[0].perfil) {
                                                        var _senha = result[0].senha;
                                                        // Validando Senha
                                                        if (md5(_fkpass) == _senha) {
                                                                console.log('senha ok');
                                                                var _status = result[0].status;
                                                                // Verificando Status do Usuário
                                                                if (_status == 1) {
                                                                        var _id = result[0].id;
                                                                        var _nome = result[0].nome;
                                                                        var payload = { response: 1, id: _id, nome: _nome };
                                                                        socket.emit('bi-auth', payload);
                                                                } else {
                                                                        socket.emit('bi-auth', { response: 2 });
                                                                }
                                                        } else {
                                                                console.log('emitiu');
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

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (payload) {
                if (addedUser) return;

                console.log('>>>>>>>>>>>>>>>>>\n');
                console.log(payload);
                // we store the username in the socket session for this client
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
                // echo globally (all clients) that a person has connected
                socket.broadcast.emit('user joined', {
                        fkname: payload.fkname,
                        numUsers: numUsers
                });
                //var newuser = {fkid: socket.fkid, fkname: socket.fkname};
                //chatcore.insert(newuser, function(){
                //      log("Novo usuario logado " + socket.id + ' - ' + socket.username);
                //});
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('alive', function () {
                onalive(socket.id);
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
                socket.broadcast.emit('typing', {
                        username: socket.username
                });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
                socket.broadcast.emit('stop typing', {
                        username: socket.username
                });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
                if (addedUser) {
                        --numUsers;
                        //chatcore.deleteOne({ userid: socket.id}, function(err, result){
                        //        console.log('Usuario Descontecou: ' + socket.username);
                        //});
                        // echo globally that this client has left
                        console.log("USUARIO DESCONECTADO:::::::::::::::::::: " + socket.id);
                        socket.disconnect();
                        //console.log(socket);
                        //socket.close();
                        //socket.broadcast.emit('user left', {
                        //        username: socket.username,
                        //        numUsers: numUsers
                        //});
                }
        });

        socket.on('sentinel', function () {
                socket.broadcast.emit('timestamp', {
                        mili: new Date().getTime()
                });
                onkill();
        });

        socket.on('sentinel_waendpoint', function (payload) {
                //console.log('sentinel_waendpoint................' + _host);
                dbcc.query("SELECT waendpoint FROM db_sanofi_ccs.tab_config WHERE id=1", [], function (err, result) {
                        _host = result[0].waendpoint;
                        socket.broadcast.emit('waendpoint', { server: _host });
                });
        });

        socket.on('sentinel_monitor', function (payload) {

                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                        var _custom_uid = id[0].UUID;
                        let teste = {
                                infra: _mobileUid,
                                id: '5511969009126@c.us',
                                msg: payload,
                                media: 'chat'
                        }
                        if (_host == "LON") {
                                request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                                        console.log(teste)
                                        log("Response WABOXAPP", body);
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
                                                                        message: "Olá, sou o " + _fkname + " do Grupo Sanofi/Medley, temos uma oferta para você."
                                                                };
                                                                //sendMyChat(dataSet);
                                                                updateMailing(_mobile);
                                                                socket.emit('bi-atendemail', {
                                                                        status: '200'
                                                                });
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

        function sendFirstTextMsg(payload) {
                log("Nova Mensagem Enviada", payload);
                var _mobile = payload.mobile;
                var _type = payload.type;
                var _message = payload.message;
                dbcc.query("SELECT uuid() as UUID;", function (err, id) {
                        var _custom_uid = id[0].UUID;
                        if (_host == "LON") {
                                let teste = {
                                        infra: _mobileUid,
                                        id: _mobile + '@c.us',
                                        msg: _message,
                                        media: 'chat'
                                }
                                request.post({ url: 'https://extensao.ubicuacloud.com.br/client', form: teste }, function (err, httpResponse, body) {
                                        console.log(teste)
                                        log("Response WABOXAPP", body);
                                        var _response = body;
                                        if (_response === 'ok') {
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

        function sendMyChat(payload) {
                var corJson = {
                        'mobile': payload.mobile,
                        'type': payload.type,
                        'message': 'BLACK NOVEMBER: DORFLEX com até 17% de desconto?! Retorne essa mensagem para aproveitar a condição.'
                }
                sendFirstTextMsg(payload);
                socket.broadcast.emit('receive_picture', corJson);
                var _mobile = payload.mobile;
                var _type = payload.type;
                var _message = 'BLACK NOVEMBER: DORFLEX com até 17% de desconto?! Retorne essa mensagem para aproveitar a condição.';
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
                                        var _msgtype = 'chat';
                                        //var _msgurl = "https://cdn.ubicuacloud.com/file/2f7b4a7133fb8c5c327421632ae91308.jpg";
                                        var _msgcaption = _message;
                                        dbcc.query("INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype], function (err, result) {
                                                log("Novo Registro LOG Inserido", _id);
                                                socket.emit('bi-atendemail', {
                                                        status: '200'
                                                });
                                        });
                                }
                        });
                });
        }
});

function onkill() {
        console.log(new Date() + " >> onKill acionando!");
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
        log('Chat Core - Ubicua Cloud Platform - Listening at Port ' + port);
});

process.on('uncaughtException', function (err) {
        console.error(' ');
        console.error('----- ' + (new Date).toUTCString() + ' ----------------------------------')
        console.error('Erro uncaughtException: ', err.message)
        console.error(err.stack)
        console.error(' ');
        return
});

