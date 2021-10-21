#!/usr/bin/python3

import os
import sys
import time
import json
import psutil
import socketio
import syslog
import mysql.connector as mariadb
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from tzlocal import get_localzone

tz = get_localzone()
print(tz)
sched = BackgroundScheduler({'apscheduler.timezone': 'UTC'})

sio = socketio.Client()
start_timer = None
dbcc = None
cursor = None
curA = None
curB = None
curC = None
curD = None
curE = None
rtserver = None

# Methods SocketIO

@sio.on('connect')
def on_connect():
    print(str(datetime.now()) + " >> Conectado ao RT Ubicua Platform !")
    syslog.syslog(">> Conectado ao RT Ubicua Platform !")
    data = {}
    data['fkid'] = "2"
    data['fkname'] = "Sentinel RT Ubicua Platform v2 "
    sio.emit('add user', data)
    job_sentinel_newmessage.resume()

# Schedules

def sentinel_monitor():
    reportmsg = "**** Status Report ****\nMobile: 5511995518459 \nCPU: " + \
        str(psutil.cpu_percent()) + "% \nMemory: " + \
        str(psutil.virtual_memory().percent) + "% \nBattery: 100%"
    #sio.emit('sentinel_monitor', reportmsg)

def sentinel_waendpoint():
    sio.emit('sentinel_waendpoint')

def sentinel_clientsqueue():
    sio.emit('sentinel_clients_queue')

def selUuid():
    sql = "SELECT UUID();"
    cursor.execute(sql)
    uuid = cursor.fetchall()
    return uuid[0][0]

def sentinel_newmessages():
    try:
        job_sentinel_newmessage.pause()
        qryA = "SELECT id, uid, contact_uid, contact_name, message_uid, message_type, body_text, body_caption, body_url FROM db_cruzeiro_ccs.tab_waboxappin WHERE message_dir='i' AND status=0 AND contact_type = 'User' ORDER by dtin;"
        curA.execute(qryA)
        for rs in curA:
            # print("Teste Plataforma sucesso: " + str(rs[2]) + " - " + str(rs))
            _id = str(rs[0])
            _uid = str(rs[1])
            _mobile = str(rs[2])
            _name_before = str(rs[3])
            _name = _name_before.replace("'", "")
            _message_uid = str(rs[4])
            _message_type = str(rs[5])
            _body_text = str(rs[6])
            _body_caption = str(rs[7])
            _body_url = str(rs[8])
            # print("Teste Plataforma sucesso Passou")
            #print(str(datetime.now()) + " >> Verificando Se Mobile Está em Atendimento: " + _mobile)
            qryB = "SELECT sessionid, fkto, fkname, name FROM db_cruzeiro_ccs.tab_atendein WHERE mobile='" + _mobile + "' LIMIT 1;"
            curB.execute(qryB)
            if (curB.rowcount == 0):
                #print(str(datetime.now()) + " >> Mobile Não Esta em Atendimento, Verificando na Fila: " + _mobile)
                qryC = "SELECT * FROM db_cruzeiro_ccs.tab_filain WHERE mobile='" + _mobile + "'  LIMIT 1;"
                curC.execute(qryC)
                resultC = curC.fetchall()
                #print(str(resultC[0]))
                # print("Teste Plataforma sucesso Passou 2")
                if (curC.rowcount == 0):
                    print(str(datetime.now()) + " >> Mobile Não Encontrado, Inserir na Fila e Notificar o Usuário: " + _mobile)
                    qryD = "SELECT mobile FROM db_cruzeiro_ccs.tab_prior WHERE mobile='" + _mobile + "' LIMIT 1;"
                    curD.execute(qryD)
                    if (curD.rowcount == 1):
                        qryE = "INSERT INTO db_cruzeiro_ccs.tab_filain (mobile, account, status, sessionBotCcs) VALUES(" + _mobile + ", 'prior', '5', UUID());"
                        curE.execute(qryE)
                    else:
                        qryE = "INSERT INTO db_cruzeiro_ccs.tab_filain (mobile, status, sessionBotCcs) VALUES(" + _mobile + ", '5', UUID());"
                        print(qryE)
                        curE.execute(qryE)
                    # Enviando mensagem Welcome, se UID <> CHAT
                    if (_uid != "CHAT"):
                        payload = {}
                        payload["mobile"] = _mobile
                        payload["type"] = "chat"
                        sio.emit("send_welcome", payload)

                elif (resultC[0][5] == 5):
                    print(str(datetime.now()) + " >> Mobile em Atendimento com bot: " + _mobile)
                    if resultC[0][10] is not None:
                        if _message_type == "chat":
                            qryC = "INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, toname, msgdir, msgtype, msgtext) VALUES(%s, %s, %s, %s, %s, %s, %s)"
                            paramsC = (_id, str(resultC[0][10]), _mobile, "bot", "i", _message_type, _body_text)
                            curC.execute(qryC, paramsC)

                        else:
                            qryC = "INSERT INTO db_cruzeiro_ccs.tab_logs (id, sessionid, fromid, toname, msgdir, msgtype, msgurl, msgcaption) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
                            paramsC = (_id, str(resultC[0][10]), _mobile, "bot", "i", _message_type, _body_url, _body_caption)
                            curC.execute(qryC, paramsC)

                        qryC = "UPDATE db_cruzeiro_ccs.tab_waboxappin SET status=1 WHERE id='{}'".format(_id)
                        curC.execute(qryC)
                        botAnswer(_id, str(resultC[0][9]), str(resultC[0][7]), str(resultC[0][10]), str(resultC[0][4]), _mobile, _message_type, _body_text, _body_url, _body_caption)

            else:
                print(str(datetime.now()) + " >> Mobile em Atendimento, Dispara Mensagem para Atendente: " + _mobile)
                for inat in curB:
                    # print("Teste Plataforma: " + str(_mobile) + " - " + str(inat))
                    _sessionid = inat[0]
                    _fkto = inat[1]
                    _fkname = inat[2]
                    _namea = inat[3]
                payload = {}
                payload["id"] = _id
                payload["uid"] = _uid
                payload["contact_uid"] = _mobile
                payload["message_uid"] = _message_uid
                payload["message_type"] = _message_type
                payload["body_text"] = _body_text
                payload["body_caption"] = _body_caption
                payload["body_url"] = _body_url
                payload["sessionid"] = _sessionid
                payload["fkto"] = _fkto
                payload["fkname"] = _fkname
                payload["name"] = _namea
                sio.emit("sentinel_message_send", payload)

    except:
        syslog.syslog(">> Exception ERRO: " + str(sys.exc_info()))
        print(">> Exception: " + str(_mobile) + " - " + str(sys.exc_info()))
    finally:
        job_sentinel_newmessage.resume()

# Persistences

def persistence_dbcc():
    try:
        global dbcc
        dbcc = mariadb.connect(host='localhost', user='admin',password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        dbcc.autocommit = True
        global cursor
        cursor = dbcc.cursor(buffered=True)
        global curA
        curA = dbcc.cursor(buffered=True)
        global curB
        curB = dbcc.cursor(buffered=True)
        global curC
        curC = dbcc.cursor(buffered=True)
        global curD
        curD = dbcc.cursor(buffered=True)
        global curE
        curE = dbcc.cursor(buffered=True)
        print(str(datetime.now()) + " >> Conectado no Banco de Dados MariaDB/MySQL....")
        qry = "SELECT rtserver FROM db_cruzeiro_ccs.tab_config WHERE id=1;"
        cursor.execute(qry)
        for result in cursor:
            global rtserver
            rtserver = str(*result)
    except mariadb.Error as err:
        syslog.syslog(">> Erro ao Conectar no Banco de Dados MariaDB/MySQL, Erro: " + str(err))
        print(">> Erro ao Conectar no Banco de Dados MariaDB/MySQL, Erro: " + str(err))

def persistence_rt():
    try:
        sio.connect(str(rtserver))
        sio.wait()
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def botAnswer(id, origem, intent, sessionBotCcs, name, mobile, messagetype, bodytext, bodyurl, bodycaption):
    try:
        intents = {
            "welcome": ["Seja bem-vindo ao Canal Virtual da *Cruzeiro do Sul Educacional*! Informamos que nosso horário de atendimento é das 09h00 às 18h00 de segunda a sexta-feira.\n\nEste canal é *EXCLUSIVO* para atendimentos de *REMATRICULA* e *RETORNO AO CURSO (ex-aluno)*, para demais assuntos, por gentileza, acessar os canais oficiais de sua Instituição.\n\nAgora por favor, escolha o motivo do seu contato:\n\n1 - Retorno ao curso (ex-aluno)\n\n2 – Rematrícula"],
            "select-opt": ["Para agilizar nosso fluxo, informe o seu RGM ou CPF e o nome da sua Instituição"],
            "user-info": ["Um de nossos representantes entrará em contato em breve, fique atento!"],
            "opt-fallback": ["Você digitou uma opção inválida, por favor escolha uma das 2 opções informadas."],
            # "info-fallback": ["Desculpe não consegui processar suas informações, por favor informe novamente como o exemplo:\n*_Ex:RGM ou CPF"]
        }

        payload = {
            "id": id,
            "sessionBotCcs": sessionBotCcs,
            "name": name,
            "mobile": mobile,
            "origem": origem,
            "messagetype": messagetype,
        }

        error = False
        errorMsg = ''
        if intent == 'welcome':
            payload["response"] = intents['welcome']
            updateBotIntent(sessionBotCcs, 'select-opt')
            sio.emit("bot_answer", payload)

        elif intent in ['select-opt','select-opt-timeout']:
            if messagetype == "chat" and bodytext in ["1", "2"]:

                payload["response"] = intents['select-opt']
                sio.emit("bot_answer", payload)
                updateBotIntent(sessionBotCcs, 'user-info', bodytext)

            else:
                error = True
                errorMsg = intents['opt-fallback']

        elif intent in ['user-info','user-info-timeout']:
            if messagetype == "chat":
                try:
                    info = bodytext.split(',') 
                    userInfo = [x.strip() for x in info] #[NOME, RGM, CPF, INSTITUICAO]


                    payload["response"] = intents['user-info']
                    sio.emit("bot_answer", payload)
                    updateBotIntent(sessionBotCcs, 'atendimento', None, bodytext)
                    transbordoBot(sessionBotCcs, payload["mobile"])

                except Exception as ex:
                    print(">> Erro user-info intent")
                    print(ex)
                    error = True
                    errorMsg = intents['info-fallback']
            else:
                error = True
                errorMsg = intents['info-fallback']
            
        else:
            error = True

        if error:
            payload["response"] = errorMsg
            handleBotError(sessionBotCcs, intent, payload)

    except:
        print(">> botAnswer exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def updateBotIntent(sessionBotCcs, intent, selectOpt=None, optValue=None):
    try:
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        conn.autocommit = True
        cur = conn.cursor(buffered=True)

        if selectOpt != None:
            sql = "UPDATE db_cruzeiro_ccs.tab_filain SET intent = '{}', optAtendimento = '{}' WHERE sessionBotCcs = '{}';".format(str(intent), str(selectOpt), str(sessionBotCcs))
        elif optValue != None:
            sql = "UPDATE db_cruzeiro_ccs.tab_filain SET intent = '{}', optValue = '{}' WHERE sessionBotCcs = '{}';".format(str(intent), str(optValue), str(sessionBotCcs))
        else:
            sql = "UPDATE db_cruzeiro_ccs.tab_filain SET intent = '{}' WHERE sessionBotCcs = '{}';".format(str(intent), str(sessionBotCcs))

        cur.execute(sql)
        return "OK"

    except:
        print(">> updateBotIntent exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    
    finally:
        conn.close()

def transbordoBot(sessionBotCcs, mobile):
    try:
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        conn.autocommit = True
        cur = conn.cursor(buffered=True)
        sql = "SELECT mobile FROM db_cruzeiro_ccs.tab_prior WHERE mobile='" + mobile + "' LIMIT 1;"
        cur.execute(sql)
        if (cur.rowcount == 1):
            sql2 = "UPDATE db_cruzeiro_ccs.tab_filain SET status = 7 WHERE sessionBotCcs = '{}';".format(str(sessionBotCcs))
            cur.execute(sql2)

        else:
            sql3 = "UPDATE db_cruzeiro_ccs.tab_filain SET status = 1 WHERE sessionBotCcs = '{}';".format(str(sessionBotCcs))
            cur.execute(sql3)

        print('> Usuario removido do atendimento bot')
        return True

    except:
        print(">> transbordoBot exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    
    finally:
        conn.close()

def handleBotError(sessionBotCcs, intent, payload):
    try:
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        conn.autocommit = True
        cur = conn.cursor(buffered=True)
        sql = "SELECT error_count FROM db_cruzeiro_ccs.tab_filain WHERE sessionBotCcs = '{}';".format(str(sessionBotCcs))
        cur.execute(sql)
        error_count = cur.fetchall()
        if error_count[0][0] >= 2:
            updateBotIntent(sessionBotCcs, "transbordo-fallback", '3')
            transbordoBot(sessionBotCcs, payload["mobile"])

            payload["response"] = ["Um de nossos representantes irá lhe auxiliar, aguarde um momento."]
            sio.emit("bot_answer", payload)

        else:
            sql = "UPDATE db_cruzeiro_ccs.tab_filain SET error_count = (error_count + 1) WHERE sessionBotCcs = '{}';".format(str(sessionBotCcs))
            cursor.execute(sql)

            payload["response"] = ["Não entendi sua solicitação, poderia repetir?"]
            sio.emit("bot_answer", payload)

    except:
        print(">> handleBotError exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    
    finally:
        conn.close()

def timeout_filain():
    try:
        job_sentinel_timeout.pause()
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        cur = conn.cursor(buffered=True)
        sql = "SELECT mobile, sessionBotCcs, TIMESTAMPDIFF(MINUTE,dtin,NOW()) as tempo, origem, name, intent FROM db_cruzeiro_ccs.tab_filain where status = 5;"
        cur.execute(sql)
        timeDiff = cur.fetchall()

        for time in timeDiff:
            #print(time)
            _mobile = str(time[0])
            _sessionBotCcs = str(time[1])
            #print(_sessionBotCcs)
            if (_sessionBotCcs is not None) and (_sessionBotCcs != '') and (_sessionBotCcs != 'None'):
                _tempo = getDiffLogs(_sessionBotCcs, _mobile)
                _origem = str(time[3])
                _name = str(time[4])
                _intent = str(time[5])

                if (_tempo is None) or (_tempo == '') or (_tempo == 'None'):
                    _tempo = 0

                #print(_tempo, _intent)
                if(_tempo >= 120 and _intent == 'select-opt'):
                    payload = {
                        "mobile": _mobile,
                        "sessionid": _sessionBotCcs,
                        "timeout_response": "Olá! Percebi que no momento você está ocupado ou não deseja interagir, sendo assim, vamos finalizar o seu atendimento, mas estaremos aqui disponíveis quando mudar de ideia..."
                    }

                    removeFila(_sessionBotCcs)
                    sio.emit("timeout_bot", payload)
                
                elif (_tempo >= 120 and _intent == 'user-info'):
                    payload = {
                        "mobile": _mobile,
                        "sessionid": _sessionBotCcs,
                        "timeout_response": "Olá! Percebi que no momento você está ocupado ou não deseja interagir, sendo assim, vamos finalizar o seu atendimento, mas estaremos aqui disponíveis quando mudar de ideia..."
                    }

                    removeFila(_sessionBotCcs)
                    sio.emit("timeout_bot", payload)

    except:
        print(">> timeout_filain exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

    finally:
        conn.close()
        job_sentinel_timeout.resume()

def getDiffLogs(sessionid, mobile):
    try:
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        cur = conn.cursor(buffered=True)
        sql = 'SELECT TIMESTAMPDIFF(MINUTE,dt,NOW()) as tempo FROM tab_logs WHERE sessionid = %s AND fromid = %s ORDER BY dt DESC LIMIT 1'
        params = (str(sessionid), str(mobile))
        cur.execute(sql, params)
        timeDiff = cur.fetchall()
        if len(timeDiff) > 0:
            return timeDiff[0][0]
        else:
            return 0

    except Exception as ex:
        print(">> getDiffLogs exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    
    finally:
        conn.close()

def removeFila(sessionid):
    try:
        timeoutLog(sessionid)
        print('> Removendo usuario do atendimento bot')
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        conn.autocommit = True
        cur = conn.cursor(buffered=True)
        sql = "DELETE FROM db_cruzeiro_ccs.tab_filain WHERE sessionBotCcs = '{}'".format(str(sessionid))
        cur.execute(sql)
        print('> Usuario removido do atendimento bot')
        return True
    
    except:
        print(">> encerraBot exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

    finally:
        conn.close()

def timeoutLog(sessionid):
    try:
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        conn.autocommit = True
        cur = conn.cursor(buffered=True)
        sql = "SELECT * FROM db_cruzeiro_ccs.tab_filain where sessionBotCcs = '{}';".format(str(sessionid))
        cur.execute(sql)
        res = cur.fetchall()
        for row in res:
            ins = "INSERT INTO tab_timeoutlogs (sessionid, mobile, dtin, dtout, intent, optAtendimento, error_count, wpp) VALUES ('{}', '{}', '{}', NOW(), '{}', '{}', '{}', '{}');".format(str(sessionid),str(row[0]),row[1],str(row[7]),str(row[8]),str(row[9]),str(row[10]))
            cur.execute(ins)
    except:
        print(">> timeoutLog exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

    finally:
        conn.close()

def encerraBot(sessionid):
    try:
        conn = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_cruzeiro_ccs')
        conn.autocommit = True
        cur = conn.cursor(buffered=True)
        sql = "UPDATE db_cruzeiro_ccs.tab_filain SET status = '1' WHERE sessionBotCcs = '{}';".format(str(sessionid))
        cur.execute(sql)
        print('> Usuario removido do atendimento bot')
        return True

    except:
        print(">> encerraBot exception")
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    
    finally:
        conn.close()

# Scheduled Task e Started
#sched = BackgroundScheduler()
sched.start()

# Add Job Scheduled
job_sentinel_waendpoint = sched.add_job(sentinel_waendpoint, 'interval', seconds=5)
job_sentinel_clientsqueue = sched.add_job(sentinel_clientsqueue, 'interval', seconds=5)
job_sentinel_newmessage = sched.add_job(sentinel_newmessages, 'interval', seconds=5)
job_sentinel_timeout = sched.add_job(timeout_filain, 'interval', seconds=1)
#job_sentinel_monitor = sched.add_job(sentinel_monitor, 'interval', seconds=1800)

if __name__ == '__main__':
    try:
        syslog.syslog(">> Starting Sentinel Ubicua Platform...")
        job_sentinel_newmessage.pause()
        persistence_dbcc()
        persistence_rt()
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
