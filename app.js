// Setup ENV
const dotenv = require('dotenv')
dotenv.config()

// Setup Chat Core Ubicua Cloud Platform
const express = require('express');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const bodyparser = require('body-parser');
const cors = require('cors');
const excel = require('exceljs');
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;
const foreachasync = require('foreachasync').forEachAsync;
const helmet = require('helmet');
const port = process.env.PORT || 443;

// Constantes
const cdn = process.env.CCS_CDN_FILE;
const _mobileUid = process.env.CCS_MOBILE

// Function Platforma Ubicua
require('./database/tools')();
const dbcc = require('./database/dbcc');

// Routers
const exportReqs = require('./routes/reports')
const ubcApi = require('./routes/api')

// Config App Express
const options = { key: fs.readFileSync(process.env.CCS_OPTIONSKEY), cert: fs.readFileSync(process.env.CCS_OPTIONSCERT) };
const app = express();
const server = require('https').createServer(options, app);
const io = require('socket.io').listen(server);

// Configure App Server
io.origins('*:*')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Routes
app.use('/exports/', exportReqs);
app.use('/api/', ubcApi);

app.get('/', function (req, res) {
	res.redirect('/atendente')
})

// Schedules
let socketParam;
const job_message = new CronJob('*/5 * * * * *', function () {
	sentinelNewmessages(socketParam)
	setTimeout(5000);
}, null, true, 'America/Los_Angeles');
job_message.start();

// Socket Events
io.on('connection', function (socket) {

	let numUsers = 0;
	let addedUser = false;
	socketParam = socket;

	//	SEND INFO FUNCTIONS

	socket.on('send_chat', async function (payload) {
		log("> Nova Mensagem Enviada", payload);
		let mobile = payload.mobile;
		// Search for client in tab_atendein
		let getAtendeQuery = "SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1";
		let getAtendeParams = [mobile];
		let getAtendeList = await runDynamicQuery(getAtendeQuery, getAtendeParams);
		if (getAtendeList.length > 0) {
			// Armazenando Log da Conversa
			let sessionid = getAtendeList[0].sessionid;
			let fromid = getAtendeList[0].fkto;
			let fromname = getAtendeList[0].fkname;
			let toid = getAtendeList[0].mobile;
			let toname = getAtendeList[0].name;
			let msgdir = "o";
			let msgtype = payload.type;
			let msgtext = payload.message;
			// Extension Message Json
			let messageJson = {
				infra: _mobileUid,
				id: mobile + '@c.us',
				msg: msgtext,
				media: 'chat'
			}
			let extResponse = await sendExtensionMessage(messageJson);
			// Record Message
			if (extResponse === 'ok') {
				// Insert message log
				let insertLogQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(UUID(), ?, ?, ?, ?, ?, ?, ?, ?)";
				let insertLogParams = [sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext];
				let insertLogInsert = await runDynamicQuery(insertLogQuery, insertLogParams);
			}
		}
	});

	socket.on('send_welcome', async function (payload) {
		log("Nova Mensagem Enviada Welcome", payload);
		let mobile = payload.mobile;
		let msgtext = "Olá, vai tomar no cú!";
		// Extension Message Json
		let messageJson = {
			infra: _mobileUid,
			id: mobile + '@c.us',
			msg: msgtext,
			media: 'chat'
		}
		let extResponse = await sendExtensionMessage(messageJson);
	});

	socket.on('send_media', async function (payload) {
		log("> Nova Media Enviada");
		// Ext message params
		let mobile = payload.mobile;
		let type = payload.type;
		let hashfile = payload.hashfile;
		let descfile = payload.descfile;
		// Database informations
		let customUuid = await getCustomUuid();
		let msgdir = "o";
		let msgtype = type;
		let msgurl = cdn + hashfile;
		let msgcaption = descfile;
		let messageJson = {};
		// Database additional information
		let getAtendeQuery = "SELECT * FROM tab_atendein WHERE mobile = ?;";
		let getAtendeParams = [mobile];
		let getAtendeList = await runDynamicQuery(getAtendeQuery, getAtendeParams);
		// Database new info
		let sessionid = getAtendeList[0].sessionid;
		let fromid = getAtendeList[0].fkto;
		let fromname = getAtendeList[0].fkname;
		let toid = getAtendeList[0].mobile;
		let toname = getAtendeList[0].name;
		// Create message JSON
		if (type != 'document' && type != 'video') {
			messageJson = {
				infra: _mobileUid,
				id: mobile + '@c.us',
				msg: '',
				media: type,
				image: await loadBase64(hashfile, type)
			}
		} else {
			messageJson = {
				infra: _mobileUid,
				id: mobile + '@c.us',
				msg: cdn + hashfile,
				media: 'chat',
			}
		}
		// Envia msg para EXT
		let extResponse = await sendExtensionMessage(messageJson);
		// Record Message
		if (extResponse === 'ok') {
			// Select from atendein
			let getAtendeBkpQuery = "SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1";
			let getAtendeBkpParams = [mobile];
			let getAtendeBkpList = await runDynamicQuery(getAtendeBkpQuery, getAtendeBkpParams);
			if (getAtendeBkpList.length > 0) {
				// Armazenando Log da Conversa
				let insertLogQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				let insertLogParams = [customUuid, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption];
				let insertLogInsert = await runDynamicQuery(insertLogQuery, insertLogParams);
			}
		}
	});

	socket.on('send_register', async function (payload) {
		log("> Send Register")
		let mobile = payload.mobile;
		let name = payload.name;
		// Update tab_atendein
		let sendRegisterQuery = "UPDATE tab_atendein SET name=? WHERE mobile=?";
		let sendRegisterParams = [name, mobile];
		let sendRegisterUpdate = await runDynamicQuery(sendRegisterQuery, sendRegisterParams);
		// Select from tab_atendein
		let getRegisterQuery = "SELECT sessionid, mobile, name, account, photo FROM tab_atendein WHERE mobile=? LIMIT 1";
		let getRegisterParams = [mobile];
		let getRegisterList = await runDynamicQuery(getRegisterQuery, getRegisterParams);
		if (getRegisterList.length > 0) {
			let sessionid = getRegisterList[0].sessionid;
			let mobile = getRegisterList[0].mobile;
			let name = getRegisterList[0].name;
			let account = getRegisterList[0].account;
			let photo = getRegisterList[0].photo;
			socket.emit('receive_register', { sessionid: sessionid, mobile: mobile, name: name, account: account, photo: photo });
		}
	});

	// AGENTS FUNCTIONS

	socket.on('bi-listagents', async function (payload) {
		log("> Listando Agentes...")
		let agentsList = await getAgents();
		socket.emit('bi-listagents', agentsList);
	});

	socket.on('bi-listblock', async function (payload) {
		log("> Litando Agentes Bloqueados...");
		let query = "SELECT * FROM tab_timeout WHERE data_desbloqueio IS NULL ORDER BY nome_atendente"
		let blockedAgentsList = await runDynamicQuery(query, [])
		if (blockedAgentsList.length > 0) {
			let agents = JSON.stringify(blockedAgentsList);
			socket.emit('bi-listblock', agents);
		}
	});

	socket.on('unblock_agent', async function (payload) {
		log("> Desbloqueando Agente");
		// Update tab_usuarios
		let unblockedUserQuery = "UPDATE tab_usuarios SET bloqueado = 'não' WHERE id = ?";
		let unblockedUserParams = [payload.fkid_atendente];
		let unblockedUserUpdate = await runDynamicQuery(unblockedUserQuery, unblockedUserParams);

		// Update tab_timeout
		let timeoutQuery = "UPDATE tab_timeout SET fkid_supervisor = ?, nome_supervisor = ?, motivo_desbloqueio = ?, data_desbloqueio = NOW() WHERE id = ?";
		let timeoutQueryParams = [payload.fkid_supervisor, payload.fkname_supervisor, payload.motivo, payload.id];
		let timeoutQueryUpdate = await runDynamicQuery(timeoutQuery, timeoutQueryParams);

		// Refresh Table
		let blockedAgentsQuery = "SELECT * FROM tab_timeout WHERE data_desbloqueio IS NULL ORDER BY nome_atendente"
		let blockedAgentsList = await runDynamicQuery(blockedAgentsQuery, [])
		if (blockedAgentsList.length > 0) {
			let agents = JSON.stringify(blockedAgentsList);
			socket.emit('bi-listblock', agents);
		} else {
			socket.emit('bi-listblock', JSON.stringify([]));
		}

	});

	socket.on('add_agent', async function (payload) {
		log("> Adicionando novo agente...");
		// Add new Agent
		let insertAgentQuery = "INSERT INTO tab_usuarios (id, perfil, nome, usuario, senha) VALUES(uuid(), ?, ?, ?, MD5(?))";
		let insertAgentParams = [payload.perfil, payload.nome, payload.usuario, payload.senha];
		let insertAgentUpdate = await runDynamicQuery(insertAgentQuery, insertAgentParams);
		// Listando Agentes
		let agentsList = await getAgents();
		socket.emit('bi-listagents', agentsList);
	});

	socket.on('upd_agent', async function (payload) {
		log("> Atualizando Agente...");
		// Update Agente
		if (payload.pwd == false) {
			let updateAgentQuery = "UPDATE tab_usuarios SET perfil=?, nome=?, usuario=? WHERE id=?";
			let updateAgentParams = [payload.perfil, payload.nome, payload.usuario, payload.id];
			let updateAgentUpdate = await runDynamicQuery(updateAgentQuery, updateAgentParams);
		} else {
			let updateAgentQuery = "UPDATE tab_usuarios SET senha=MD5(?) WHERE id=?";
			let updateAgentParams = [payload.senha, payload.id];
			let updateAgentUpdate = await runDynamicQuery(updateAgentQuery, updateAgentParams);
		}
		// Listando Agentes
		let agentsList = await getAgents();
		socket.emit('bi-listagents', agentsList);
	});

	socket.on('del_agent', async function (payload) {
		log("> Deletando Agente...");
		// Delete Agente
		let deleteAgentQuery = "UPDATE tab_usuarios SET status=0 WHERE id=?";
		let deleteAgentParams = [payload.id];
		let deleteAgentUpdate = await runDynamicQuery(deleteAgentQuery, deleteAgentParams);
		// Listando Agentes
		let agentsList = await getAgents();
		socket.emit('bi-listagents', agentsList);
	});

	// STATUS ENCERRAMENTOS

	socket.on('bi-liststa', async function (payload) {
		log("> Lista status encerramento");
		let statusList = await getStausEnc();
		socket.emit('bi-liststa', statusList);
	});

	socket.on('add_sta', async function (payload) {
		log("> Adiciona Status Encerramentos");
		// Insert Status Encerramento
		let insertStatusEncQuery = "INSERT INTO tab_statusen (descricao, pedido) VALUES(?, ?)";
		let insertStatusEncParams = [payload.descricao, payload.pedido];
		let insertStatusEncUpdate = await runDynamicQuery(insertStatusEncQuery, insertStatusEncParams);
		// Refresh Status Encerramentos
		let statusList = await getStausEnc();
		socket.emit('bi-liststa', statusList);
	});

	socket.on('upd_sta', async function (payload) {
		log("> Atualiza Status Encerramentos");
		// Update Status Encerramento
		let updateStatusEncQuery = "UPDATE tab_statusen SET descricao=?, pedido=? WHERE id=?";
		let updateStatusEncParams = [payload.descricao, payload.pedido, payload.id];
		let updateStatusEncUpdate = await runDynamicQuery(updateStatusEncQuery, updateStatusEncParams);
		// Refresh Status Encerramentos
		let statusList = await getStausEnc();
		socket.emit('bi-liststa', statusList);
	});

	socket.on('del_sta', async function (payload) {
		log("> Deleta Status Encerramentos");
		// Deleta Status Encerramento
		let deleteStatusEncQuery = "UPDATE tab_statusen SET status=0 WHERE id=?";
		let deleteStatusEncParams = [payload.id];
		let deleteStatusEncUpdate = await runDynamicQuery(deleteStatusEncQuery, deleteStatusEncParams);
		// Refresh Status Encerramentos
		let statusList = await getStausEnc();
		socket.emit('bi-liststa', statusList);
	});

	// BI-DIRECIONAL FUNCTIONS (CHAT)

	socket.on('bi-close_chat', async function (payload) {
		log('> Encerra atendimento');
		let mobile = payload.mobile;
		let status = payload.status;
		let cnpj = payload.cnpj;
		let protocolo = payload.protocolo;
		let banco = payload.banco;
		// Get from tab_atendein
		// Insert or Update
		let atendeinSelQuery = "SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1";
		let atendeinSelParams = [mobile];
		let atendeinSelList = await runDynamicQuery(atendeinSelQuery, atendeinSelParams);
		if (atendeinSelList.length > 0) {
			// Chat params
			let sessionid = atendeinSelList[0].sessionid;
			let mobile = atendeinSelList[0].mobile;
			let dtin = atendeinSelList[0].dtin;
			let dtat = atendeinSelList[0].dtat;
			let name = atendeinSelList[0].name;
			let account = atendeinSelList[0].account;
			let photo = atendeinSelList[0].photo;
			let fkto = atendeinSelList[0].fkto;
			let fkname = atendeinSelList[0].fkname;
			let transfer = atendeinSelList[0].transfer;
			let sessionBot = atendeinSelList[0].sessionBot
			let origem = atendeinSelList[0].origem
			let sessionBotCcs = atendeinSelList[0].sessionBotCcs
			let optAtendimento = atendeinSelList[0].optAtendimento
			let optValue = atendeinSelList[0].optValue
			let atendir = atendeinSelList[0].atendir
			// Insert into tab_encerrain
			let atendeinInsQuery = "INSERT INTO tab_encerrain (sessionid, mobile, dtin, dtat, name, account, photo, fkto, fkname, status, cnpj, atendir, transfer, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, protocolo, banco) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			let atendeinInsParams = [sessionid, mobile, dtin, dtat, name, account, photo, fkto, fkname, status, cnpj, atendir, transfer, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, protocolo, banco];
			let atendeinInsert = await runDynamicQuery(atendeinInsQuery, atendeinInsParams);
			// Delete into tab_encerrain
			let atendeinDelQuery = "DELETE FROM tab_atendein WHERE sessionid=?";
			let atendeinDelParams = [sessionid];
			let atendeinDelete = await runDynamicQuery(atendeinDelQuery, atendeinDelParams);
			// Update into tab_encerrain
			let atendeinUpdQuery = "UPDATE tab_logs SET stread = 1 WHERE fromid = '?' AND stread = 0;";
			let atendeinUpdParams = [mobile];
			let atendeinUpdate = await runDynamicQuery(atendeinUpdQuery, atendeinUpdParams);
			// Emit event
			socket.emit('bi-close_chat', { sessionid: sessionid, mobile: mobile });
		}
	});

	socket.on('bi-atendein', async function (payload) {
		log("> Buscando Atendimentos");
		// Select from atendimento
		let getFromAtendimentoQuery = "SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cpf, A.origem, A.sessionBot, A.sessionBotCcs FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile WHERE A.fkto=? GROUP BY mobile ORDER BY A.dtin";
		let getFromAtendimentoParams = [payload.fkid];
		let getFromAtendimentoList = await runDynamicQuery(getFromAtendimentoQuery, getFromAtendimentoParams);
		if (getFromAtendimentoList.length > 0) {
			let contacts = JSON.stringify(getFromAtendimentoList);
			let sessionlist = await generateSessionArr(getFromAtendimentoList);
			console.log(sessionlist);
			// Get History
			let getFromHistoryQuery = "SELECT sessionid, dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + sessionlist + ") ORDER BY dt;";
			let getFromHistoryParams = [];
			let getFromHistoryList = await runDynamicQuery(getFromHistoryQuery, getFromHistoryParams);
			var logs = JSON.stringify(getFromHistoryList);
			// Event emmit
			socket.emit('bi-atendein', { contacts: contacts, logs: logs });
		} else {
			socket.emit('bi-atendein', { contacts: [], logs: [] });
		}
	});

	socket.on('bi-questions', async function (payload) {
		log("> Buscando Respostas");
		// Select from atendimento
		let getFromQuestionsQuery = `SELECT * FROM tab_questions WHERE id LIKE "%${payload.fkid}%" ORDER BY dataCadastro ASC`;
		let getFromQuestionsParams = [payload.fkid];
		let getFromQuestionsList = await runDynamicQuery(getFromQuestionsQuery, getFromQuestionsParams);
		socket.emit('bi-questions', { questions: getFromQuestionsList });
	});

	socket.on('bi-answer_new_queue', async function (payload) {
		log('> Iniciando novo atendimento')
		let fkto = payload.fkid;
		let fkname = payload.fkname;
		// Select from fila
		let normalQueueQuery = "SELECT mobile, dtin, account, photo, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name FROM tab_filain WHERE status=1 ORDER BY dtin LIMIT 1";
		let normalQueueParams = [];
		let normalQueueList = await runDynamicQuery(normalQueueQuery, normalQueueParams);
		if (normalQueueList.length > 0) {
			// Get Mail Info
			let mailName, mailCpf, mailInfoCad;
			mailName = "";
			mailCpf = "";
			mailInfoCad = "";
			// Database information
			let mobile = normalQueueList[0].mobile;
			let dtin = normalQueueList[0].dtin;
			let account = normalQueueList[0].account;
			let photo = normalQueueList[0].photo;
			let atendir = normalQueueList[0].atendir;
			let sessionBot = normalQueueList[0].sessionBot;
			let origem = normalQueueList[0].origem;
			let sessionBotCcs = normalQueueList[0].sessionBotCcs;
			let optAtendimento = normalQueueList[0].optAtendimento;
			let optValue = normalQueueList[0].optValue;
			let name = normalQueueList[0].name;
			let mailInfo = mailInfoCad;
			// Inserto into Databse
			let atendimentoRes = await insertAtendein(mobile, dtin, account, photo, fkto, fkname, atendir, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo);
			socket.emit('bi-answer_new_queue', payload);
		}
	});

	socket.on('bi-answer_new_prior', async function (payload) {
		log("> Iniciando novo atendimento prioritario");
		let fkto = payload.fkid;
		let fkname = payload.fkname;
		// Select from fila
		let priorQueueQuery = "SELECT mobile, dtin, account, photo, sessionBot, origem, sessionBotCcs, optAtendimento, optValue FROM tab_filain WHERE status=7 ORDER BY dtin LIMIT 1;";
		let priorQueueParams = [];
		let priorQueueList = await runDynamicQuery(priorQueueQuery, priorQueueParams);
		if (priorQueueList.length > 0) {
			// Get Mail information
			let mailName, mailCpf, mailInfoCad;
			mailName = "";
			mailCpf = "";
			mailInfoCad = "";
			// Database information
			let mobile = priorQueueList[0].mobile;
			let dtin = priorQueueList[0].dtin;
			let account = priorQueueList[0].account;
			let photo = priorQueueList[0].photo;
			let atendir = priorQueueList[0].atendir;
			let sessionBot = priorQueueList[0].sessionBot;
			let origem = priorQueueList[0].origem;
			let sessionBotCcs = priorQueueList[0].sessionBotCcs;
			let optAtendimento = priorQueueList[0].optAtendimento;
			let optValue = priorQueueList[0].optValue;
			let name = mailName;
			let mailInfo = mailInfoCad;
			// Inserto into Databse
			let atendimentoRes = await insertAtendein(mobile, dtin, account, photo, fkto, fkname, atendir, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo);
			socket.emit('bi-answer_new_prior', payload);
		}
	});

	socket.on('bi-transferagent', async function (payload) {
		log('> Transferencia realizada');
		let mobile = payload.mobile;
		let transferId = payload.fkid;
		let transferName = payload.fkname;
		let message = payload.message;
		// Get Atendir from Mobile
		let atendirSelQuery = "SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1";
		let atendirSelParams = [mobile];
		let atendirSelList = await runDynamicQuery(atendirSelQuery, atendirSelParams);
		payload.atendir = atendirSelList[0].atendir
		// Verificar se  atendente está online e enviar a transferência de atendimento
		let fkOnline = false;
		for (var i in io.sockets.connected) {
			let fkid = io.sockets.connected[i].fkid;
			log(fkid, transferId);
			if (fkid === transferId) {
				socket.to(i).emit('bi-transferok', payload);
				fkOnline = true;
			}
		}
		// Inicia transferencia
		if (fkOnline == true) {
			// TransferenciaOk armazena Logs
			let atendeinSelQuery = "SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1";
			let atendeinSelParams = [mobile];
			let atendeinSelList = await runDynamicQuery(atendeinSelQuery, atendeinSelParams);
			if (atendeinSelList.length > 0) {
				// Armazenando Log da Conversa
				let sessionid = atendeinSelList[0].sessionid;
				let fromid = atendeinSelList[0].fkto;
				let fromname = atendeinSelList[0].fkname;
				let toid = atendeinSelList[0].mobile;
				let toname = atendeinSelList[0].name;
				let msgdir = "o";
				let msgtype = "transfer";
				let msgtext = message;
				let atendir = atendeinSelList[0].atendir;
				// Insert message log
				let atendeinInsQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(UUID(), ?, ?, ?, ?, ?, ?, ?, ?)";
				let atendeinInsParams = [sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext];
				let atendeinInsList = await runDynamicQuery(atendeinInsQuery, atendeinInsParams);
				// Update message log
				let atendeinUpdQuery = "UPDATE tab_atendein SET transfer=1, fkto=?, fkname=? WHERE mobile=?";
				let atendeinUpdParams = [transferId, transferName, mobile];
				let atendeinUpdList = await runDynamicQuery(atendeinUpdQuery, atendeinUpdParams);
				// Socket event emmit
				socket.emit('bi-transferagent', { mobile: mobile, fkid: transferId, fkname: transferName, status: 1, atendir: atendir });
			}
		} else {
			socket.emit('bi-transferagent', { mobile: mobile, fkid: transferId, fkname: transferName, status: 0 });
		}
	});

	socket.on('bi-transferok', async function (payload) {
		log('> Transferencia finalizada');
		// Buscar cliente em atendimento
		let atendeinSelQuery = "SELECT A.sessionid, A.mobile, A.account, A.photo, A.name, A.atendir, B.cpf, B.nome, A.origem FROM tab_atendein AS A LEFT JOIN tab_ativo AS B ON B.mobile = A.mobile WHERE A.mobile=? GROUP BY mobile ORDER BY A.dtin";
		let atendeinSelParams = [payload.mobile];
		let atendeinSelList = await runDynamicQuery(atendeinSelQuery, atendeinSelParams);
		if (atendeinSelList.length > 0) {
			let contacts = JSON.stringify(atendeinSelList);
			let sessionlist = "";
			// Prep session array
			for (i = 0; i < atendeinSelList.length; i++) {
				if (atendeinSelList.length - 1 == i) {
					sessionlist += "'" + atendeinSelList[i].sessionid + "'";
				} else {
					sessionlist += "'" + atendeinSelList[i].sessionid + "',";
				}
			}
			// Get logs from history
			let logsSelQuery = "SELECT sessionid, DATE_ADD(dt, INTERVAL 3 HOUR) as dt, msgdir, msgtype, msgtext, msgurl, msgcaption, fromname FROM tab_logs WHERE sessionid IN (" + sessionlist + ") ORDER BY dt;";
			let logsSelParams = [];
			let logsSelList = await runDynamicQuery(logsSelQuery, logsSelParams);
			let logs = JSON.stringify(logsSelList);
			// Socket event emmit
			socket.emit('bi-atendein', { contacts: contacts, logs: logs });
		} else {
			socket.emit('bi-atendein', { contacts: [], logs: [] });
		}
	});

	//	DATATABLES

	socket.on('bi-report1', async function (payload) {
		log("> Datatable Report1");
		let procedureQuery = 'CALL css_report("0","' + payload.transbordoDt + '","' + payload.params + '", "COUNT(*) as total");';
		let procedureParams = [];
		let procedureList = await runDynamicQuery(procedureQuery, procedureParams);
		if (procedureList.length > 0) {
			let count = procedureList[1][0].total;
			if (count == 0) {
				socket.emit('bi-report1', { count: 0, reportadata: '' });
			} else {
				let bkpProcedureQuery = 'CALL css_report("' + payload.limit + '","' + payload.transbordoDt + '","' + payload.params + '", "*");';
				let bkpProcedureParams = [];
				let bkpPocedureList = await runDynamicQuery(bkpProcedureQuery, bkpProcedureParams);
				if (bkpPocedureList.length > 0) {
					let reportdata = [];
					let lenchat = bkpPocedureList[1].length - 1;
					foreachasync(bkpPocedureList[1], function (element, index) {
						let serialized = {
							filename: element.filename,
							sessionid: element.sessionid,
							cpf: element.cpf,
							atendir: element.atendir,
							atendente: element.atendente,
							mobile: element.mobile,
							hora: element.hora,
							data: element.data,
							status: element.status,
							banco: element.banco,
							nome: element.nome,
							protocolo: element.protocolo
						};
						reportdata.push(serialized);
						if (lenchat == index) {
							socket.emit('bi-report1', { count: count, reportadata: reportdata });
						}
					})
				}
			}
		}
	});

	socket.on('bi-report2', async function (payload) {
		log("> Datatable Report2");
		let procedureQuery = 'CALL ccs_consulta("0","' + payload.transbordoDt + '","' + payload.params + '", "COUNT(*) as total");';
		let procedureParams = [];
		let procedureList = await runDynamicQuery(procedureQuery, procedureParams);
		if (procedureList.length > 0) {
			let count = procedureList[1][0].total;
			if (count == 0) {
				socket.emit('bi-report2', { count: 0, reportadata: '' });
			} else {
				let bkpProcedureQuery = 'CALL ccs_consulta("' + payload.limit + '","' + payload.transbordoDt + '","' + payload.params + '", "*");';
				let bkpProcedureParams = [];
				let bkpPocedureList = await runDynamicQuery(bkpProcedureQuery, bkpProcedureParams);
				if (bkpPocedureList.length > 0) {
					let reportdata = [];
					let lenchat = bkpPocedureList[1].length - 1;
					foreachasync(bkpPocedureList[1], function (element, index) {
						let serialized = {
							filename: element.filename,
							sessionid: element.sessionid,
							cpf: element.cpf,
							atendir: element.atendir,
							atendente: element.atendente,
							mobile: element.mobile,
							hora: element.hora,
							data: element.data,
							status: element.status,
							banco: element.banco,
							nome: element.nome,
							protocolo: element.protocolo
						};
						reportdata.push(serialized);
						if (lenchat == index) {
							socket.emit('bi-report2', { count: count, reportadata: reportdata });
						}
					})
				}
			}
		}
	});

	// EXCEL DOWNLOADS

	socket.on('bi-report1toxlsx', async function (payload) {
		log("> Report1 to XLSX");
		// Execute procedure
		let procedureQuery = 'CALL css_report_excel("MAX","' + payload.transbordoDt + '","' + payload.params + '", "*");';
		let procedureParams = [payload.mobile];
		let procedureList = await runDynamicQuery(procedureQuery, procedureParams);
		if (procedureList[1].length > 0) {
			// Create Worksheet
			let workbook = excel.Workbook;
			let wb = new workbook();
			let ws = wb.addWorksheet('report');
			let line = 2;
			let path = process.env.CCS_PATH;
			let namexlsx = "report" + Date.now() + ".xlsx";
			// Create excel header
			ws.getCell('A1').value = "Protocolo";
			ws.getCell('B1').value = "Telefone";
			ws.getCell('C1').value = "Nome do Cliente";
			ws.getCell('D1').value = "Nome do Atendente";
			ws.getCell('E1').value = "CPF";
			ws.getCell('F1').value = "Banco";
			ws.getCell('G1').value = "Canal";
			ws.getCell('H1').value = "In/Out";
			ws.getCell('I1').value = "Status";
			ws.getCell('J1').value = "Dt Atendimento";
			ws.getCell('K1').value = "Hr Atendimento";
			ws.getCell('L1').value = "Dt Ecerramento";
			ws.getCell('M1').value = "Hr Ecerramento";
			// Create excel rows
			foreachasync(procedureList[1], function (element, index) {
				ws.getCell('A' + line).value = element.protocolo;
				ws.getCell('B' + line).value = element.mobile;
				ws.getCell('C' + line).value = element.name;
				ws.getCell('D' + line).value = element.atendente;
				ws.getCell('E' + line).value = element.cpf;
				ws.getCell('F' + line).value = element.banco;
				ws.getCell('G' + line).value = element.origem;
				ws.getCell('H' + line).value = element.atendir;
				ws.getCell('I' + line).value = element.status;
				ws.getCell('J' + line).value = element.dtatende;
				ws.getCell('K' + line).value = element.hratende;
				ws.getCell('L' + line).value = element.dtencerra;
				ws.getCell('M' + line).value = element.hrencerra;
				line = line + 1;
			}).then(function () {
				try {
					wb.xlsx.writeFile(path + namexlsx).then(function () { });
				} catch (err) {
					log("> Error writing to file ", err);
				}
				var payload = { url: process.env.CCS_REPORT + namexlsx };
				socket.emit('bi-report1toxlsx', payload);
			});
		}
	});

	socket.on('bi-loginstoxlsx', async function (payload) {
		log("> Logins to XLSX");
		let procedureQuery = "SELECT fkid, fkname, date, DATE_FORMAT(DATE, '%d/%m/%Y %H:%m:%s') AS dateForm FROM tab_logins WHERE fkid != '2' " + payload + " GROUP BY fkid, DATE(DATE);";
		let procedureParams = [payload.mobile];
		let procedureList = await runDynamicQuery(procedureQuery, procedureParams);
		if (procedureList.length > 0) {
			// Create Worksheet
			let workbook = excel.Workbook;
			let wb = new workbook();
			let ws = wb.addWorksheet('report');
			let line = 2;
			let path = process.env.CCS_PATH;
			let namexlsx = "logins" + Date.now() + ".xlsx";
			ws.getCell('A1').value = "Id Operador";
			ws.getCell('B1').value = "Operador";
			ws.getCell('C1').value = "Data";
			ws.getCell('D1').value = "Login";
			ws.getCell('E1').value = "Logout";
			ws.getCell('F1').value = "Qtd Logouts";
			// Async
			foreachasync(procedureList, async function (element, index) {
				// Get more Info
				let minLogin, maxLogout, contLogout;
				let infoArr = await getLoginsInfo(element.fkid, element.date)
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
				ws.getCell('A' + line).value = element.fkid;
				ws.getCell('B' + line).value = element.fkname;
				ws.getCell('C' + line).value = element.dateForm;
				ws.getCell('D' + line).value = element.minLogin;
				ws.getCell('E' + line).value = element.maxLogout;
				ws.getCell('F' + line).value = element.contLogout;
				line = line + 1;
			}).then(function () {
				try {
					wb.xlsx.writeFile(path + namexlsx).then(function () { });
				} catch (err) {
					log("> Error writing to file ", err);
				}
				socket.emit('bi-loginstoxlsx', { url: process.env.CCS_REPORT + namexlsx });
			});
		}
	});

	socket.on('bi-blocktoxls', async function (payload) {
		log("> Blocks to XLSX");
		let procedureQuery = "SELECT * FROM tab_timeout WHERE data_bloqueio BETWEEN ? AND ? ORDER BY data_bloqueio DESC";
		let procedureParams = [payload.dt[0], payload.dt[1]];
		let procedureList = await runDynamicQuery(procedureQuery, procedureParams);
		if (procedureList.length > 0) {
			try {
				let columns = Object.keys(procedureList[0]).map((element) => {
					return { header: element, key: element, width: 10 }
				});
				let wb = new excel.Workbook;
				let ws = wb.addWorksheet('report');
				let path = process.env.CCS_PATH;
				let namexlsx = "bloqueios" + Date.now() + ".xlsx";
				ws.columns = columns;
				ws.addRows(procedureList)
				await wb.xlsx.writeFile(path + namexlsx);
				socket.emit('bi-blocktoxls', { url: process.env.CCS_REPORT + namexlsx });
			} catch (error) {
				console.log(error);
			}
		} else {
			socket.emit('bi-blocktoxls', { url: "" });
		}
	});

	// SENTINEL EVENTS

	socket.on('sentinel_clients_alive', function () {
		let payload = [];
		for (var i in io.sockets.connected) {
			payload.push({ fkname: io.sockets.connected[i].fkname, fkdt: io.sockets.connected[i].fkon, fkip: io.sockets.connected[i].fkip });
			socket.broadcast.emit('sentinel_clients_alive');
		}
		socket.broadcast.emit('sentinel_clients_alive');
	});

	socket.on('sentinel_message_send', async function (payload) {
		log('> Sentinel message');
		// Fix Payload
		payload = payload[0]
		console.log(payload);
		// Boolean for On/Off
		let fkonline = false;
		// Check for agents
		for (var i in io.sockets.connected) {
			let fkid = io.sockets.connected[i].fkid;
			// Send message to Agent
			if (fkid === payload.fkto || payload.fkto == "491b9564-2d79-11ea-978f-2e728ce88125") {
				// Agent param
				let id = payload.id;
				let sessionid = payload.sessionid;
				let fromid = payload.contact_uid;
				let fromname = payload.name;
				let toid = payload.fkto;
				let toname = payload.fkname;
				let msgdir = "i";
				let msgtype = payload.message_type;
				let msgtext = payload.body_text;
				let msgurl = payload.body_url;
				let msgcaption = payload.body_caption;
				// Insert message log
				if (payload.message_type == "chat") {
					let insertLogQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
					let insertLogParams = [id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext];
					let insertLogList = await runDynamicQuery(insertLogQuery, insertLogParams);
				} else {
					let insertLogQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
					let insertLogParams = [id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption];
					let insertLogList = await runDynamicQuery(insertLogQuery, insertLogParams);
				}
				// Emmit socket event
				socket.to(i).emit('receive_chat', payload);
				fkonline = true;
				// Update message
				if (fkonline != false) {
					let updateMsgQuery = "UPDATE tab_waboxappin SET status=1 WHERE id=?";
					let updateMsgParams = [payload.id];
					let updateMsgList = await runDynamicQuery(updateMsgQuery, updateMsgParams);
				}
			}
		}

	});

	socket.on('sentinel_clients_queue', async function (payload) {
		// Get fila info
		let vwFilaQuery = "SELECT * FROM vw_fila;";
		let vwFilaParams = [];
		let vwFilaList = await runDynamicQuery(vwFilaQuery, vwFilaParams);
		socket.broadcast.emit('sentinel_clients_queue', vwFilaList);
		// Get agents params
		let payload = [];
		for (var i in io.sockets.connected) {
			let row = {
				'socketid': i,
				'fkid': io.sockets.connected[i].fkid,
				'fkname': io.sockets.connected[i].fkname,
				'fkon': io.sockets.connected[i].fkon,
				'fkip': io.sockets.connected[i].fkip,
				'fkstatus': io.sockets.connected[i].fkstatus
			}
			payload.push(row);
		}
		socket.broadcast.emit('sentinel_clients_alive', JSON.stringify(payload));
		// Get agents info
		let vwAgentsQuery = "SELECT * FROM vw_fila;";
		let vwAgentsParams = [];
		let vwAgentsList = await runDynamicQuery(vwAgentsQuery, vwAgentsParams);
		if (vwAgentsList.length > 0) {
			socket.broadcast.emit('view_agents', JSON.stringify(vwAgentsList));
		}
	});

	// HISTORY EVENTS

	socket.on('bi-historyone', async function (payload) {
		log("> Buscando historico de atendimento")
		let contactsQuery = "SELECT sessionid, dtin, mobile, account, photo, sessionBot, sessionBotCcs FROM tab_encerrain WHERE sessionid=? ORDER BY dtin DESC LIMIT 1";
		let contactsParams = [payload.sessionid];
		let contactsList = await runDynamicQuery(contactsQuery, contactsParams);
		if (contactsList.length > 0) {
			let contacts = JSON.stringify(contactsList);
			let sessionlist = await generateSessionArr(contactsList);

			let logsQuery = "SELECT a.sessionid, DATE_ADD(a.dt, INTERVAL 3 HOUR) as dt, a.fromname, a.msgdir, a.msgtype, a.msgtext, a.msgurl, a.msgcaption FROM tab_logs AS a WHERE a.sessionid IN (" + sessionlist + ") ORDER BY a.dt;";
			let logsParams = [];
			let logsList = await runDynamicQuery(logsQuery, logsParams);
			if (logsList.length > 0) {
				let logs = JSON.stringify(logsList);
				socket.emit('bi-historyone', { contacts: contacts, logs: logs });
			} else {
				let bkpLogsQuery = "SELECT a.sessionid, DATE_ADD(a.dt, INTERVAL 3 HOUR) as dt, a.fromname, a.msgdir, a.msgtype, a.msgtext, a.msgurl, a.msgcaption FROM tab_logs_old AS a WHERE a.sessionid IN (" + sessionlist + ") ORDER BY a.dt;";
				let bkpLogsParams = [];
				let bkpLogsList = await runDynamicQuery(bkpLogsQuery, bkpLogsParams);
				let logs = JSON.stringify(bkpLogsList);
				socket.emit('bi-historyone', { contacts: contacts, logs: logs });
			}
		}
	});

	socket.on('bi-lasthistory', async function (payload) {
		log("> Busncao ultimo historico")
		let contactsQuery = "SELECT sessionid, dtin, mobile, account, photo, sessionBot, sessionBotCcs FROM tab_encerrain WHERE mobile=? AND dtin BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE() + INTERVAL 1 DAY ORDER BY dtin DESC";
		let contactsParams = [payload.mobile];
		let contactsList = await runDynamicQuery(contactsQuery, contactsParams);
		if (contactsList.length > 0) {
			let contacts = JSON.stringify(contactsList);
			let sessionlist = await generateSessionArr(contactsList);

			let logsQuery = "SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + sessionlist + ") ORDER BY dt;";
			let logsParams = [];
			let logsList = await runDynamicQuery(logsQuery, logsParams);
			if (logsList.length > 0) {
				let logs = JSON.stringify(logsList);
				socket.emit('bi-lasthistory', { contacts: contacts, logs: logs });
			} else {
				let bkpLogsQuery = "SELECT sessionid, dt, fromname, msgdir, msgtype, msgtext, msgurl, msgcaption FROM tab_logs WHERE sessionid IN (" + _sessionlist + ") ORDER BY dt;";
				let bkpLogsParams = [];
				let bkpLogsList = await runDynamicQuery(bkpLogsQuery, bkpLogsParams);
				let logs = JSON.stringify(bkpLogsList);
				socket.emit('bi-lasthistory', { contacts: contacts, logs: logs });
			}
		} else {
			socket.emit('bi-lasthistory', { contacts: [], logs: [] });
		}
	});

	//  ACTIVE FUNCTIONS

	socket.on('bi-getmailing', async function (payload) {
		log("> Get Active Mailing");
		let ativoQuery = "SELECT * FROM tab_ativo WHERE status=0 ORDER BY nome";
		let ativoParams = [];
		let ativoList = await runDynamicQuery(ativoQuery, ativoParams);
		if (ativoList.length > 0) {
			let mailing = JSON.stringify(ativoList);
			socket.emit('bi-getmailing', mailing);
		} else {
			socket.emit('bi-getmailing', '[]');
		}
	});

	socket.on('bi-mailativo', async function (payload) {
		log("> Get Active Mailing");
		let ativoQuery = "SELECT * FROM tab_ativo WHERE status=0 ORDER BY nome";
		let ativoParams = [];
		let ativoList = await runDynamicQuery(ativoQuery, ativoParams);
		if (ativoList.length > 0) {
			let mailing = JSON.stringify(ativoList);
			socket.emit('bi-mailativo', mailing);
		} else {
			socket.emit('bi-mailativo', '');
		}
	});

	socket.on('bi-atendemail', async function (payload) {
		log("> Answer Active Mailing");
		let fkto = payload.fkid;
		let fkname = payload.fkname;
		let mobile = payload.mobile;
		let atendir = 'out';
		let dtin = getTimestamp();
		let account = null;
		let photo = null;
		// Search for atendein
		let atendeinQuery = "SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1";
		let atendeinParams = [mobile];
		let atendeinList = await runDynamicQuery(atendeinQuery, atendeinParams);
		if (atendeinList.length == 0) {
			let sessionid = await getCustomUuid();
			// Insert atendein
			let insertAtdQuery = "INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname, atendir) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
			let insertAtdParams = [sessionid, mobile, dtin, account, photo, fkto, fkname, atendir];
			let insertAtdList = await runDynamicQuery(insertAtdQuery, insertAtdParams);
			// Update Mailing
			let updateAtdQuery = "UPDATE tab_ativo SET status=1 WHERE mobile = ?";
			let updateAtdParams = [mobile];
			let updateAtdList = await runDynamicQuery(updateAtdQuery, updateAtdParams);
			// Socket Event Emmit
			socket.emit('bi-atendemail', { status: '200' });
		} else {
			socket.emit('bi-atendemail', { status: '400' });
		}
	});

	socket.on('bi-addativo', async function (payload) {
		log("> Get Add Active Mailing");
		console.log(payload);
		for (i = 0; i < payload.length; i++) {
			let nome = payload[i].nome;
			let banco = payload[i].banco;
			let cpf = payload[i].cpf;
			let celular = payload[i].telefone;
			let filename = payload[i].filename;
			let quantidade = payload[i].quantidade;
			// Fix Cellphone number
			if (celular != "" && celular != null) {
				celular = celular.replace(/[^\w\s]/gi, '')
				celular = celular.replace(/\D/g, '');
				if (celular.length < 13) { celular = "55" + celular }
				if (celular != "" && celular != null && celular.length >= 9) {
					let ativoMailRes = await addAtivoMail(nome, banco, cpf, celular, filename, quantidade)
					if (ativoMailRes.statusCode == '200') {
						socket.emit('bi-addativo', ativoMailRes.response)
					} else {
						socket.emit('maillimite', 'MAX')
					}
				}
			}
		}
	});

	socket.on('bi-callinput', async function (payload) {
		log("> Call Input");
		let fkto = payload.fkid;
		let fkname = payload.fkname;
		let mobile = payload.mobile;
		let atendir = 'out';
		let dtin = getTimestamp();
		// Select from fila
		let filaQuery = "SELECT * FROM tab_filain WHERE mobile=? LIMIT 1";
		let filaParams = [mobile];
		let filaList = await runDynamicQuery(filaQuery, filaParams);
		if (filaList.length == 0) {
			let atendeQuery = "SELECT * FROM tab_filain WHERE mobile=? LIMIT 1";
			let atendeParams = [mobile];
			let atendeList = await runDynamicQuery(atendeQuery, atendeParams);
			if (atendeList.length == 0) {
				// Insert into atendein
				let atendeQuery = "INSERT INTO tab_atendein (sessionid, mobile, dtin, fkto, fkname, atendir) VALUES(UUID(), ?, ?, ?, ?, ?)";
				let atendeParams = [mobile, dtin, fkto, fkname, atendir];
				let atendeList = await runDynamicQuery(atendeQuery, atendeParams);
				socket.emit('bi-callinput', { status: '200' });
			} else {
				socket.emit('bi-callinput', { status: '400' });
			}
		} else {
			socket.emit('bi-callinput', { status: '400' });
		}
	});

	// AUTH FUNCTIONS

	socket.on('bi-auth', async function (payload) {
		log("Novo Login de Usuário", payload);
		let fkname = payload.fkname;
		let fkpass = payload.fkpass;
		let key = payload.key;
		let app = payload.app;
		if (key == "a02c7f8c8bf9635037eb5653302f8b84") {
			let usersQuery = "SELECT * FROM tab_usuarios WHERE usuario=? LIMIT 1";
			let usersParams = [fkname];
			let usersList = await runDynamicQuery(usersQuery, usersParams);
			if (usersList.length > 0) {
				// If app version == 3
				if (app == 3) {
					// If Senha correta ou não
					if (md5(fkpass) == usersList[0].senha) {
						// If usuario bloqueada
						if (usersList[0].bloqueado == "sim") {
							socket.emit('bi-auth', { response: 9 });
							// If usuario ativo
						} else if (usersList[0].status == 1) {
							socket.emit('bi-auth', { response: 1, id: usersList[0].id, nome: usersList[0].nome, tema: usersList[0].tema, avatar: usersList[0].avatar })
						} else { socket.emit('bi-auth', { response: 2 }) }
					} else { socket.emit('bi-auth', { response: 3 }) }
					// If app version == 2
				} else if (app == 2) {
					if (app == usersList[0].perfil) {
						// If Senha correta ou não
						if (md5(fkpass) == usersList[0].senha) {
							// If usuario ativo
							if (usersList[0].status == 1) {
								socket.emit('bi-auth', { response: 1, id: usersList[0].id, nome: usersList[0].nome, tema: usersList[0].tema, avatar: usersList[0].avatar });
							} else { socket.emit('bi-auth', { response: 2 }) }
						} else { socket.emit('bi-auth', { response: 3 }) }
					} else { socket.emit('bi-auth', { response: 5 }) }
				} else { socket.emit('bi-auth', { response: 5 }) }
			} else { socket.emit('bi-auth', { response: 4 }) }
		} else {
			socket.emit('bi-auth', { response: -1 })
		}
	});

	socket.on('force_disconnect', async function (payload) {
		log("> Force Disconnect")
		socket.to(payload.socketid).emit('force_disconnect');
	});

	socket.on('disconnect', async function () {
		log("> Disconnect")
		if (addedUser) {
			// Logout User
			--numUsers;
			// Insert Log Reg
			let insertLogQuery = "INSERT INTO tab_logins (id,fkid,fkname,status) VALUES (UUID(), ?, ?, ?)";
			let insertLogParams = [socket.fkid, socket.fkname, 'logout'];
			let insertLog = await runDynamicQuery(insertLogQuery, insertLogParams);
			// Disconnect User
			socket.disconnect();
		}
	});

	socket.on('add user', async function (payload) {
		log("> User login");
		if (addedUser) return;
		// Socket params
		socket.fkid = payload.fkid;
		socket.fkname = payload.fkname;
		socket.fkon = socket.handshake.time;
		socket.fkip = socket.handshake.address;
		socket.fkstatus = 'Online';
		// Login User
		++numUsers;
		// Insert Log Reg
		let insertLogQuery = "INSERT INTO tab_logins (id,fkid,fkname,status) VALUES (UUID(), ?, ?, ?)";
		let insertLogParams = [socket.fkid, socket.fkname, 'login'];
		let insertLog = await runDynamicQuery(insertLogQuery, insertLogParams);
		// Change addedUSer Var
		addedUser = true;
		// Socket event Emmit
		socket.emit('login', { numUsers: numUsers });
		socket.broadcast.emit('user joined', { fkname: payload.fkname, numUsers: numUsers });
	});

	socket.on('bi-usertimeout', async function (payload) {
		log("> User timeout");
		let updateUserQuery = "UPDATE tab_usuarios SET bloqueado = 'sim' WHERE id = ?";
		let updateUserParams = [payload.fkid];
		let updateUser = await runDynamicQuery(updateUserQuery, updateUserParams);
		// Insert timeout
		let insertTimeoutQuery = "INSERT INTO tab_timeout(id,fkid_atendente,nome_atendente) VALUES(UUID(),?,?)";
		let insertTimeoutParams = [payload.fkid, payload.fkname];
		let insertTimeout = await runDynamicQuery(insertTimeoutQuery, insertTimeoutParams);
		for (var i in io.sockets.connected) {
			var fkid = io.sockets.connected[i].fkid;
			if (fkid === payload.fkid) {
				io.sockets.connected[i].emit('bi-usertimeout')
			}
		}
	});

	// FIND CLIENTS

	socket.on('get_cliInfo', async function (payload) {
		log("> Get cliente info")
		let getClientQuery = "SELECT NAME,cnpj FROM tab_atendein WHERE mobile = ?";
		let getClientParams = [payload.mobile];
		let getClient = await runDynamicQuery(getClientQuery, getClientParams);
		if (getClient.length > 0) {
			socket.emit('get_cliInfo', { nome: getClient[0].NAME, cpf: getClient[0].cnpj });
		}
	});

	socket.on('bi-find_register', async function (payload) {
		log("> Find cliente register")
		let getClientQuery = "SELECT sessionid, mobile, name, account, photo FROM tab_atendein WHERE mobile=? LIMIT 1";
		let getClientParams = [payload.mobile];
		let getClientList = await runDynamicQuery(getClientQuery, getClientParams);
		if (getClientList.length > 0) {
			let sessionid = getClientList[0].sessionid;
			let mobile = getClientList[0].mobile;
			let name = getClientList[0].name;
			let account = getClientList[0].account;
			let photo = getClientList[0].photo;
			socket.emit('bi-find_register', { sessionid: sessionid, mobile: mobile, name: name, account: account, photo: photo });
		}
	});

	socket.on('upd_cliInfo', async function (payload) {
		log("> Get cliente info")
		let updClientQuery = "UPDATE tab_atendein SET name = ?, cnpj = ? WHERE mobile = ?;";
		let updClientParams = [payload.name, payload.cpf, payload.mobile];
		let updClient = await runDynamicQuery(updClientQuery, updClientParams);
	});

	// TRAINING FUNCTIONS

	socket.on('bi-training', async function () {
		log("> Get training message");
		let getTreinamentoQuery = 'SELECT training from tab_treinamento where id="c102ba05-422c-11ea-8db1-000c290cc03d"';
		let getTreinamentoParams = [];
		let getTreinamento = await runDynamicQuery(getTreinamentoQuery, getTreinamentoParams);
		socket.emit('bi-training', getTreinamento);
	});

	socket.on('upd_training', async function (payload) {
		log("> Update training message");
		let updTreinamentoQuery = 'UPDATE tab_treinamento SET training=? where id="c102ba05-422c-11ea-8db1-000c290cc03d"';
		let updTreinamentoParams = [payload.bool.toString()];
		let updTreinamento = await runDynamicQuery(updTreinamentoQuery, updTreinamentoParams);
	})

	// RENDER STATUS ENC

	socket.on('bi-statusen', async function () {
		log("> Get status enc");
		let getStatusenQuery = 'SELECT * FROM tab_statusen WHERE status=1';
		let getStatusenParams = [];
		let getStatusenList = await runDynamicQuery(getStatusenQuery, getStatusenParams);
		socket.emit('bi-statusen', JSON.stringify(getStatusenList));
	});

	// QUESTION EVENTS

	socket.on('ins-questions', async function (payload) {
		log("> Inserindo Respostas");
		// Insert Questions
		let newQuestions = await insertQuestions(payload);
		socket.emit('bi-questions', { questions: newQuestions });
	});

	// AVATAR EVENT
	socket.on('upd_training', async function (payload) {
		log("> Update training message");
		let updAvatarQuery = 'UPDATE tab_usuarios SET avatar=? where id=?';
		let updAvatarParams = [payload.avatar, payload.fkid];
		let updAvatar = await runDynamicQuery(updAvatarQuery, updAvatarParams);
	})

	// AVATAR EVENT
	socket.on('upd_theme', async function (payload) {
		log("> Update training message");
		let updTemaQuery = 'UPDATE tab_usuarios SET tema=? where id=?';
		let updTemaParams = [payload.tema, payload.fkid];
		let updTema = await runDynamicQuery(updTemaQuery, updTemaParams);
	})
	
	// SCHEDULE CCS FILA
	
	const job = schedule.scheduleJob('*/5 * * * * *', async function () {
		// Get fila info
		let vwFilaQuery = "SELECT * FROM vw_fila;";
		let vwFilaParams = [];
		let vwFilaList = await runDynamicQuery(vwFilaQuery, vwFilaParams);
		socket.broadcast.emit('sentinel_clients_queue', vwFilaList);
		// Get agents params
		let payload = [];
		for (var i in io.sockets.connected) {
			let row = {
				'socketid': i,
				'fkid': io.sockets.connected[i].fkid,
				'fkname': io.sockets.connected[i].fkname,
				'fkon': io.sockets.connected[i].fkon,
				'fkip': io.sockets.connected[i].fkip,
				'fkstatus': io.sockets.connected[i].fkstatus
			}
			payload.push(row);
		}
		socket.broadcast.emit('sentinel_clients_alive', JSON.stringify(payload));
		// Get agents info
		let vwAgentsQuery = "SELECT * FROM vw_fila;";
		let vwAgentsParams = [];
		let vwAgentsList = await runDynamicQuery(vwAgentsQuery, vwAgentsParams);
		if (vwAgentsList.length > 0) {
			socket.broadcast.emit('view_agents', JSON.stringify(vwAgentsList));
		}
	});

});

// Sentinel Sub's
function sentinelNewmessages(socket) {
	return new Promise(async function (resolve, reject) {
		log('sentinelNewmessages');
		let queryA = "SELECT id, uid, contact_uid, contact_name, message_uid, message_type, body_text, body_caption, body_url FROM tab_waboxappin WHERE message_dir='i' AND status=0 AND contact_type = 'User' ORDER by dtin;";
		let paramsA = [];
		let messagesList = await runDynamicQuery(queryA, paramsA);
		if (messagesList.length > 0) {
			foreachasync(messagesList, async function (element, index) {
				message_id = element.id;
				message_uid = element.uid;
				message_mobile = element.contact_uid;
				message_name_before = element.contact_name;
				message_name = element.contact_name.replace("'", "");
				message_message_uid = element.message_uid;
				message_message_type = element.message_type;
				message_body_text = element.body_text;
				message_body_caption = element.body_caption;
				message_body_url = element.body_url;
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
					// Fix Payload
					payload = payload[0]
					// Boolean for On/Off
					let fkonline = false;
					// Check for agents
					for (var i in io.sockets.connected) {
						let fkid = io.sockets.connected[i].fkid;
						// Send message to Agent
						if (fkid === payload.fkto || payload.fkto == "491b9564-2d79-11ea-978f-2e728ce88125") {
							// Agent param
							let id = payload.id;
							let sessionid = payload.sessionid;
							let fromid = payload.contact_uid;
							let fromname = payload.name;
							let toid = payload.fkto;
							let toname = payload.fkname;
							let msgdir = "i";
							let msgtype = payload.message_type;
							let msgtext = payload.body_text;
							let msgurl = payload.body_url;
							let msgcaption = payload.body_caption;
							let findMessageQuery = "SELECT * FROM tab_logs WHERE id = ?";
							let findMessageParams = [id];
							let findMessageList = await runDynamicQuery(findMessageQuery, findMessageParams);
							if (findMessageList.length < 1) {
								// Insert message log
								if (payload.message_type == "chat") {
									let insertLogQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
									let insertLogParams = [id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext];
									let insertLogList = await runDynamicQuery(insertLogQuery, insertLogParams);
								} else {
									let insertLogQuery = "INSERT INTO tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
									let insertLogParams = [id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgurl, msgcaption];
									let insertLogList = await runDynamicQuery(insertLogQuery, insertLogParams);
								}
								console.log('Emit Messages');
								// Emmit socket event
								io.emit('receive_chat', payload);
								fkonline = true;
								// Update message
								if (fkonline != false) {
									let updateMsgQuery = "UPDATE tab_waboxappin SET status=1 WHERE id=?";
									let updateMsgParams = [payload.id];
									let updateMsgList = await runDynamicQuery(updateMsgQuery, updateMsgParams);
								}
							} else {
								log("> Mensagem já cadastrada")
							}
						}
					}
				} else {
					let queryC = "SELECT * FROM tab_filain WHERE mobile=?  LIMIT 1;"
					let paramsC = [message_mobile]
					let filaList = await runDynamicQuery(queryC, paramsC);
					if (filaList.length == 0) {
						let queryD = "SELECT mobile FROM tab_prior WHERE mobile=? LIMIT 1;"
						let paramsD = [message_mobile]
						let priorList = await runDynamicQuery(queryD, paramsD);
						if (priorList.length == 1) {
							let queryInsert = "INSERT INTO tab_filain (mobile, account, status, sessionBotCcs) VALUES(?, 'prior', '1', UUID());"
							let paramsInsert = [message_mobile]
							let insert = await runDynamicQuery(queryInsert, paramsInsert);
							// Log send welcome message
							let msgtext = "Olá, tudo bem? Bem-vindo a Central de Vendas do Agibank! Temos a melhor solução de crédito para o seu momento.\n\nPara agilizar o seu atendimento responda com o nº da opção desejada. \n\n1 - 💳 Cartão de Crédito \n\n2 - 💵 Portabilidade\n\n3 - 💰 Crédito Consignado\n\n4- 📋 Consultar Contratos ";
							// Extension Message Json
							let messageJson = {
								infra: "5511910893842@c.us",
								id: message_mobile + '@c.us',
								msg: msgtext,
								media: 'chat'
							}
							let extResponse = await sendExtensionMessage(messageJson);
						} else {
							let queryInsert = "INSERT INTO tab_filain (mobile, status, sessionBotCcs) VALUES(?, '1', UUID());"
							let paramsInsert = [message_mobile]
							let insert = await runDynamicQuery(queryInsert, paramsInsert);
							// Log send welcome message
							let msgtext = "Olá, tudo bem? Bem-vindo a Central de Vendas do Agibank! Temos a melhor solução de crédito para o seu momento.\n\nPara agilizar o seu atendimento responda com o nº da opção desejada. \n\n1 - 💳 Cartão de Crédito \n\n2 - 💵 Portabilidade\n\n3 - 💰 Crédito Consignado\n\n4- 📋 Consultar Contratos ";
							// Extension Message Json
							let messageJson = {
								infra: "5511910893842@c.us",
								id: message_mobile + '@c.us',
								msg: msgtext,
								media: 'chat'
							}
							let extResponse = await sendExtensionMessage(messageJson);
						}
					}
				}
			})
		}
		resolve('finished')
	})
}

server.listen(port, function () {
	log('Chat Core - Ubicua Cloud Platform - Listening at Port ' + port);
});

process.on('uncaughtException', function (err) {
	return
});