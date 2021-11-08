// Setup ENV
const dotenv = require('dotenv')
dotenv.config()

// NPM modules
const express = require('express');
const router = express.Router();
const fs = require('fs');
const excel = require('exceljs');
const foreachasync = require('foreachasync').forEachAsync;
const emoji = require('emoji');

// Config App Express
const app = express();
const options = { key: fs.readFileSync(process.env.CCS_OPTIONSKEY), cert: fs.readFileSync(process.env.CCS_OPTIONSCERT) };
const server = require('https').createServer(options, app);
const io = app.get("socketio");

// Mariadb Connection
const db = require('../database/dbcc');

// Ubc Tools
require('../database/tools')();

router.post('/v1/message', function (req, res, next) {
	let _hostin = "LON";
	let _event = req.body.event;
	if (_event === "message") {

		log("Event: Message", req.body);

        // Default Params
		let _uid = req.body.uid;
		let _dtin = getTimestamp();
		let _contact_uid = req.body.contact.uid;
		let _contact_name = req.body.contact.name;
		let _contact_type = req.body.contact.type;
		let _message_type = req.body.message.type;
		let _message_ack = req.body.message.ack;
		let _message_cuid = req.body.message.cuid;
		let _message_dir = req.body.message.dir;
		let _message_dtm = req.body.message.dtm;
		let _message_uid = req.body.message.uid;

        // Opt Params
        let _body_text, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url, _body_duration, _body_contact, _body_vcard, _body_name, _body_lng, _body_lat;

        // Query Params
        let qry, paramsArr;
        
		if (_contact_uid.indexOf('status') < 0 && _contact_uid.indexOf('g.us') < 0) {

            // Message Type Chat
			if (_message_type === "chat") {
				
                _body_text = emoji.unifiedToHTML(req.body.message.body.text);

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_text, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_text];

            // Message Type Image
			} else if (_message_type === "image") {
				
                _body_caption = req.body.message.body.caption;
                _body_mimetype = req.body.message.body.mimetype;
                _body_size = req.body.message.body.size;
                _body_thumb = req.body.message.body.thumb;
                _body_url = req.body.message.body.url;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url];

            // Message Type Video
			} else if (_message_type === "video") {
            
                _body_caption = req.body.message.body.caption;
                _body_mimetype = req.body.message.body.mimetype;
                _body_size = req.body.message.body.size;
                _body_duration = req.body.message.body.duration;
                _body_thumb = req.body.message.body.thumb;
                _body_url = req.body.message.body.url;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_thumb, _body_url];

            // Message Type Audio
			} else if (_message_type === "audio") {

                _body_caption = req.body.message.body.caption;
                _body_mimetype = req.body.message.body.mimetype;
                _body_size = req.body.message.body.size;
                _body_duration = req.body.message.body.duration;
                _body_url = req.body.message.body.url;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url];

            // Message Type Ptt
			} else if (_message_type === "ptt") {

                _body_caption = req.body.message.body.caption;
                _body_mimetype = req.body.message.body.mimetype;
                _body_size = req.body.message.body.size;
                _body_duration = req.body.message.body.duration;
                _body_url = req.body.message.body.url;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size, body_duration, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_duration, _body_url];

            // Message Type Document
			} else if (_message_type === "document") {

                _body_caption = req.body.message.body.caption;
                _body_mimetype = req.body.message.body.mimetype;
                _body_size = req.body.message.body.size;
                _body_thumb = req.body.message.body.thumb;
                _body_url = req.body.message.body.url;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_caption, body_mimetype, body_size,  body_thumb, body_url, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_caption, _body_mimetype, _body_size, _body_thumb, _body_url];

            // Message Type Vcard
			} else if (_message_type === "vcard") {

                _body_contact = req.body.message.body.contact;
                _body_vcard = req.body.message.body.vcard;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_contact, body_vcard, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_contact, _body_vcard];

            // Message Type Location
			} else if (_message_type === "location") {

                _body_name = req.body.message.body.name;
                _body_lng = req.body.message.body.lng;
                _body_lat = req.body.message.body.lat;
                _body_thumb = req.body.message.body.thumb;

                qry = 'INSERT INTO tab_waboxappin (id, host, uid, dtin, contact_uid, contact_name, contact_type, message_dtm, message_uid, message_cuid, message_dir, message_type, message_ack, body_name, body_lng, body_lat, body_thumb, status) VALUES(uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
                paramsArr = [_hostin, _uid, _dtin, _contact_uid, _contact_name, _contact_type, _message_dtm, _message_uid, _message_cuid, _message_dir, _message_type, _message_ack, _body_name, _body_lng, _body_lat, _body_thumb];

			}

            db.query(qry, paramsArr, function (err, rows, fields) {
                if (err) {
                    log("Erro ao Inserir Mensagem do WABOXAPP: " + err);
                } else {
                    log("Nova Mensagem Recebida WABOXAPP...");
                }
            });

		} else {
            console.log('Recebimento de Stories')
        }

		res.sendStatus(200);

	} else if (_event == "ack") {

		log("ACK Received", req.body);
		res.sendStatus(200);
        
	}
});

function onrefusegroup(admin) {
	var _mobile = admin;
	var _message = "Prezado Cliente,\n\nEsse canal não permite mensagens a partir de Grupo WhatsApp.";
	dbcc.query("SELECT uuid() as UUID;", function (err, id) {
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

module.exports = router;