// Setup ENV
const dotenv = require('dotenv')
dotenv.config()

// Setup Chat Core Ubicua Cloud Platform
const express = require('express');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const bodyparser = require('body-parser');
const cors = require('cors');
const request = require('request');
const emoji = require('emoji');
const excel = require('exceljs');
const foreachasync = require('foreachasync').forEachAsync;
const helmet = require('helmet');

const port = process.env.PORT || 443;

process.env.TZ = 'Brazil/brt';
//console.log(process.env)

// Constantes
const cdn = process.env.CCS_CDN_FILE;
const _mobileUid = process.env.CCS_MOBILE

// Function Platforma Ubicua
require('./database/tools')();
var dbcc = require('./database/dbcc');
const { promises } = require('dns');
const { Promise } = require('q');
const { Logger } = require('mongodb');

var options = {
	key: fs.readFileSync(process.env.CCS_OPTIONSKEY),
	cert: fs.readFileSync(process.env.CCS_OPTIONSCERT)
};

// Config App Express
var app = express();
app.use(helmet());

var server = require('https').createServer(options, app);
// var server = require('http').createServer(app);

var io = require('socket.io')(server);

io.origins('*:*')

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', function (req, res) {
	if (req.hostname == "falecomacruzeiro.com.br") {
		res.redirect('https://wa.me/' + String(process.env.CCS_MOBILE).replace("@c.us"))
	} else {
		res.redirect('/atendente')
	}
})

app.get('/.well-known/acme-challenge/GXWwzwd5XBYsP0nuC-_b_sblfG-aaKG3BAIsbX3tc94', function (req, res) {
	res.send('GXWwzwd5XBYsP0nuC-_b_sblfG-aaKG3BAIsbX3tc94.WJdCUT79yCG6vkn1fZDc6qfJm78Ksc0SohKQIFQfIhM');
});

app.get('/alive', function (req, res) {
	////console.log(req.ip);
	res.send('Sorry');
});

app.get('/v1/push/keys', function (req, res) {
	////console.log('====================================');
	////console.log('Push');
	res.sendStatus(200);
	////console.log('====================================');
});

app.post('/whatsapp', function (req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var _mobile = req.body.mobile;
	var _msg = req.body.msg;
	////console.log(req);
	////console.log("Nova Mensagem From: " + _mobile + " >>> " + _msg);
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
					////console.log('======================================\n');
					////console.log(_body_text);
					////console.log('======================================\n\n');
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
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
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
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
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_thumb, _body_url";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_thumb, _body_url], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
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
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
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
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
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
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size,  body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
					});
				}
			} else if (_message_type === "vcard") {
				if (_contact_uid.indexOf('g.us') > -1) {
					onrefusegroup(_contact_uid.substring(0, _contact_uid.search("-")));
				} else {
					var _body_contact = req.body.message.body.contact;
					var _body_vcard = req.body.message.body.vcard;
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_contact, body_vcard, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_contact, _body_vcard";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_contact, _body_vcard], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
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
					var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_name, body_lng, body_lat, body_thumb, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
					var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_name, _body_lng, _body_lat, _body_thumb";
					dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_name, _body_lng, _body_lat, _body_thumb], function (err, rows, fields) {
						if (err) {
							log("Erro ao Receber Mensagem do WABOXAPP: " + err);
						} else {
							log("Nova Mensagem Recebida WABOXAPP...");
						}
					});
				}
			}
		}

		dbcc.query("UPDATE db_cruzeiro_ccs.tab_config SET waendpoint=? WHERE id=1", [_hostin]);
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
			var qry = 'INSERT INTO db_cruzeiro_ccs.tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
			var params = "_host, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text";
			dbcc.query(qry, [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text], function (err, rows, fields) {
				if (err) {
					log("Erro ao Receber Mensagem do BRA: " + err);
				} else {
					dbcc.query("UPDATE db_cruzeiro_ccs.tab_config SET waendpoint=? WHERE id=1", [_hostin]);
					log("Nova Mensagem Recebida BRA...");
				}
			});
			res.json({ "key": _key, "ack": "3" });
		}
	} else {
		res.status(200).send('Ok');
	}
});

app.get('/api/ubicua/report', function (req, res, next) {
	var auth = req.headers['authorization'];
	////console.log("Authorization Header is: ", auth);
	////console.log(req.body);
	if (!auth) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.end('Sorry! Invalid Authentication.');
	} else if (auth) {
		var tmp = auth.split(' ');
		var buf = new Buffer(tmp[1], 'base64');
		var plain_auth = buf.toString();
		////console.log("Decoded Authorization ", plain_auth);
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

app.post('/api/smi/recordMsg', function (req, res) {
	console.log(req.body);
	let params = [
		req.body.message.session,
		req.body.message.uid,
		req.body.message.name,
		req.body.message.contact_uid,
		req.body.message.contact_name,
		req.body.message.message_dir,
		req.body.message.message_type,
		req.body.message.body_text
	]
	dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(UUID(), ?, ?, ?, ?, ?, ?, ?, ?)", params, function (err, result) {
		if (err) { console.log(err); }
		log("Novo Registro LOG Inserido", _id);
	});
	res.send('ok')
})

app.post('/api/smi/insertFila', async function (req, res) {
	console.log(req.body);
	let mobile = '55' + req.body.message.uid;
	let ckFila = await findInFila(mobile);
	let ckAtende = await findInAtende(mobile);
	var _custom_uid = "";
	var _message = "Olá, nosso horário de atendimento é das 09:00 as 18:00 de segunda a sexta-feira.\n\nEsse canal é exclusivo para atendimento de rematrícula, retorno ao curso e cancelamento/trancamento.\n\nAguarde enquanto já iremos lhe atender.\n\nPara agilizar, informe RGM, CPF e nome da instituição.";

	dbcc.query("SELECT uuid() as UUID;", function (err, id) { _custom_uid = id[0].UUID; });

	if (ckFila == 1 && ckAtende == 1) {
		let params = [
			'55' + req.body.message.uid,
			req.body.message.name,
			req.body.message.session
		]

		let teste = {
			id: _custom_uid,
			sessionId: req.body.message.session,
			msg: _message,
		}

		dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_filain (mobile, name) VALUES(?, ?, ?)", params, function (err, result) {
			if (err) { console.log(err); }
			log("Novo Registro LOG Inserido", _id);
		});

		request.post({ url: 'https://dashboard-homolog.ubicuacloud.com.br/cruzeiro_m7/api/wsfMsg', form: teste }, function (err, httpResponse, body) {
			log("Response SMI Welcome", body);
			var _response = body;
			if
				(_response === 'ok') { }
		});

		res.send('ok')
	} else {
		res.send('erro')
	}
})

app.get('/tracking/api/:dtini/:dtfim', function (req, res) {

	var _dtini = req.params.dtini + ' 00:00:00';
	var _dtfim = req.params.dtfim + ' 23:59:59';
	var auth = req.headers['authorization'];
	////console.log("Authorization Header is: ", auth);
	if (!auth) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.end('Sorry! Invalid Authentication.');
	} else if (auth) {

		var tmp = auth.split(' ');
		var buf = new Buffer(tmp[1], 'base64');
		var plain_auth = buf.toString();
		////console.log("Decoded Authorization ", plain_auth);
		var creds = plain_auth.split(':');
		var username = creds[0];
		var password = creds[1];
		if ((username == 'cruzeiro') && (password == 'vvP83m22Qg6qeYTJ')) {
			dbcc.query("INSERT INTO tab_api_log (dtable, log) VALUES('tracking', 'granted');");
			var results = [];
			dbcc.query("SELECT db_cruzeiro_ccs.tab_encerrain.*, db_cruzeiro_ccs.tab_statusen.descricao AS statusd FROM db_cruzeiro_ccs.tab_encerrain LEFT JOIN db_cruzeiro_ccs.tab_statusen ON ( db_cruzeiro_ccs.tab_encerrain.status = db_cruzeiro_ccs.tab_statusen.id) WHERE db_cruzeiro_ccs.tab_encerrain.dtin BETWEEN ? AND ? ORDER BY db_cruzeiro_ccs.tab_encerrain.dtin", [_dtini, _dtfim], function (err, rows, fields) {
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

app.get('/requests/api/:dtini/:dtfim', function (req, res) {

	var _dtini = req.params.dtini + ' 00:00:00';
	var _dtfim = req.params.dtfim + ' 23:59:59';
	var auth = req.headers['authorization'];
	////console.log("Authorization Header is: ", auth);
	if (!auth) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		res.end('Sorry! Invalid Authentication.');
	} else if (auth) {

		var tmp = auth.split(' ');
		var buf = new Buffer(tmp[1], 'base64');
		var plain_auth = buf.toString();
		////console.log("Decoded Authorization ", plain_auth);
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

app.get('/requests/api/logins', function (req, res) {
    var { datainicio, datafim } = req.query
    var auth = req.headers['authorization'];
    ////console.log("Authorization Header is: ", auth);
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Sorry! Invalid Authentication.');
    } else if (auth) {
        var tmp = auth.split(' ');
        var buf = new Buffer(tmp[1], 'base64');
        var plain_auth = buf.toString();
        ////console.log("Decoded Authorization ", plain_auth);
        var creds = plain_auth.split(':');
        var username = creds[0];
        var password = creds[1];
        if ((username == 'ubicua') && (password == 'APsxrRvv4mzX33pB')) {
            dbcc.query("SELECT * FROM tab_logins WHERE date BETWEEN ? and ? and fkid != '2';", [datainicio, datafim], function (err, rows, fields) {
                res.send(JSON.stringify(rows));
            });
        }
    }
});

var numUsers = 0;
var _host = "LON";

io.on('connection', function (socket) {

	var addedUser = false;

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
			request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
				////console.log(teste)
				log("Response WABOXAPP", body);
				var _response = body;
				if (_response === 'ok') {
					////console.log('Alarme Enviando com Sucesso...')
				}
			});
		});
	});

	socket.on('send_chat', async function (payload) {
		log("> Nova Mensagem Enviada", payload);
		var _mobile = payload.mobile;
		var _type = payload.type;
		var _message = payload.message;
		dbcc.query("SELECT uuid() as UUID;", async function (err, id) {
			var _custom_uid = id[0].UUID;
			////console.log("> UUID PRONTO");
			dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
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

					let teste = {
						infra: _mobileUid,
						id: _mobile + '@c.us',
						msg: _message,
						media: 'chat'
					}
					request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
						////console.log(teste)
						log("Response WABOXAPP", body);
						var _response = body;
						if (_response === 'ok') { }
					});
					dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
						log("Novo Registro LOG Inserido", _id);
					});

				}
			});

		});
	});

	socket.on('send_welcome', function (payload) {
		log("Nova Mensagem Enviada Welcome", payload);
		var _mobile = payload.mobile;
		var _type = payload.type;
		var _sessionid = payload.sessionid;
		var _message = "Olá,\n\nO nosso horário de atendimento via WhatsApp é das 09:00 às 18:00, de segunda a sexta.\n\nEste canal é EXCLUSIVO para atendimentos de REMATRICULA e RETORNO AO CURSO, para demais assuntos, por gentileza, acessar os canais oficiais de sua Instituição.\n\nEsclarecemos que estamos com um volume superior à nossa capacidade de atendimento, por isso pode haver demora nas respostas. Aguarde que você será atendido.\nPara agilizar seu atendimento, seguem algumas respostas rápidas que identificamos em nossos atendimentos.\nREMATRICULA\nPor favor, realizar pela ÁREA DO ALUNO, seguindo o passo a passo a seguir:\nhttp://passos.cruzeirodosuleducacional.edu.br/\nCaso você esteja INADIMPLENTE, realizar o pagamento pelo seguinte caminho:\nÁREA DO ALUNO > FINANCEIRO > FAZER ACORDO\\nPara retornar aos estudos, por favor, acesse o site de sua Instituição, seguindo o passo a passo a seguir:\nhttp://passosregresso.cruzeirodosuleducacional.edu.br/\nCaso você esteja INADIMPLENTE, realizar o pagamento pelo seguinte caminho:\nÁREA DO ALUNO > FINANCEIRO > FAZER ACORDO\nPARA OUTROS ASSUNTOS, AGUARDE O ATENDIMENTO.\nAgradecemos a sua compreensão.\n\nPara agilizar nosso fluxo, informe o seu RGM ou CPF e o nome da sua Instituição.";

		dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_filain WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
			if (result.length > 0) {
				dbcc.query("SELECT uuid() as UUID;", function (err, id) {
					var _custom_uid = id[0].UUID;
					var _id = _custom_uid;
					var _fromid = 1;
					var _fromname = "Sistema";
					var _toid = _mobile;
					var _msgdir = "o";
					var _msgtype = _type;
					var _msgtext = _message;

					if (_host == "LON") {
						let teste = {
							infra: _mobileUid,
							id: _mobile + '@c.us',
							msg: _message,
							media: 'chat'
						}
						request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
							log("Response WABOXAPP Welcome", body);
							var _response = body;
							if (_response === 'ok') { }
						});
						dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, fromid, fromname, toid, msgdir, msgtype, msgtext, sessionid, dt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMPADD(MINUTE, 1, NOW()))", [_id, _fromid, _fromname, _toid, _msgdir, _msgtype, _msgtext, _sessionid], function (err, result) {
							log("Novo Registro LOG Inserido", _id);
						});
					}
				});
			}
		});
	});

	socket.on('send_timeout', function (payload) {
		log("Nova Mensagem Enviada Welcome", payload);
		var _mobile = payload.mobile;
		var _type = payload.type;
		var _sessionid = payload.sessionid;
		var _message = "Agradecemos o seu contato! Estamos encerrando a comunicação e ficaremos a disposição para um novo contato.";

		dbcc.query('SELECT training from tab_treinamento where id="c102ba05-422c-11ea-8db1-000c290cc03d"', function (err, result) {
			if (err) {
				log(err)
			} else {
				dbcc.query("SELECT uuid() as UUID;", function (err, id) {
					var _custom_uid = id[0].UUID;
					if (_host == "LON") {
						let teste = {
							infra: _mobileUid,
							id: _mobile + '@c.us',
							msg: _message,
							media: 'chat'
						}
						request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
							////console.log(teste)
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
								dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, fromid, fromname, toid, msgdir, msgtype, msgtext, sessionid, dt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMPADD(MINUTE, 1, NOW()))", [_id, _fromid, _fromname, _toid, _msgdir, _msgtype, _msgtext, _sessionid], function (err, result) {
									log("Novo Registro LOG Inserido", _id);
								});
							}
						});
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

	socket.on('bi-listblock', function (payload) {
		dbcc.query("SELECT * FROM tab_timeout WHERE data_desbloqueio IS NULL ORDER BY nome_atendente", [], function (err, result) {
			if (result.length > 0) {
				var _agents = JSON.stringify(result);
				socket.emit('bi-listblock', _agents);
			}
		});
	});

	socket.on('unblock_agent', function (payload) {
		// Update tab_usuarios
		dbcc.query("UPDATE tab_usuarios SET bloqueado = 'não' WHERE id = ?", [payload.fkid_atendente], function (err, result) {
			if (err) { console.log(err) }
		});

		// Update tab_timeout
		dbcc.query("UPDATE tab_timeout SET fkid_supervisor = ?, nome_supervisor = ?, motivo_desbloqueio = ?, data_desbloqueio = NOW() WHERE id = ?", [payload.fkid_supervisor, payload.fkname_supervisor, payload.motivo, payload.id], function (err, result) {
			if (err) { console.log(err) }
			// Refresh table
			dbcc.query("SELECT * FROM tab_timeout WHERE data_desbloqueio IS NULL ORDER BY nome_atendente", [], function (err, result) {
				if (result.length > 0) {
					var _agents = JSON.stringify(result);
					socket.emit('bi-listblock', _agents);
				} else {
					socket.emit('bi-listblock', JSON.stringify([]));
				}
			});
		});
	});

	socket.on('add_agent', function (payload) {
		////console.log(payload);
		var _perfil = payload.perfil;
		var _nome = payload.nome;
		var _usuario = payload.usuario;
		var _senha = payload.senha;
		dbcc.query("INSERT INTO tab_usuarios (id, perfil, nome, usuario, senha) VALUES(uuid(), ?, ?, ?, MD5(?))", [_perfil, _nome, _usuario, _senha], function (err, result) {
			dbcc.query("SELECT * FROM tab_usuarios WHERE status=1", [], function (err, result) {
				if (err) { console.log(err); }
				if (result.length > 0) {
					var _agents = JSON.stringify(result);
					socket.emit('bi-listagents', _agents);
				}
			});
		});
	});

	socket.on('upd_agent', function (payload) {
		////console.log(payload);
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
		////console.log(payload);
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
		////console.log(payload);
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
		////console.log(payload);
		var _id = payload.id;
		var _descricao = payload.descricao;
		dbcc.query("UPDATE tab_statusen SET descricao=? WHERE id=?", [_descricao, _id], function (err, result) {
			if (err) {
				console.log(err)
			}
			dbcc.query("SELECT * FROM tab_statusen WHERE status=1", [], function (err, result) {
				if (err) {
					console.log(err)
				}
				if (result.length > 0) {
					var _status = JSON.stringify(result);
					socket.emit('bi-liststa', _status);
				}
			});
		});
	});

	socket.on('del_sta', function (payload) {
		////console.log(payload);
		var _id = payload.id;
		dbcc.query("UPDATE tab_statusen SET status=0 WHERE id=?", [_id], function (err, result) {
			if (err) {
				console.log(err)
			}
			dbcc.query("SELECT * FROM tab_statusen WHERE status=1", [], function (err, result) {
				if (err) {
					console.log(err)
				}
				if (result.length > 0) {
					var _status = JSON.stringify(result);
					socket.emit('bi-liststa', _status);
				} else {
					socket.emit('bi-liststa', "[]");
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
				request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
					////console.log(teste)
					log("Response WABOXAPP", body);
					var _response = body;
					if (_response === 'ok') {
						//dbcc.query("INSERT INTO  db_cruzeiro_ccs.tab_sikmedia (id, toid, typefile, hashfile, descfile) VALUES(?, ?, ?, ?, ?)", [_custom_uid, _mobile, _type, _hashfile, _descfile]);
						dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
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
								dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
									log("Novo Registro LOG Inserido", _id);
								});
							}
						});
					}
				});
			} else {
				log("Response BRA");
				var _message = cdn + _hashfile;
				dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_outbound (mobile, msg) VALUES(?, ?);", [_mobile + "@c.us", _message], function (err, result) {
					dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
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
							dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
								log("Novo Registro LOG Inserido", _id);
							});
						}
					});
				});
			}
		});
	});

	socket.on('send_register', function (payload) {
		////console.log(payload);
		var _mobile = payload.mobile;
		var _name = payload.name;
		dbcc.query("UPDATE db_cruzeiro_ccs.tab_atendein SET name=? WHERE mobile=?", [_name, _mobile]);
		dbcc.query("SELECT sessionid, mobile, name, account, photo FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
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
		////console.log("BI CLOSE CHAT ---------------------------");
		////console.log(payload);
		////console.log("-----------------------------------");
		var _mobile = payload.mobile;
		var _status = payload.status;
		var _cnpj = payload.cnpj;
		var _atendir = payload.atendir;
		dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
			if (err) {
				console.log(err)
			};
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
				var _transfer = result[0].transfer;
				dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_encerrain (sessionid, mobile, dtin, dtat, name, account, photo, fkto, fkname, status, cnpj, atendir, transfer) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _dtat, _name, _account, _photo, _fkto, _fkname, _status, _cnpj, _atendir, _transfer], function (err, result) {
					if (err) {
						console.log(err)
					};
					dbcc.query("DELETE FROM db_cruzeiro_ccs.tab_atendein WHERE sessionid=?", [_sessionid]);
					dbcc.query("UPDATE tab_logs SET stread = 1 WHERE fromid = '?' AND stread = 0;", [_mobile], function (err, result) {
						if (err) {
							console.log(err)
						};
					});
					payload = { sessionid: _sessionid, mobile: _mobile };
					socket.emit('bi-close_chat', payload);
				});
			}
		});
	});

	socket.on('listafila', function () {

		////console.log("Listando Fila...................................");
		dbcc.query('SELECT * FROM tab_filain WHERE status=1', [], function (err, result) {
			if (result.length == 0) {
				////console.log("Nenhum Usuário na Fila\n\n");
			} else {
				////console.log("LISTA FILA: [[[");
				////console.log(result);
				////console.log("]]]");
			}
		});
	});

	socket.on('get_cliInfo', function (payload) {
		console.log(payload)
		var _mobile = payload.mobile;
		dbcc.query("SELECT NAME,cnpj FROM tab_encerrain WHERE mobile = ? ORDER BY dten DESC LIMIT 1", [_mobile], function (err, result) {
			if (result.length > 0) {
				var _nome = result[0].NAME;
				var _cpf = result[0].cnpj;
				payload = {
					nome: _nome,
					cpf: _cpf
				};
				socket.emit('get_cliInfo', payload);
			}
		});
	});

	socket.on('bi-find_register', function (payload) {
		var _mobile = payload.mobile;
		dbcc.query("SELECT sessionid, mobile, name, account, photo FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
			if (result.length > 0) {
				var _sessionid = result[0].sessionid;
				var _mobile = result[0].mobile;
				var _name = result[0].name;
				var _account = result[0].account;
				var _photo = result[0].photo;
				payload = { sessionid: _sessionid, mobile: _mobile, name: _name, account: _account, photo: _photo };
				socket.emit('bi-find_register', payload);
			}
		});
	});

	socket.on('bi-atendein', function (payload) {
		log("EVENT: bi-atendein", payload);
		dbcc.query("SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cpf, B.nome FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile WHERE A.fkto=? GROUP BY mobile ORDER BY A.dtin", [payload.fkid], function (err, result) {
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
				dbcc.query("SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY dt;", function (err, result) {
					var _logs = JSON.stringify(result);
					socket.emit('bi-atendein', { contacts: _contacts, logs: _logs });
				});
			} else {
				socket.emit('bi-atendein', { contacts: [], logs: [] });
			}
		});
	});

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
		////console.log(_bool)
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
				////console.log('Atendente Online >>> Transfer Agent Emitido...');
				socket.to(i).emit('bi-transferok', payload);
				_fkonline = true;
			}
		}
		if (_fkonline == true) {
			////console.log('Transfer Agent TRUE');
			// TransferenciaOk armazena Logs
			dbcc.query("SELECT uuid() as UUID;", function (err, id) {
				var _custom_uid = id[0].UUID;
				dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
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
						dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
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
			////console.log('Transfer Agent FALSE');
			payload = { mobile: _mobile, fkid: _transferid, fkname: _transfername, status: 0 };
			socket.emit('bi-transferagent', payload);
		}
	});

	socket.on('bi-transferok', function (payload) {
		dbcc.query("SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cpf, B.nome FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile WHERE A.mobile=? GROUP BY mobile ORDER BY A.dtin", [payload.mobile], function (err, result) {
			if (result.length > 0) {
				var _contacts = JSON.stringify(result);
				var _sessionlist = "";
				////console.log(result.length);
				for (i = 0; i < result.length; i++) {
					if (result.length - 1 == i) {
						////console.log('opa');
						_sessionlist += "'" + result[i].sessionid + "'";
					} else {
						_sessionlist += "'" + result[i].sessionid + "',";
					}
				}
				////console.log("SESSIONLIST [" + _sessionlist + "]");
				dbcc.query("SELECT sessionid, DATE_ADD(dt, INTERVAL 3 HOUR) as dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY dt;", function (err, result) {
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
				////console.log(result.length);
				for (i = 0; i < result.length; i++) {
					if (result.length - 1 == i) {
						////console.log('opa');
						_sessionlist += "'" + result[i].sessionid + "'";
					} else {
						_sessionlist += "'" + result[i].sessionid + "',";
					}
				}
				////console.log("SESSIONLIST [" + _sessionlist + "]");
				dbcc.query("SELECT a.sessionid, DATE_ADD(a.dt, INTERVAL 3 HOUR) as dt, a.fromname, a.msgdir, a.msgtype, a.msgtext, a.msgurl, a.msgcaption FROM tab_logs AS a WHERE a.sessionid IN (" + _sessionlist + ") ORDER BY a.dt;", function (err, result) {
					if (result.length > 0) {
						var _logs = JSON.stringify(result);
						socket.emit('bi-historyone', { contacts: _contacts, logs: _logs });
					} else {
						dbcc.query("SELECT a.sessionid, DATE_ADD(a.dt, INTERVAL 3 HOUR) as dt, a.fromname, a.msgdir, a.msgtype, a.msgtext, a.msgurl, a.msgcaption FROM tab_logs_old AS a WHERE a.sessionid IN (" + _sessionlist + ") ORDER BY a.dt;", function (err, result) {
							var _logs = JSON.stringify(result);
							socket.emit('bi-historyone', { contacts: _contacts, logs: _logs });
						});
					}

				});
			}
		});
	});

	socket.on('bi-lasthistory', function (payload) {

		////console.log('Request Last History, Mobile: ' + payload.mobile + '...');
		////console.log(payload);
		dbcc.query("SELECT sessionid, dtin, mobile, account, photo FROM tab_encerrain WHERE mobile=? AND dtin BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE() + INTERVAL 1 DAY ORDER BY dtin DESC", [payload.mobile], function (err, result) {
			if (result.length > 0) {
				var _contacts = JSON.stringify(result);
				var _sessionlist = "";
				////console.log(result.length);
				for (i = 0; i < result.length; i++) {
					if (result.length - 1 == i) {
						////console.log('opa');
						_sessionlist += "'" + result[i].sessionid + "'";
					} else {
						_sessionlist += "'" + result[i].sessionid + "',";
					}
				}
				////console.log("SESSIONLIST [" + _sessionlist + "]");
				dbcc.query("SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY dt;", function (err, result) {
					if (result.length > 0) {
						var _logs = JSON.stringify(result);
						socket.emit('bi-lasthistory', { contacts: _contacts, logs: _logs });
					} else {
						dbcc.query("SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY dt;", function (err, result) {
							var _logs = JSON.stringify(result);
							socket.emit('bi-lasthistory', { contacts: _contacts, logs: _logs });
						});
					}
				});
			} else {
				socket.emit('bi-lasthistory', { contacts: [], logs: [] });
			}
		});
	});

	socket.on('bi-report1toxlsx', function (payload) {
		////console.log('Request Report 1 to XLSX, Parameters: ' + payload.params + '...');
		var _params = payload.params;
		var _transbordoDt = payload.transbordoDt;
		var qry = 'CALL css_report_excel("MAX","' + _transbordoDt + '","' + _params + '", "*");';
		////console.log(qry)
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
				ws.getCell('A1').value = "Mailing";
				ws.getCell('B1').value = "Cpf";
				ws.getCell('C1').value = "Interação";
				ws.getCell('D1').value = "Nome do Antendente";
				ws.getCell('E1').value = "Telefone";
				ws.getCell('F1').value = "Hora";
				ws.getCell('G1').value = "Data";
				ws.getCell('H1').value = "Status";
				ws.getCell('I1').value = "Rgm Aluno";
				ws.getCell('J1').value = "Nome";
				// Data
				var _sessionlast;
				foreachasync(result[1], function (element, index) {
					////console.log(element)
					ws.getCell('A' + _line).value = element.filename;
					ws.getCell('B' + _line).value = element.cpf;
					ws.getCell('C' + _line).value = element.atendir;
					ws.getCell('D' + _line).value = element.atendente;
					ws.getCell('E' + _line).value = element.mobile;
					ws.getCell('F' + _line).value = element.hora;
					ws.getCell('G' + _line).value = element.data;
					ws.getCell('H' + _line).value = element.status;
					ws.getCell('I' + _line).value = element.rgm_aluno;
					ws.getCell('J' + _line).value = element.nome;
					_line = _line + 1;
				}).then(function () {
					////console.log('BI-REPORT1toXLXS >>> All searchs have finished!');
					try {
						wb.xlsx.writeFile(_path + _namexlsx).then(function () { });
					} catch (err) {
						log("Error writing to file ", err);
					}
					var payload = { url: "https://ccs-promocao.cruzeirodosul-aluno.com.br/supervisor/report/" + _namexlsx };
					socket.emit('bi-report1toxlsx', payload);
				});
			}
		});
	});

	socket.on('bi-loginstoxlsx', function (payload) {
		////console.log('Request Report 1 to XLSX, Parameters: ' + payload.params + '...');
		var qry = "SELECT fkid, fkname, date, DATE_FORMAT(DATE, '%d/%m/%Y %H:%m:%s') AS dateForm FROM tab_logins WHERE fkid != '2' " + payload + " GROUP BY fkid, DATE(DATE);";
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
				var _namexlsx = "logins" + Date.now() + ".xlsx";
				ws.getCell('A1').value = "Id Operador";
				ws.getCell('B1').value = "Operador";
				ws.getCell('C1').value = "Data";
				ws.getCell('D1').value = "Login";
				ws.getCell('E1').value = "Logout";
				ws.getCell('F1').value = "Qtd Logouts";
				// Data
				var _sessionlast;
				// Async
				foreachasync(result, async function (element, index) {

					// Get more Info
					let minLogin, maxLogout, contLogout;
					let infoArr = await getLoginsInfo(element.fkid, element.date)
					console.log(infoArr);
					// Remove RowDataPacket Part1
					if (infoArr[0].length > 0) { minLogin = infoArr[0][0] } else { minLogin = { 'data': '' } }
					if (infoArr[1].length > 0) { maxLogout = infoArr[1][0] } else { maxLogout = { 'data': '' } }
					if (infoArr[2].length > 0) { contLogout = infoArr[2][0] } else { contLogout = { 'cont': '' } }
					// Remove RowDataPacket Part2
					minLogin = JSON.stringify(minLogin)
					maxLogout = JSON.stringify(maxLogout)
					contLogout = JSON.stringify(contLogout)
					// Remove RowDataPacket Part3
					minLogin = JSON.parse(minLogin)
					maxLogout = JSON.parse(maxLogout)
					contLogout = JSON.parse(contLogout)

					// Add Elements
					if (minLogin) { element.minLogin = minLogin.data } else { element.minLogin = "" }
					if (maxLogout) { element.maxLogout = maxLogout.data } else { element.maxLogout = "" }
					if (contLogout) { element.contLogout = contLogout.cont } else { element.contLogout = "" }

					// Create Excel
					ws.getCell('A' + _line).value = element.fkid;
					ws.getCell('B' + _line).value = element.fkname;
					ws.getCell('C' + _line).value = element.dateForm;
					ws.getCell('D' + _line).value = element.minLogin;
					ws.getCell('E' + _line).value = element.maxLogout;
					ws.getCell('F' + _line).value = element.contLogout;

					_line = _line + 1;

				}).then(function () {
					try {
						wb.xlsx.writeFile(_path + _namexlsx).then(function () { });
					} catch (err) {
						log("Error writing to file ", err);
					}
					var payload = { url: "https://ccs-promocao.cruzeirodosul-aluno.com.br/supervisor/report/" + _namexlsx };
					socket.emit('bi-loginstoxlsx', payload);
				});
			}
		});
	});

	socket.on('bi-blocktoxls', function (payload) {
		////console.log('Request Report 1 to XLSX, Parameters: ' + payload.params + '...');
		var qry = "SELECT * FROM tab_timeout WHERE data_bloqueio BETWEEN ? AND ? ORDER BY data_bloqueio DESC";
		dbcc.query(qry, [payload.dt[0], payload.dt[1]], async function (err, result) {
			if (err) {
				log("Erro: " + err);
			} else {
				if (result.length > 0) {
					try {
						var columns = Object.keys(result[0]).map((element) => {
							return { header: element, key: element, width: 10 }
						});
						var wb = new excel.Workbook;
						var ws = wb.addWorksheet('report');
						var _path = "/home/ubicua/dev-cruzeirowsf/public/supervisor/report/";
						var _namexlsx = "bloqueios" + Date.now() + ".xlsx";
						ws.columns = columns;
						ws.addRows(result)

						await wb.xlsx.writeFile(_path + _namexlsx);
						console.log('downloading file');
						var payload = { url: process.env.CCS_REPORT + _namexlsx };
						socket.emit('bi-blocktoxls', payload);

					} catch (error) {
						return next(error)
					}
				} else {
					var payload = { url: "" };
					socket.emit('bi-blocktoxls', payload);
				}
			}
		});
	})

	socket.on('bi-report1', function (payload) {

		////console.log('Request Report 1, Parameters: ' + payload.params + '...');
		var _params = payload.params;
		var _limit = payload.limit;
		var _transbordoDt = payload.transbordoDt;
		var qry = 'CALL css_report("0","' + _transbordoDt + '","' + _params + '", "COUNT(*) as total");';
		////console.log("COUNT", qry)
		dbcc.query(qry, [], function (err, result) {
			if (err) {
				log("Erro: " + err);
			} else {
				var _count = result[1][0].total;
				if (_count == 0) {
					var payload = { count: 0, reportadata: '' };
					socket.emit('bi-report1', payload);
				} else {
					var qry = 'CALL css_report("' + _limit + '","' + _transbordoDt + '","' + _params + '", "*");';
					////console.log("TESTE" + qry)
					dbcc.query(qry, [], function (err, result) {
						if (err) {
							log("Erro: " + err);
						} else {
							var _reportdata = [];
							var _lenchat = result[1].length - 1;
							foreachasync(result[1], function (element, index) {
								var _serialized = {
									filename: element.filename,
									sessionid: element.sessionid,
									cpf: element.cpf,
									atendir: element.atendir,
									atendente: element.atendente,
									mobile: element.mobile,
									hora: element.hora,
									data: element.data,
									status: element.status,
									rgm_aluno: element.rgm_aluno,
									nome: element.nome
								};
								_reportdata.push(_serialized);
								if (_lenchat == index) {
									var payload = { count: _count, reportadata: _reportdata };
									socket.emit('bi-report1', payload);
								}
							}).then(function () {
								////console.log('BI-REPORT1 >>> All searchs have finished!');
							});
						}
					});
				}
			}
		});
	});

	socket.on('bi-report2', function (payload) {

		////console.log('Request Report 1, Parameters: ' + payload.params + '...');
		var _params = payload.params;
		var _limit = payload.limit;
		var _transbordoDt = payload.transbordoDt;
		var qry = 'CALL ccs_consulta("0","' + _transbordoDt + '","' + _params + '", "COUNT(*) as total");';
		////console.log("COUNT", qry)
		dbcc.query(qry, [], function (err, result) {
			if (err) {
				log("Erro: " + err);
			} else {
				var _count = result[1][0].total;
				if (_count == 0) {
					var payload = { count: 0, reportadata: '' };
					socket.emit('bi-report2', payload);
				} else {
					var qry = 'CALL ccs_consulta("' + _limit + '","' + _transbordoDt + '","' + _params + '", "*");';
					////console.log("TESTE" + qry)
					dbcc.query(qry, [], function (err, result) {
						if (err) {
							log("Erro: " + err);
						} else {
							var _reportdata = [];
							var _lenchat = result[1].length - 1;
							foreachasync(result[1], function (element, index) {
								var _serialized = {
									filename: element.filename,
									sessionid: element.sessionid,
									cpf: element.cpf,
									atendir: element.atendir,
									atendente: element.atendente,
									mobile: element.mobile,
									hora: element.hora,
									data: element.data,
									status: element.status,
									rgm_aluno: element.rgm_aluno,
									nome: element.nome
								};
								_reportdata.push(_serialized);
								if (_lenchat == index) {
									var payload = { count: _count, reportadata: _reportdata };
									socket.emit('bi-report2', payload);
								}
							}).then(function () {
								////console.log('BI-REPORT2 >>> All searchs have finished!');
							});
						}
					});
				}
			}
		});
	});

	socket.on('bi-answer_new_queue', async function (payload) {

		var _fkto = payload.fkid;
		var _fkname = payload.fkname;
		console.log(payload);
		var query = `SELECT mobile, dtin, account, photo FROM tab_filain WHERE status=1 ORDER BY dtin LIMIT 1`
		console.log(query)
		dbcc.query(query, [], async function (err, result) {
			if (err) {
				log(err);
			} else {
				var _mobile = result[0].mobile;
				var _dtin = result[0].dtin;
				var _account = result[0].account;
				var _photo = result[0].photo;
				var _atendir = result[0].atendir;

				await insertTabAtendeIn(_mobile, _dtin, _account, _photo, _fkto, _fkname, _atendir)
				socket.emit('bi-answer_new_queue', payload);

			}
		});
	});

	socket.on('bi-answer_new_prior', function (payload) {

		var _fkto = payload.fkid;
		var _fkname = payload.fkname;
		console.log(payload);
		dbcc.query('SELECT mobile, dtin, account, photo FROM tab_filain WHERE status=7 ORDER BY dtin LIMIT 1;', [], async function (err, result) {
			if (err) {
				log(err);
			} else {
				var _mobile = result[0].mobile;
				var _dtin = result[0].dtin;
				var _account = result[0].account;
				var _photo = result[0].photo;
				var _atendir = result[0].atendir;
				await insertTabAtendeIn(_mobile, _dtin, _account, _photo, _fkto, _fkname, _atendir)
				socket.emit('bi-answer_new_prior', payload);

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

	socket.on('bi-usertimeout', function (payload) {
		var query1 = "UPDATE db_cruzeiro_ccs.tab_usuarios SET bloqueado = 'sim' WHERE id = ?"
		var params1 = [payload.fkid]
		dbcc.query(query1, params1, function (err, result) {
			if (err) { console.log(err); }
			var query2 = "INSERT INTO db_cruzeiro_ccs.tab_timeout(id,fkid_atendente,nome_atendente) VALUES(UUID(),?,?)"
			var params2 = [payload.fkid, payload.fkname]
			dbcc.query(query2, params2, function (err, result) {
				if (err) { console.log(err); }
				for (var i in io.sockets.connected) {
					var _fkid = io.sockets.connected[i].fkid;
					if (_fkid === payload.fkid) {
						io.sockets.connected[i].emit('bi-usertimeout')
					}
				}
			});
		})
	});

	socket.on('sentinel_message_send', function (payload) {
		////console.log('sentinel_message_send <> ');
		////console.log(payload);
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
					dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgtext], function (err, result) {
						if (err) {
							console.log(err)
						}
						log("Novo Registro LOG Inserido", _id);
					});
				} else {
					dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [_id, _sessionid, _fromid, _fromname, _toid, _toname, _msgdir, _msgtype, _msgurl, _msgcaption], function (err, result) {
						if (err) {
							console.log(err)
						}
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
			dbcc.query("UPDATE db_cruzeiro_ccs.tab_waboxappin SET status=1 WHERE id=?", [payload.id]);
		}
	});

	socket.on('sentinel_confirm_send', function (payload) {
		socket.broadcast.emit('sentinel_confirm_send', payload);
	});

	socket.on('sentinel_clients_alive', function () {
		////console.log("\n\n");
		////console.log("----------------------------------------------------");
		////console.log("----     R T   U B I C U A   P L A T F O R M    ----");
		////console.log("----------------------------------------------------");
		////console.log("Sentinel Clients Alive");
		////console.log("Numero de Usuarios Conectados: " + numUsers + "  -  Data/Hora: " + getTimestamp());
		////console.log("---------------------------------------------------------------------------------------------------------------");
		var payload = "[";
		for (var i in io.sockets.connected) {
			////console.log('Socket: ' + i + ' FKID: ' + io.sockets.connected[i].fkid + ' Name: ' + io.sockets.connected[i].fkname + ' Date: ' + io.sockets.connected[i].fkon + ' Address: ' + io.sockets.connected[i].fkip);
			payload += { fkname: io.sockets.connected[i].fkname, fkdt: io.sockets.connected[i].fkon, fkip: io.sockets.connected[i].fkip };
			socket.broadcast.emit('sentinel_clients_alive');
		}
		socket.broadcast.emit('sentinel_clients_alive');
		////console.log("---------------------------------------------------------------------------------------------------------------\n");
	});

	socket.on('sentinel_clients_queue', function (payload) {
		//////console.log("\n\n");
		//////console.log("----------------------------------------------------");
		//////console.log("----     R T   U B I C U A   P L A T F O R M    ----");
		//////console.log("----------------------------------------------------");
		//////console.log("Sentinel Clients Queue");
		//////console.log("---------------------------------------------------------------------------------------------------------------");
		dbcc.query('SELECT * FROM db_cruzeiro_ccs.vw_fila;', [], function (err, result) {
			socket.broadcast.emit('sentinel_clients_queue', result);
		});
		//////console.log(payload);
		//////console.log("---------------------------------------------------------------------------------------------------------------");
		//////console.log("Sentinel Clients Alive");
		//////console.log("Numero de Usuarios Conectados: " + numUsers + "  -  Data/Hora: " + getTimestamp());
		//////console.log("---------------------------------------------------------------------------------------------------------------");
		var payload = "[";
		for (var i in io.sockets.connected) {
			//////console.log('Socket: ' + i + ' FKID: ' + io.sockets.connected[i].fkid + ' Name: ' + io.sockets.connected[i].fkname);
			//////console.log('Socket: ' + i + ' FKID: ' + io.sockets.connected[i].fkid + ' Name: ' + io.sockets.connected[i].fkname + ' Date: ' + io.sockets.connected[i].fkon + ' Address: ' + io.sockets.connected[i].fkip + ' Status: ' + io.sockets.connected[i].fkstatus);
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
		//////console.log("---------------------------------------------------------------------------------------------------------------\n");
	});

	socket.on('bi-auth', function (payload) {
		log("Novo Login de Usuário", payload);
		var _fkname = payload.fkname;
		var _fkpass = payload.fkpass;
		var _key = payload.key;
		var _app = payload.app;
		if (_key == "a02c7f8c8bf9635037eb5653302f8b84") {
			dbcc.query('SELECT * FROM tab_usuarios WHERE usuario=? LIMIT 1', [_fkname], function (err, result) {
				console.log(err);
				if (result.length > 0) {
					// Validando Perfil
					if (_app == 3) {
						var _senha = result[0].senha;
						// Validando Senha
						if (md5(_fkpass) == _senha) {
							////console.log('senha ok');
							var _status = result[0].status;
							var _block = result[0].bloqueado
							// Verificando Status do Usuário
							if (_block == "sim") {
								socket.emit('bi-auth', { response: 9 });
							} else if (_status == 1) {
								var _id = result[0].id;
								var _nome = result[0].nome;
								var payload = { response: 1, id: _id, nome: _nome };
								socket.emit('bi-auth', payload);
							} else {
								socket.emit('bi-auth', { response: 2 });
							}
						} else {
							////console.log('emitiu');
							socket.emit('bi-auth', { response: 3 });
						}
					} else if (_app == 2) {
						if (_app == result[0].perfil) {
							var _senha = result[0].senha;
							// Validando Senha
							if (md5(_fkpass) == _senha) {
								////console.log('senha ok');
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
								////console.log('emitiu');
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

	socket.on('add user', async function (payload) {
		if (addedUser) return;

		////console.log('>>>>>>>>>>>>>>>>>\n');
		////console.log(payload);
		// we store the username in the socket session for this client
		socket.fkid = payload.fkid;
		socket.fkname = payload.fkname;
		socket.fkon = socket.handshake.time;
		socket.fkip = socket.handshake.address;
		socket.fkstatus = 'Online';
		log('USUARIO CONECTADO: ' + payload.fkname);
		log('LOGIN REG: ' + socket.fkid)
		await insertLogReg(socket.fkid, socket.fkname, 'login')
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

	socket.on('alive', function () {
		onalive(socket.id);
	});

	socket.on('typing', function () {
		socket.broadcast.emit('typing', {
			username: socket.username
		});
	});

	socket.on('stop typing', function () {
		socket.broadcast.emit('stop typing', {
			username: socket.username
		});
	});

	socket.on('disconnect', async function () {
		if (addedUser) {
			--numUsers;
			log('LOGOUT REG: ' + socket.fkid)
			await insertLogReg(socket.fkid, socket.fkname, 'logout')
			//chatcore.deleteOne({ userid: socket.id}, function(err, result){
			//        ////console.log('Usuario Descontecou: ' + socket.username);
			//});
			// echo globally that this client has left
			////console.log("USUARIO DESCONECTADO:::::::::::::::::::: " + socket.id);
			socket.disconnect();
			//////console.log(socket);
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
		//////console.log('sentinel_waendpoint................' + _host);
		dbcc.query("SELECT waendpoint FROM db_cruzeiro_ccs.tab_config WHERE id=1", [], function (err, result) {
			_host = result[0].waendpoint;
			socket.broadcast.emit('waendpoint', { server: _host });
		});
	});

	socket.on('sentinel_monitor', function (payload) {

		dbcc.query("SELECT uuid() as UUID;", function (err, id) {
			var _custom_uid = id[0].UUID;
			let teste = {
				infra: _mobileUid,
				id: '5511999991152@c.us',
				msg: payload,
				media: 'chat'
			}
			if (_host == "LON") {
				request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
					////console.log(teste)
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
		dbcc.query("SELECT * FROM tab_ativo WHERE status=0 ORDER BY nome", function (err, result) {
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
		dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
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

	socket.on('bi-addativo', async function (payload) {
		//console.log(payload.length)
		for (i = 0; i < payload.length; i++) {
			//console.log(payload[i])
			var _nome = payload[i].nome;
			var _rgm_aluno = payload[i].rgm_aluno;
			var _cpf = payload[i].cpf;
			var _celular = payload[i].celular;
			var _filename = payload[i].filename;
			var _quantidade = payload[i].quantidade;
			if (_celular != "" && _celular != null) {
				_celular = _celular.replace(/[^\w\s]/gi, '')
				_celular = _celular.replace(/\D/g, '');
				if (_celular.length < 13) {
					_celular = "55" + _celular;
				}
				if (_celular != "" && _celular != null && _celular.length >= 9) {
					await addAtivoMail(_nome, _rgm_aluno, _cpf, _celular, _filename, _quantidade)
				}
			}
		}
	});

	socket.on('bi-callinput', function (payload) {
		var _fkto = payload.fkid;
		var _fkname = payload.fkname;
		var _mobile = payload.mobile;
		var _atendir = 'out';
		var _dtin = getTimestamp();
		dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_filain WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
			if (result.length == 0) {
				dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
					if (result.length == 0) {
						dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, fkto, fkname, atendir) VALUES(UUID(), ?, ?, ?, ?, ?)", [_mobile, _dtin, _fkto, _fkname, _atendir],
							function (err, result) {
								if (err) {
									log("Erro ao Encaminhar Usuario para Atendimento, Erro: " + err);
								} else {
									socket.emit('bi-atendemail', {
										status: '200'
									});
								}
							});
					} else {
						socket.emit('bi-callinput', {
							status: '400'
						});
					}
				});
			} else {
				socket.emit('bi-callinput', {
					status: '400'
				});
			}
		});
	});

	function loadBase64(hashFile, fileType) {
		return new Promise(function (resolve, reject) {
			request.get({ url: process.env.CCS_CDN_BASE + hashFile }, function (err, httpResponse, body) {
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

	function getLoginsInfo(fkid, date) {
		return new Promise(function (resolve, reject) {
			let minLogin, maxLogout, contLogouts;

			// Get Min Login
			dbcc.query("SELECT DATE_FORMAT(DATE, '%d/%m/%Y %H:%m:%s') AS data FROM tab_logins WHERE fkid = ? AND STATUS = 'login' AND DATE(DATE) = DATE(?) ORDER BY DATE ASC LIMIT 1; ", [fkid, date], function (err, result1) {
				if (err) { console.log(err) }
				minLogin = result1
				// Get Max Logout
				dbcc.query("SELECT DATE_FORMAT(DATE, '%d/%m/%Y %H:%m:%s') AS data FROM tab_logins WHERE fkid = ? AND STATUS = 'logout' AND DATE(DATE) = DATE(?) ORDER BY DATE DESC LIMIT 1; ", [fkid, date], function (err, result2) {
					if (err) { console.log(err) }
					maxLogout = result2
					// Get Count
					dbcc.query("SELECT COUNT(*) as cont FROM tab_logins WHERE fkid = ? AND STATUS = 'logout' AND DATE(DATE) = DATE(?);", [fkid, date], function (err, result3) {
						if (err) { console.log(err) }
						contLogouts = result3
						resolve([minLogin, maxLogout, contLogouts])
					})
				})
			})


		})
	}

	function addAtivoMail(_nome, _rgm_aluno, _cpf, _celular, _filename, _quantidade) {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT COUNT(*) as resultCount FROM tab_ativo WHERE DATE(dtcadastro) = DATE(NOW());", [], function (err, result) {
				if (err) { console.log(err) }
				if (result[0].resultCount <= 500) {
					dbcc.query("SELECT UUID() AS UUID;", [], function (err, result) {
						if (err) { console.log(err) }
						var _id = result[0].UUID;
						dbcc.query("SELECT * FROM tab_ativo WHERE mobile='" + _celular + "' and status = 0;", function (err, result) {
							if (err) { console.log(err) }
							if (result.length < 1) {
								dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_ativo (id, nome, rgm_aluno, cpf, mobile, filename, quantidade) VALUES (?,?,?,?,?,?,?);", [_id, _nome, _rgm_aluno, _cpf, _celular, _filename, _quantidade], function (err, result) {
									if (err) { console.log(err) }
									dbcc.query("SELECT * FROM tab_ativo WHERE status=0", [], function (err, result) {
										if (err) { console.log(err) }
										if (result.length > 0) {
											var _ativo = JSON.stringify(result);
											socket.emit('bi-addativo', _ativo);
											resolve('200')
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
		})
	}

	function insertTabAtendeIn(_mobile, _dtin, _account, _photo, _fkto, _fkname, _atendir) {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT * FROM db_cruzeiro_ccs.tab_atendein WHERE mobile=? LIMIT 1", [_mobile], function (err, result) {
				if (err) throw err
				if (result.length == 0) {
					dbcc.query("UPDATE tab_filain SET status=2 WHERE mobile=" + _mobile, function (err, id) {
						if (err) throw err
					});
					dbcc.query("SELECT UUID() AS UUID;", [], function (err, result) {
						var _sessionid = result[0].UUID;
						dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname) VALUES(?, ?, ?, ?, ?, ?, ?)", [_sessionid, _mobile, _dtin, _account, _photo, _fkto, _fkname], function (err, result) {
							console.log(result)
							if (err) {
								log("Erro ao Encaminhar Usuário para Atendimento, Erro: " + err);
							} else {
								dbcc.query("DELETE FROM tab_filain WHERE mobile=" + _mobile);
								payload = { sessionid: _sessionid, mobile: _mobile, account: _account, photo: _photo, atendir: _atendir };
								resolve(payload)
							}
						});
					})
				}
			});
		})
	}

	function insertLogReg(id, nome, status) {
		return new Promise(function (resolve, reject) {
			dbcc.query("INSERT INTO db_cruzeiro_ccs.tab_logins (id,fkid,fkname,status) VALUES (UUID(), ?, ?, ?)", [id, nome, status], function (err, result) {
				if (err) {
					console.log(err)
				} else {
					resolve('200')
				}
			})
		})
	}

	function onPedidos(_sessionid) {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT segmento, pedido, valor FROM tab_pedidos WHERE sessionid=?", [_sessionid], function (err, res) {
				resolve(res);
			});
		});
	}

	function updateMailing(mobile) {
		dbcc.query("UPDATE db_cruzeiro_ccs.tab_ativo SET status=1 WHERE mobile=" + mobile + "", function (err, res) {
			return res
		});
	}
});

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
		request.post({ url: process.env.CCS_EXTENSION, form: teste }, function (err, httpResponse, body) {
		});
	});
}

function onkill() {
	////console.log(new Date() + " >> onKill acionando!");
}

function onalive(fkid) {


	pool.getConnection(function (err, connection) {
		if (err) log(err);
		connection.query('UPDATE db_cruzeiro_ccscore.tab_fila SET alive=now() WHERE fkid=?', [fkid], function (err, results) {
			if (err) log(err);
			log('::::::::::::::::: ID ATUALIZOU ALIVE...' + fkid);
		});
	});

}

function findInFila(mobile) {
	return new Promise(function (resolve, reject) {
		dbcc.query("SELECT * FROM tab_filain WHERE mobile = ?;", [mobile], function (err, result) {
			if (err) { console.log(err) }
			if (result.length > 0) {
				resolve(0)
			} else {
				resolve(1)
			}
		});
	})
}

function findInAtende(mobile) {
	return new Promise(function (resolve, reject) {
		dbcc.query("SELECT * FROM tab_atendein WHERE mobile = ?;", [mobile], function (err, result) {
			if (err) { console.log(err) }
			if (result.length > 0) {
				resolve(0)
			} else {
				resolve(1)
			}
		});
	})
}

server.listen(port, function () {
	log('Chat Core - Ubicua Cloud Platform - Listening at Port ' + port);
	////console.log(new Date().getHours())
});

process.on('uncaughtException', function (err) {
	//console.error(' ');
	//console.error('----- ' + (new Date).toUTCString() + ' ----------------------------------')
	//console.error('Erro uncaughtException: ', err.message)
	//console.error(err.stack)
	//console.error(' ');
	return
});

