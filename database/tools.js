module.exports = function () {

	const dbcc = require('./dbcc');
	const request = require('request');
	const foreachasync = require('foreachasync').forEachAsync;

	let infraMobile = process.env.CCS_MOBILE.replace("@c.us", "");

	this.getTimestamp = function () {
		var date = new Date();
		var year = date.getFullYear();
		var month = ("0" + (date.getMonth() + 1)).substr(-2);
		var day = ("0" + date.getDate()).substr(-2);
		var hour = ("0" + date.getHours()).substr(-2);
		var minutes = ("0" + date.getMinutes()).substr(-2);
		var seconds = ("0" + date.getSeconds()).substr(-2);
		return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
	};

	this.log = function (desc, message) {
		console.log(getTimestamp() + ' >> ' + desc);
		// console.log(message);
	};

	this.getCustomUuid = function () {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT uuid() as UUID;", async function (err, result) {
				if (err) { resolve(err) }
				if (result.length > 0) { resolve(result[0].UUID) } else { resolve(null) }
			});
		})
	}

	this.getProtocol = function () {
		return new Promise(function (resolve, reject) {
			let myDate = new Date().toISOString()
			myDate = myDate.replace('-', '').replace('-', '').replace('T', '').replace(':', '').replace(':', '').replace(':', '').replace('.', '').replace('Z', '')

			resolve(myDate)
		})
	}

	this.getQueueProtocol = function (mobile) {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT * FROM tab_filain WHERE mobile = ?;", [mobile], async function (err, result) {
				if (err) { resolve(err) }
				if (result.length > 0) { resolve(result[0].protocolo) } else { resolve(null) }
			});
		})
	}

	this.loadBase64 = function (hashFile, fileType) {
		return new Promise(function (resolve, reject) {
			request.get({ url: process.env.CCS_CDN_BASE + hashFile }, function (err, httpResponse, body) {
				if (err) { console.log(err) }
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

	this.sendExtensionMessage = function (messageJson) {
		return new Promise(function (resolve, reject) {
			request.post({ url: process.env.CCS_EXTENSION, form: messageJson }, function (err, httpResponse, body) {
				console.log("Response Extension", httpResponse.statusCode);
				resolve(httpResponse.statusCode)
			});
		})
	}

	this.getAgents = function () {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT * FROM tab_usuarios WHERE status=1 ORDER BY nome", [], function (err, result) {
				if (result.length > 0) {
					if (err) { resolve(err) }
					let agents = JSON.stringify(result);
					resolve(agents)
				}
			});
		})
	}

	this.getStausEnc = function () {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT * FROM tab_statusen WHERE status=1 ORDER BY descricao", [], function (err, result) {
				if (result.length > 0) {
					let status = JSON.stringify(result);
					resolve(status)
				}
			});
		})
	}

	this.runDynamicQuery = function (query, params) {
		return new Promise(function (resolve, reject) {
			try {
				dbcc.query(query, params, function (err, result) {
					if (err) {
						console.log(err)
						reject(err)
					}
					resolve(result)
				});
			} catch (err) {
				console.log(err)
				reject(err)
			}
		})
	}

	this.generateSessionArr = function (params) {
		return new Promise(function (resolve, reject) {
			let sessionlist = "";
			for (i = 0; i < params.length; i++) {
				if (params.length - 1 == i) {
					sessionlist += "'" + params[i].sessionid + "'";
				} else {
					sessionlist += "'" + params[i].sessionid + "',";
				}
			}
			sessionlist += ","
			for (i = 0; i < params.length; i++) {
				if (params.length - 1 == i) {
					sessionlist += "'" + params[i].sessionBot + "'";
				} else {
					sessionlist += "'" + params[i].sessionBot + "',";
				}
			}
			sessionlist += ","
			for (i = 0; i < params.length; i++) {
				if (params.length - 1 == i) {
					sessionlist += "'" + params[i].sessionBotCcs + "'";
				} else {
					sessionlist += "'" + params[i].sessionBotCcs + "',";
				}
			}
			resolve(sessionlist)
		})
	}

	this.insertAtendein = function (mobile, dtin, account, photo, fkto, fkname, atendir, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo) {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT * FROM tab_atendein WHERE mobile=? LIMIT 1", [mobile], async function (err, result) {
				if (err) { console.log(err) }
				console.log(result.length);
				if (result.length == 0) {
					dbcc.query("UPDATE tab_filain SET status=2 WHERE mobile=" + mobile);
					let sessionid = await getCustomUuid();
					let protocol = await getQueueProtocol();
					if (!protocol) {
						protocol = await getProtocol();
					}
					dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo, protocolo, infraMobile) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo, protocol, infraMobile], function (err, result) {
						console.log(result)
						if (err) {
							console.log("Erro ao Encaminhar Usuário para Atendimento, Erro: " + err);
							console.log("Values: " + sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot, origem, sessionBotCcs)
						} else {
							dbcc.query("DELETE FROM tab_filain WHERE mobile=" + mobile);
							payload = { sessionid: sessionid, mobile: mobile, account: account, photo: photo, atendir: atendir, protocol: protocol };
							resolve(payload)
						}
					});
				} else {
					console.log('> Numero já se encontra em atendimento...');
					dbcc.query("UPDATE tab_filain SET status=2 WHERE mobile=" + mobile);
				}
			});
		})
	}

	this.getLoginsInfo = function (fkid, date) {
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

	this.addAtivoMail = function (nome, banco, cpf, celular, filename, quantidade) {
		return new Promise(function (resolve, reject) {
			dbcc.query("SELECT COUNT(*) as resultCount FROM tab_ativo WHERE DATE(dtcadastro) = DATE(NOW());", [], function (err, result) {
				console.log('Select Count');
				if (err) { console.log(err) }
				if (result[0].resultCount <= 500) {
					dbcc.query("SELECT UUID() AS UUID;", [], function (err, result) {
						console.log('Select UUID');
						if (err) { console.log(err) }
						var id = result[0].UUID;
						dbcc.query("SELECT * FROM tab_ativo WHERE mobile='" + celular + "' and status = 0;", function (err, result) {
							console.log('Select Ativo');
							if (err) { console.log(err) }
							if (result.length < 1) {
								console.log('Insert');
								dbcc.query("INSERT INTO tab_ativo (id, nome, mobile, cpf, banco, filename, quantidade) VALUES (?,?,?,?,?,?,?);", [id, nome, celular, cpf, banco, filename, quantidade], function (err, result) {
									if (err) { console.log(err) }
									dbcc.query("SELECT * FROM tab_ativo WHERE status=0", [], function (err, result) {
										console.log('Select one ativo');
										if (err) { console.log(err) }
										if (result.length > 0) {
											var ativo = JSON.stringify(result);
											resolve({ statusCode: '200', response: ativo })
										}
									});
								});
							}
						});
					});
				} else {
					resolve({ statusCode: '400', response: '' })
				}
			});
		})
	}

	this.insertQuestions = function (payload) {
		return new Promise(function (resolve, reject) {
			let fkid = payload.fkid;
			let questions = payload.questions;
			// Check Messages
			for (i = 0; i < questions.length; i++) {
				dbcc.query("INSERT INTO tab_questions (id, message) VALUES (?,?) ON DUPLICATE KEY UPDATE message=?", [questions[i].id, questions[i].message, questions[i].message], function (err, result) {
					if (err) { console.log(err) }
				})
			}
			// Select from questions
			let getFromQuestionsQuery = `SELECT * FROM tab_questions WHERE id LIKE "%${fkid}%" ORDER BY dataCadastro ASC`;
			let getFromQuestionsParams = [fkid];
			let getFromQuestionsList = runDynamicQuery(getFromQuestionsQuery, getFromQuestionsParams);
			resolve(getFromQuestionsList)
		})
	}

	this.checkFollow = function (mobile, io) {
		return new Promise(async function (resolve, reject) {
			try {
				log("checkFollow")
				let followQuery = "SELECT a.*, b.descricao FROM tab_encerrain AS a LEFT JOIN tab_statusen AS b ON a.`status` = b.`id`WHERE dten BETWEEN (CURRENT_TIMESTAMP() - INTERVAL 200 DAY) AND CURRENT_TIMESTAMP() AND (b.descricao LIKE '%FOLLOW%' OR a.`status` = 101) AND a.mobile = ? ORDER BY a.dten DESC LIMIT 1"
				let followParams = [mobile]
				let folllowList = await runDynamicQuery(followQuery, followParams);

				if (folllowList.length > 0) {
					let fkto = folllowList[0].fkto
					let fkname = folllowList[0].fkname

					for (var i in io.sockets.connected) {
						let fkid = io.sockets.connected[i].fkid;
						if (fkid === fkto) {
							let mobile = folllowList[0].mobile;
							let dtin = new Date() //folllowList[0].dtin;
							let account = folllowList[0].account;
							let photo = folllowList[0].photo;
							let atendir = folllowList[0].atendir;
							let sessionBot = folllowList[0].sessionBot;
							let origem = folllowList[0].origem;
							let sessionBotCcs = folllowList[0].sessionBotCcs;
							let optAtendimento = folllowList[0].optAtendimento;
							let optValue = folllowList[0].optValue;
							let name = folllowList[0].name;
							let mailInfo = "";
							// Inserto into Databse
							let atendimentoRes = await insertAtendein(mobile, dtin, account, photo, fkto, fkname, atendir, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo);
							resolve(true)
						}
					}

					resolve(false)

				} else {
					resolve(false)
				}
			} catch (err) {
				reject(err)
			}
		})
	}

	this.checkAtendemail = function (mobile, fkid) {
		return new Promise(async function (resolve, reject) {
			try {
				log("checkAtendemail")
				let followQuery = "SELECT a.*, b.descricao FROM tab_encerrain AS a LEFT JOIN tab_statusen AS b ON a.`status` = b.`id`WHERE dten BETWEEN (CURRENT_TIMESTAMP() - INTERVAL 200 DAY) AND CURRENT_TIMESTAMP() AND b.descricao LIKE '%FOLLOW%' AND a.mobile = ? ORDER BY a.dten DESC LIMIT 1"
				let followParams = [mobile]
				let folllowList = await runDynamicQuery(followQuery, followParams);

				if (folllowList.length > 0) {
					let fkto = folllowList[0].fkto

					console.log(fkid, fkto, mobile)
					if (fkid == fkto) {
						resolve(false)
					} else {
						resolve(true)
					}
				} else {
					resolve(false)
				}
			} catch (err) {
				reject(err)
			}
		})
	}

	this.getMoreBalanceInfo = async function (mobiles) {
		return new Promise(async function (resolve, reject) {
			try {
				console.log('>>>>', mobiles);
				for (let i = 0; i < mobiles.length; i++) {
					console.log('>>>> ', mobiles[i].infraMobile);
					let query = "SELECT COUNT(*) AS qtd  FROM tab_logs WHERE infraMobile LIKE ? AND msgdir = 'i' AND DATE(dt) = DATE(NOW());";
					let params = [`%${mobiles[i].infraMobile.replace("@c.us", "")}%`];
					let list = await runDynamicQuery(query, params);
					if (list.length > 0) {
						mobiles[i].msgIn = list[0].qtd
					}
					//
					let subQuery = "SELECT COUNT(*) AS qtd FROM tab_atendein WHERE infraMobile = ?;"
					let subParams = [mobiles[i].infraMobile.replace("@c.us", "")];
					let subList = await runDynamicQuery(subQuery, subParams);
					if (subList.length > 0) {
						mobiles[i].atendeIn = subList[0].qtd
					}
				}
				resolve(mobiles)
			} catch (err) {
				console.log(err)
				reject(err)
			}
		})
	}
}