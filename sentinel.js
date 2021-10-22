// Setup ENV
const dotenv = require('dotenv')
dotenv.config()

// Setup Chat Core Ubicua Cloud Platform
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const port = process.env.PORT || 80;
const io = require("socket.io-client");
const socket = io("https://kainos.ubicuacloud.com.br");

// Function Platforma Ubicua
require('./database/tools')();
const dbcc = require('./database/dbcc');

// Config App Express
const app = express();
const server = require('http').createServer(app);

// Configure App Server
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Routes

function sentinelClientsqueue() {
    return new Promise(async function (resolve, reject) {
        console.log('sentinelClientsQueue');
        socket.emit('sentinel_clients_queue');
        resolve('finished');
    })
}

function sentinelNewmessages() {
    return new Promise(async function (resolve, reject) {
        console.log('sentinelNewmessages');
        let queryA = "SELECT id, uid, contact_uid, contact_name, message_uid, message_type, body_text, body_caption, body_url FROM tab_waboxappin WHERE message_dir='i' AND status=0 AND contact_type = 'User' ORDER by dtin;";
        let paramsA = [];
        let messagesList = await runDynamicQuery(queryA, paramsA);
        if (messagesList.length > 0) {
            for (i = 0; i < messagesList.length; i++) {
                message_id = messagesList[i].id;
                message_uid = messagesList[i].uid;
                message_mobile = messagesList[i].contact_uid;
                message_name_before = messagesList[i].contact_name;
                message_name = messagesList[i].contact_name.replace("'", "");
                message_message_uid = messagesList[i].message_uid;
                message_message_type = messagesList[i].message_type;
                message_body_text = messagesList[i].body_text;
                message_body_caption = messagesList[i].body_caption;
                message_body_url = messagesList[i].body_url;
                // Select from atendimento
                let queryB = "SELECT sessionid, fkto, fkname, name FROM tab_atendein WHERE mobile=? LIMIT 1;"
                let paramsB = [message_mobile]
                let atendeList = await runDynamicQuery(queryB, paramsB);
                if (atendeList.length > 0) {
                    let message_sessionid, message_fkto, message_fkname, message_namea;
                    for (b = 0; b < atendeList.length; b++) {
                        message_sessionid = atendeList[b].sessionid;
                        message_fkto = atendeList[b].fkto;
                        message_fkname = atendeList[b].fkname;
                        message_namea = atendeList[b].name;
                    }
                    let payload = [{
                        "id": message_id,
                        "uid": message_uid,
                        "contact_uid": message_mobile,
                        "message_uid": message_message_uid,
                        "message_type": message_message_type,
                        "body_text": message_body_text,
                        "body_caption": message_body_caption,
                        "body_url": message_body_url,
                        "sessionid": message_sessionid,
                        "fkto": message_fkto,
                        "fkname": message_fkname,
                        "name": message_namea
                    }]
                    socket.emit('sentinel_message_send', payload);
                } else {
                    let queryC = "SELECT * FROM tab_filain WHERE mobile=?  LIMIT 1;"
                    let paramsC = [message_mobile]
                    let filaList = await runDynamicQuery(queryC, paramsC);
                    if (filaList.length == 0) {
                        let queryD = "SELECT mobile FROM tab_prior WHERE mobile=? LIMIT 1;"
                        let paramsD = [message_mobile]
                        let priorList = await runDynamicQuery(queryD, paramsD);
                        if (priorList.length == 1) {
                            let queryInsert = "INSERT INTO tab_filain (mobile, account, status, sessionBotCcs) VALUES(?, 'prior', '5', UUID());"
                            let paramsInsert = [message_mobile]
                            let insert = await runDynamicQuery(queryInsert, paramsInsert);
                        } else {
                            let queryInsert = "INSERT INTO tab_filain (mobile, status, sessionBotCcs) VALUES(?, '5', UUID());"
                            let paramsInsert = [message_mobile]
                            let insert = await runDynamicQuery(queryInsert, paramsInsert);
                        }
                        if (message_uid != "CHAT") {
                            let payload = [{
                                "mobile": message_mobile,
                                "type": "chat"
                            }]
                            socket.emit("send_welcome", payload)
                        }
                    }
                }
            }
            resolve('finished')
        }
    })
}


server.listen(port, function () {
    log('Chat Core - Ubicua Cloud Platform - Listening at Port ' + port);
});

process.on('uncaughtException', function (err) {
    return
});