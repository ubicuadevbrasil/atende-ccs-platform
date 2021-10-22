module.exports = function () {

      const dbcc = require('./dbcc');
      const request = require('request');

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
            console.log(message);
      };

      this.getCustomUuid = function () {
            return new Promise(function (resolve, reject) {
                  dbcc.query("SELECT uuid() as UUID;", async function (err, result) {
                        if (err) { resolve(err) }
                        if (result.length > 0) { resolve(result[0].UUID) } else { resolve(null) }
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
                        console.log("Response Extension", body);
                        let response = body;
                        resolve(response)
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
                  dbcc.query(query, params, function (err, result) {
                        if (err) {
                              console.log(err)
                              reject(err)
                        }
                        resolve(result)
                  });
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
                        if (result.length == 0) {
                              dbcc.query("UPDATE tab_filain SET status=2 WHERE mobile=" + mobile);
                              let sessionid = await getCustomUuid();
                              dbcc.query("INSERT INTO tab_atendein (sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot, origem, sessionBotCcs, optAtendimento, optValue, name, mailInfo], function (err, result) {
                                    console.log(result)
                                    if (err) {
                                          console.log("Erro ao Encaminhar Usuário para Atendimento, Erro: " + err);
                                          console.log("Values: " + sessionid, mobile, dtin, account, photo, fkto, fkname, sessionBot, origem, sessionBotCcs)
                                    } else {
                                          dbcc.query("DELETE FROM tab_filain WHERE mobile=" + mobile);
                                          payload = { sessionid: sessionid, mobile: mobile, account: account, photo: photo, atendir: atendir };
                                          resolve(payload)
                                    }
                              });
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

      this.addAtivoMail = function (nome, rgm_aluno, cpf, celular, filename, quantidade) {
            return new Promise(function (resolve, reject) {
                  dbcc.query("SELECT COUNT(*) as resultCount FROM tab_ativo WHERE DATE(dtcadastro) = DATE(NOW());", [], function (err, result) {
                        if (err) { console.log(err) }
                        if (result[0].resultCount <= 500) {
                              dbcc.query("SELECT UUID() AS UUID;", [], function (err, result) {
                                    if (err) { console.log(err) }
                                    var id = result[0].UUID;
                                    dbcc.query("SELECT * FROM tab_ativo WHERE mobile='" + celular + "' and status = 0;", function (err, result) {
                                          if (err) { console.log(err) }
                                          if (result.length < 1) {
                                                dbcc.query("INSERT INTO tab_ativo (id, nome, rgm_aluno, cpf, mobile, filename, quantidade) VALUES (?,?,?,?,?,?,?);", [id, nome, rgm_aluno, cpf, celular, filename, quantidade], function (err, result) {
                                                      if (err) { console.log(err) }
                                                      dbcc.query("SELECT * FROM tab_ativo WHERE status=0", [], function (err, result) {
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
}

