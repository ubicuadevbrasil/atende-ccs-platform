// Setup ENV
const dotenv = require('dotenv')
dotenv.config()

// NPM modules
const express = require('express');
const router = express.Router();
const excel = require('exceljs');
const foreachasync = require('foreachasync').forEachAsync;

// Mariadb Connection
const db = require('../database/dbcc');

// Export - Fila
router.get('/filain/', async function (req, res) {

    let auth = req.headers['authorization'];
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Sorry! Invalid Authentication.');
    } else {
        let authRes = await authUser(auth, 'exportAtendein', res);
        if (authRes == 'ok') {
            // Generate Excel
            db.query("SELECT * FROM tab_filain ORDER BY dtin;", function (err, rows, fields) {
                if (err) {
                    console.log('Erro: ' + err);
                } else {
                    console.log('Running Excel');
                    var workbook = excel.Workbook;
                    var wb = new workbook();
                    var ws = wb.addWorksheet('report');
                    var fileLine = 2;
                    var filePath = "/home/ubicua/fortalcred-ccs-platform/public/supervisor/report/";
                    var fileName = "fila" + Date.now() + ".xlsx";
                    console.log('Excel Create');
                    ws.getCell('A1').value = "mobile";
                    ws.getCell('B1').value = "dtin";
                    ws.getCell('C1').value = "account";
                    ws.getCell('D1').value = "photo";
                    ws.getCell('E1').value = "name";
                    ws.getCell('F1').value = "status";
                    ws.getCell('G1').value = "sessionBot";
                    ws.getCell('H1').value = "intent";
                    ws.getCell('I1').value = "optAtendimento";
                    ws.getCell('J1').value = "origem";
                    ws.getCell('K1').value = "sessionBotCcs";
                    ws.getCell('L1').value = "optValue";
                    ws.getCell('M1').value = "error_count";
                    console.log('Run ForEach');
                    foreachasync(rows, function (element, index) {
                        ws.getCell('A' + fileLine).value = element.mobile;
                        ws.getCell('B' + fileLine).value = element.dtin;
                        ws.getCell('C' + fileLine).value = element.account;
                        ws.getCell('D' + fileLine).value = element.photo;
                        ws.getCell('E' + fileLine).value = element.name;
                        ws.getCell('F' + fileLine).value = element.status;
                        ws.getCell('G' + fileLine).value = element.sessionBot;
                        ws.getCell('H' + fileLine).value = element.intent;
                        ws.getCell('I' + fileLine).value = element.optAtendimento;
                        ws.getCell('J' + fileLine).value = element.origem;
                        ws.getCell('K' + fileLine).value = element.sessionBotCcs;
                        ws.getCell('L' + fileLine).value = element.optValue;
                        ws.getCell('M' + fileLine).value = element.error_count;
                        fileLine = fileLine + 1;
                    }).then(function () {
                        try {
                            console.log('File Written');
                            wb.xlsx.writeFile(filePath + fileName).then(function () { });
                        } catch (err) {
                            console.log("Error writing to file ", err);
                        }
                        res.send(process.env.CCS_REPORT + fileName)
                    });
                }
            });
        } else if (authRes == 'error') {
            res.send('error')
        }
    }
});

// Export - Atendimento
router.get('/atendein/', async function (req, res) {

    let auth = req.headers['authorization'];
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Sorry! Invalid Authentication.');
    } else {
        let authRes = await authUser(auth, 'exportAtendein', res);
        if (authRes == 'ok') {
            // Generate Excel
            db.query("SELECT * FROM tab_atendein ORDER BY dtin;", function (err, rows, fields) {
                if (err) {
                    console.log('Erro: ' + err);
                } else {
                    console.log('Running Excel');
                    var workbook = excel.Workbook;
                    var wb = new workbook();
                    var ws = wb.addWorksheet('report');
                    var fileLine = 2;
                    var filePath = "/home/ubicua/fortalcred-ccs-platform/public/supervisor/report/";
                    var fileName = "atendimentos" + Date.now() + ".xlsx";
                    console.log('Excel Create');
                    ws.getCell('A1').value = "sessionid";
                    ws.getCell('B1').value = "mobile";
                    ws.getCell('C1').value = "dtin";
                    ws.getCell('D1').value = "dtat";
                    ws.getCell('E1').value = "account";
                    ws.getCell('F1').value = "photo";
                    ws.getCell('G1').value = "fkto";
                    ws.getCell('H1').value = "fkname";
                    ws.getCell('I1').value = "transfer";
                    ws.getCell('J1').value = "status";
                    ws.getCell('K1').value = "atendir";
                    ws.getCell('L1').value = "sessionBot";
                    ws.getCell('M1').value = "sessionBotCcs";
                    ws.getCell('N1').value = "origem";
                    ws.getCell('O1').value = "optAtendimento";
                    ws.getCell('P1').value = "optValue";
                    console.log('Run ForEach');
                    foreachasync(rows, function (element, index) {
                        ws.getCell('A' + fileLine).value = element.sessionid;
                        ws.getCell('B' + fileLine).value = element.mobile;
                        ws.getCell('C' + fileLine).value = element.dtin;
                        ws.getCell('D' + fileLine).value = element.dtat;
                        ws.getCell('E' + fileLine).value = element.account;
                        ws.getCell('F' + fileLine).value = element.photo;
                        ws.getCell('G' + fileLine).value = element.fkto;
                        ws.getCell('H' + fileLine).value = element.fkname;
                        ws.getCell('I' + fileLine).value = element.transfer;
                        ws.getCell('J' + fileLine).value = element.status;
                        ws.getCell('K' + fileLine).value = element.atendir;
                        ws.getCell('L' + fileLine).value = element.sessionBot;
                        ws.getCell('M' + fileLine).value = element.sessionBotCcs;
                        ws.getCell('N' + fileLine).value = element.origem;
                        ws.getCell('O' + fileLine).value = element.optAtendimento;
                        ws.getCell('P' + fileLine).value = element.optValue;
                        fileLine = fileLine + 1;
                    }).then(function () {
                        try {
                            console.log('File Written');
                            wb.xlsx.writeFile(filePath + fileName).then(function () { });
                        } catch (err) {
                            console.log("Error writing to file ", err);
                        }
                        res.send(process.env.CCS_REPORT + fileName)
                    });
                }
            });
        } else if (authRes == 'error') {
            res.send('error')
        }
    }
});

// Export - Timeout Clientes
router.get('/timeout/:datein/:datefn', async function (req, res) {

    let auth = req.headers['authorization'];
    let dateIn = req.params.datein;
    let dateFn = req.params.datefn;
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Sorry! Invalid Authentication.');
    } else {
        let authRes = await authUser(auth, 'exportTimeout', res);
        if (authRes == 'ok') {
            // Generate Excel
            db.query("SELECT * FROM tab_timeoutlogs WHERE DATE(dtout) BETWEEN ? AND ? ORDER BY dtout;", [dateIn, dateFn], function (err, rows, fields) {
                console.log(dateIn, dateFn);
                if (err) {
                    console.log('Erro: ' + err);
                } else {
                    console.log('Running Excel');
                    var workbook = excel.Workbook;
                    var wb = new workbook();
                    var ws = wb.addWorksheet('report');
                    var fileLine = 2;
                    var filePath = "/home/ubicua/fortalcred-ccs-platform/public/supervisor/report/";
                    var fileName = "timeout" + Date.now() + ".xlsx";
                    console.log('Excel Create');
                    ws.getCell('A1').value = "sessionid";
                    ws.getCell('B1').value = "mobile";
                    ws.getCell('C1').value = "dtin";
                    ws.getCell('D1').value = "dtout";
                    ws.getCell('E1').value = "intent";
                    ws.getCell('F1').value = "optAtendimento";
                    ws.getCell('G1').value = "error_count";
                    ws.getCell('H1').value = "wpp";
                    console.log('Run ForEach');
                    foreachasync(rows, function (element, index) {
                        ws.getCell('A' + fileLine).value = element.sessionid;
                        ws.getCell('B' + fileLine).value = element.mobile;
                        ws.getCell('C' + fileLine).value = element.dtin;
                        ws.getCell('D' + fileLine).value = element.dtout;
                        ws.getCell('E' + fileLine).value = element.intent;
                        ws.getCell('F' + fileLine).value = element.optAtendimento;
                        ws.getCell('G' + fileLine).value = element.error_count;
                        ws.getCell('H' + fileLine).value = element.wpp;
                        fileLine = fileLine + 1;
                    }).then(function () {
                        try {
                            console.log('File Written');
                            wb.xlsx.writeFile(filePath + fileName).then(function () { });
                        } catch (err) {
                            console.log("Error writing to file ", err);
                        }
                        res.send(process.env.CCS_REPORT + fileName)
                    });
                }
            });
        } else if (authRes == 'error') {
            res.send('error')
        }
    }
});

// Export - Timeout Clientes
router.get('/encerrain/:datein/:datefn', async function (req, res) {

    let auth = req.headers['authorization'];
    let dateIn = req.params.datein;
    let dateFn = req.params.datefn;
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Sorry! Invalid Authentication.');
    } else {
        let authRes = await authUser(auth, 'exportTimeout', res);
        if (authRes == 'ok') {
            // Generate Excel
            db.query("SELECT sessionid,mobile,dtin,dtat,dten,name,photo,fkto,fkname,transfer,status,cnpj,atendir,origem,banco FROM tab_encerrain WHERE DATE(dten) BETWEEN ? AND ? ORDER BY dten;", [dateIn, dateFn], function (err, rows, fields) {
                console.log(dateIn, dateFn);
                if (err) {
                    console.log('Erro: ' + err);
                } else {
                    res.send(JSON.stringify(rows))
                    // console.log('Running Excel');
                    // var workbook = excel.Workbook;
                    // var wb = new workbook();
                    // var ws = wb.addWorksheet('report');
                    // var fileLine = 2;
                    // var filePath = "/home/ubicua/fortalcred-ccs-platform/public/supervisor/report/";
                    // var fileName = "encerrados" + Date.now() + ".xlsx";
                    // console.log('Excel Create');
                    // ws.getCell('A1').value = "Id de sessão";
                    // ws.getCell('B1').value = "Numero Cliente";
                    // ws.getCell('C1').value = "Data Entrada";
                    // ws.getCell('D1').value = "Data Atendimento";
                    // ws.getCell('E1').value = "Data Encerramento";
                    // ws.getCell('F1').value = "Nome Cliente";
                    // ws.getCell('G1').value = "photo";
                    // ws.getCell('H1').value = "Id Atendente";
                    // ws.getCell('I1').value = "Nome Atendente";
                    // ws.getCell('J1').value = "Houve Transferencia";
                    // ws.getCell('K1').value = "Status Encerramento";
                    // ws.getCell('L1').value = "CPF";
                    // ws.getCell('M1').value = "IN/OUT";
                    // ws.getCell('N1').value = "Origem";
                    // ws.getCell('O1').value = "Banco";
                    // console.log('Run ForEach');
                    // foreachasync(rows, function (element, index) {
                    //     ws.getCell('A' + fileLine).value = element.sessionid;
                    //     ws.getCell('B' + fileLine).value = element.mobile;
                    //     ws.getCell('C' + fileLine).value = element.dtin;
                    //     ws.getCell('D' + fileLine).value = element.dtat;
                    //     ws.getCell('E' + fileLine).value = element.dten;
                    //     ws.getCell('F' + fileLine).value = element.name;
                    //     ws.getCell('G' + fileLine).value = element.photo;
                    //     ws.getCell('H' + fileLine).value = element.fkto;
                    //     ws.getCell('I' + fileLine).value = element.fkname;
                    //     ws.getCell('J' + fileLine).value = element.transfer;
                    //     ws.getCell('K' + fileLine).value = element.status;
                    //     ws.getCell('L' + fileLine).value = element.cnpj;
                    //     ws.getCell('M' + fileLine).value = element.atendir;
                    //     ws.getCell('N' + fileLine).value = element.origem;
                    //     ws.getCell('O' + fileLine).value = element.banco;
                    //     fileLine = fileLine + 1;
                    // }).then(function () {
                    //     try {
                    //         console.log('File Written');
                    //         wb.xlsx.writeFile(filePath + fileName).then(function () { });
                    //     } catch (err) {
                    //         console.log("Error writing to file ", err);
                    //     }
                    //     res.send(process.env.CCS_REPORT + fileName)
                    // });
                }
            });
        } else if (authRes == 'error') {
            res.send('error')
        }
    }
});

// Export - Fila
router.get('/status/encerramentos/', async function (req, res) {

    let auth = req.headers['authorization'];
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Sorry! Invalid Authentication.');
    } else {
        let authRes = await authUser(auth, 'exportAtendein', res);
        if (authRes == 'ok') {
            // Generate Excel
            db.query("SELECT * FROM tab_statusen;", function (err, rows, fields) {
                if (err) {
                    console.log('Erro: ' + err);
                } else {
                    console.log('Running Excel');
                    var workbook = excel.Workbook;
                    var wb = new workbook();
                    var ws = wb.addWorksheet('report');
                    var fileLine = 2;
                    var filePath = "/home/ubicua/fortalcred-ccs-platform/public/supervisor/report/";
                    var fileName = "statusen" + Date.now() + ".xlsx";
                    console.log('Excel Create');
                    ws.getCell('A1').value = "id";
                    ws.getCell('B1').value = "descricao";
                    ws.getCell('C1').value = "pedido";
                    ws.getCell('D1').value = "status";
                    console.log('Run ForEach');
                    foreachasync(rows, function (element, index) {
                        ws.getCell('A' + fileLine).value = element.id;
                        ws.getCell('B' + fileLine).value = element.descricao;
                        ws.getCell('C' + fileLine).value = element.pedido;
                        ws.getCell('D' + fileLine).value = element.status;
                        fileLine = fileLine + 1;
                    }).then(function () {
                        try {
                            console.log('File Written');
                            wb.xlsx.writeFile(filePath + fileName).then(function () { });
                        } catch (err) {
                            console.log("Error writing to file ", err);
                        }
                        res.send(process.env.CCS_REPORT + fileName)
                    });
                }
            });
        } else if (authRes == 'error') {
            res.send('error')
        }
    }
});

function authUser(auth, exportReq, res) {
    return new Promise(function (resolve, reject) {
        let temp = auth.split(' ');
        let buffer = new Buffer(temp[1], 'base64');
        let plainAuth = buffer.toString();
        let userCredentials = plainAuth.split(':');
        let username = userCredentials[0];
        let password = userCredentials[1];

        if ((username == 'fortal_H29Sf3pW') && (password == 'MjH2GYs6M9PFFUqnR2TwDaBTUhmzxmpp')) {
            // Insert Req Log
            db.query("INSERT INTO tab_api_log (dtable, log) VALUES(" + exportReq + ", 'granted');");
            resolve('ok')
        } else {
            // Insert Req Log
            db.query("INSERT INTO tab_api_log (dtable, log) VALUES(" + exportReq + ", 'rejected');");
            // End Req
            resolve('erro')
        }
    })
}

module.exports = router;