import os
import sys
import time
import json
import psutil
import socketio
import syslog
import requests
import mysql.connector as mariadb
from time import sleep
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from requests.auth import HTTPBasicAuth

sio = socketio.Client()

@sio.on('connect')
def onConnection():
    print("> Conectado ao RT Ubicua Platform !")
    syslog.syslog(">> Conectado ao RT Ubicua Platform !")
    data = {}
    data['fkid']   = "3"
    data['fkname'] = "Bastion RT Ubicua Platform v2 "
    sio.emit('add user', data)

def persistenceDbcc():
    try:
        dbcc = mariadb.connect(host='localhost', user='chatcore', password='1sl@nd!', database='db_sanofi_ccs')
        dbcc.autocommit = True
        cursor = dbcc.cursor()
        print("> Conectado no Banco de Dados MariaDB/MySQL....")
        return [dbcc,cursor]
    except mariadb.Error as err:
        print("> Erro ao Conectar no Banco de Dados MariaDB/MySQL, Erro: "  + str(err))

def staticMessage(session,message,mobile):
    try:
        print(str(session))
        print(str(message))
        print(str(mobile))
        url = "https://ubicuacloud.appspot.com/api/intent/detect/{}/".format(session)
        token = login()
        hed = {'Authorization': 'Bearer ' + token}
        payload = {"query_input": {"text": str(message)}}

        print('> Payload a ser enviado ATOS: ' + str(payload))
        print('> Url para enviar o payload: ' + str(url))

        r = requests.post(url, json=payload, headers=hed)

        if(r.status_code == 200):
            response = r.json()
            fallback = r.json()
            print('> Resposta Completa:')
            response = response['response_messages']
            fallback = fallback['fallback_counters']

            if(fallback >= 2):
                endBot(str(session),str(mobile))
                return response
            else:
                return response

        else:
            endBot(str(session),str(mobile))
            return 'null'


    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def selUuid():
    sql = "SELECT UUID();"
    cursor.execute(sql)
    uuid = cursor.fetchall()
    return uuid[0][0]

def insertLog(session,mobile,message):
    try:
        sql = "INSERT INTO db_sanofi_ccs.tab_logs (id, sessionid, fromid, fromname, toid, toname, msgdir, msgtype, msgtext) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        params = (selUuid(), session, '491b9564-2d79-11ea-978f-2e728ce88125', 'Bot', mobile, '', 'o', 'chat', message)
        cursor.execute(sql,params)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def sendMessage(mobile,message):
    try:
        url = "https://extensao.ubicuacloud.com.br/client"
        payload = {'infra': '5511969009126@c.us', 'id': str(mobile) + '@c.us', 'msg': str(message), 'media': 'chat'}

        r = requests.post(url, json=payload)
        
        print(r)

    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def endBot(session,mobile):
    try:
        sql = "UPDATE tab_filain SET status = 1 WHERE mobile = '{}';".format(str(mobile))
        cursor.execute(sql)
        print('> Usuario removido do atendimento bot')
        endTransbordo(session)
        print('> Mensagem de Bem Vindo enviada')
        sendWelcome(mobile,session)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def encerraBot(session,mobile):
    try:
        sql = "DELETE FROM db_sanofi_ccs.tab_filain WHERE mobile = '{}';".format(str(mobile))
        cursor.execute(sql)
        print('> Usuario removido do atendimento bot')
        encerraTransbordo(session)
        print('> Mensagem de TimeOut enviada')
        sendTimeout(mobile,session)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def login():
    try:
        url = "https://ubicuacloud.appspot.com/api/login/"
        payload = { "user_name": "ubicua", "password": "senha$00" }

        r = requests.post(url, json=payload)
        
        token = r.json()
        
        return token['token']
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def insertTransbordo(session, mobile):
    try:
        sql = "SELECT * FROM db_sanofi_ccs.tab_transbordo where sessionBot = '{}'".format(session)
        cursor.execute(sql)
        transbordo = cursor.fetchall()
        if(len(transbordo) == 0):
            print('> Não inserido no transbordo')
            sql = "INSERT INTO db_sanofi_ccs.tab_transbordo (id,sessionBot,origem,telefone,cnpj,dtin) VALUES (uuid(),%s,%s,%s,%s,%s)"
            params = [session, 'wbot', mobile, 'null', datetime.now()]
            cursor.execute(sql,params)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def encerraTransbordo(session):
    try:
        chatHist = getHistoric(session)
        sql = "UPDATE db_sanofi_ccs.tab_transbordo SET destino = 'wbot', chatbot = %s, dten = NOW() WHERE sessionBot = %s;"
        params = [str(chatHist),str(session)]
        cursor.execute(sql,params)
        print('> Transbordo encerrado')

    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def endTransbordo(session):
    try:
        chatHist = getHistoric(session)
        sql = "UPDATE db_sanofi_ccs.tab_transbordo SET destino = 'human', chatbot = %s WHERE sessionBot = %s;"
        params = [str(chatHist),str(session)]
        cursor.execute(sql,params)
        print('> Transbordo encerrado')

    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def getHistoric(session):
    try:
        sql = "SELECT DATE_FORMAT(dt,'%Y-%m-%d %H:%i:%s') as date, fromid, fromname, toid, toname, msgdir, msgtext, sessionid FROM db_sanofi_ccs.tab_logs WHERE sessionid = '{}'".format(session)
        cursor.execute(sql)
        row_headers = [x[0] for x in cursor.description]
        historic = cursor.fetchall()
        jonson = []
        for row in historic:
            jonson.append(dict(zip(row_headers,row)))
        return jonson
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def socketConnect():
    try:
        sio.connect('https://ccs.sanofi-mobile.com.br/')
        sio.wait()
        print('> Conectado ao socket')
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def sendWelcome(mobile,session):
    try:
        print('> Mandando Welcome')
        payload = {}
        payload["mobile"] = mobile
        payload["type"] = "chat"
        payload["sessionid"] = session
        sio.emit("send_welcome", payload)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def sendTimeout(mobile,session):
    try:
        print('> Mandando Timeout')
        payload = {}
        payload["mobile"] = mobile
        payload["type"] = "chat"
        payload["sessionid"] = session
        sio.emit("send_timeout", payload)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

def main():
    try:
        #print('> Rodando Main Def...')
        job_main.pause()
        sql = "SELECT mobile, sessionBot, TIMESTAMPDIFF(MINUTE,dtin,NOW()) as tempo FROM db_sanofi_ccs.tab_filain where status = 5;"
        cursor.execute(sql)
        mobile = cursor.fetchall()
        for num in mobile:
            if(num[2] < 20):
                #print('> Inserindo no transbordo')
                insertTransbordo(num[1], num[0])
                #print('> Scaneando num: ' + str(num[0]))
                sql = "SELECT sessionid, msgtext, id, msgtype FROM db_sanofi_ccs.tab_logs where fromid = {} AND stread = 0  AND msgdir = 'i' ORDER BY dt DESC".format(num[0])
                cursor.execute(sql)
                messages = cursor.fetchall()
                #print('> Total de ' + str(len(messages)) + ' mensagens encontradas para o numero: ' + str(num[0]))
                for msg in messages:
                    if(msg[3] == 'chat'):
                        print("> Session Id: " + str(msg[0]))
                        print("> Pergunta: " + str(msg[1]))
                        resposta = staticMessage(msg[0],msg[1],num[0])
                        print("> Resposta: " + str(resposta))

                        for res in resposta:
                            if (res['text'] != "null"):
                                insertLog(msg[0],num[0],res['text'])
                                sendMessage(num[0],res['text'])

                        sql = "UPDATE db_sanofi_ccs.tab_logs SET stread = 1 WHERE id = '{}'".format(msg[2])
                        cursor.execute(sql)
                    else:
                        endBot(msg[0],num[0])
                        sql = "UPDATE db_sanofi_ccs.tab_logs SET stread = 1 WHERE id = '{}'".format(msg[2])
                        cursor.execute(sql)
            else:
                print(">>> MAIS DE 20 MINUTOS NA FILA")
                encerraBot(num[1],num[0])
                sql = "UPDATE db_sanofi_ccs.tab_logs SET stread = 1 WHERE sessionid = '{}'".format(num[1])
                cursor.execute(sql)


    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    finally:
        job_main.resume()

conn = persistenceDbcc()
dbcc = conn[0]
cursor = conn[1]

# Scheduled Task e Started
sched = BackgroundScheduler()
sched.start()

# Add Job Scheduled
job_main = sched.add_job(main, 'interval', seconds=1)

while True:
    try:
        #print('> Rodando...')
        sock = socketConnect()
        sleep(1)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
