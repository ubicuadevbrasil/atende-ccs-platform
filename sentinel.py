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

## Methods SocketIO
@sio.on('connect')
def on_connect():
    print(str(datetime.now()) + " >> Conectado ao RT Ubicua Platform !")
    syslog.syslog(">> Conectado ao RT Ubicua Platform !")
    data = {}
    data['fkid']   = "2"
    data['fkname'] = "Sentinel RT Ubicua Platform v2 "
    sio.emit('add user', data)
    job_sentinel_newmessage.resume()

## Schedules
def sentinel_monitor():
    reportmsg = "**** Status Report ****\nMobile: 5511995518459 \nCPU: " + str(psutil.cpu_percent()) + "% \nMemory: " + str(psutil.virtual_memory().percent) + "% \nBattery: 100%"
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
        qryA = "SELECT id, uid, contact_uid, contact_name, message_uid, message_type, body_text, body_caption, body_url FROM db_sanofi_ccs.tab_waboxappin WHERE message_dir='i' AND status=0 AND contact_type = 'User' ORDER by dtin;"
        curA.execute(qryA)
        for rs in curA:
            _id           = str(rs[0])
            _uid          = str(rs[1])
            _mobile       = str(rs[2])
            _name_before  = str(rs[3])
            _name         = _name_before.replace("'", "")
            _message_uid  = str(rs[4])
            _message_type = str(rs[5])
            _body_text    = str(rs[6])
            _body_caption = str(rs[7])
            _body_url     = str(rs[8])
            #print(str(datetime.now()) + " >> Verificando Se Mobile Está em Atendimento: " + _mobile)
            qryB = "SELECT sessionid, fkto, fkname, name FROM db_sanofi_ccs.tab_atendein WHERE mobile='" + _mobile + "' LIMIT 1;"
            curB.execute(qryB)
            if ( curB.rowcount == 0 ):
                #print(str(datetime.now()) + " >> Mobile Não Esta em Atendimento, Verificando na Fila: " + _mobile)
                qryC = "SELECT * FROM db_sanofi_ccs.tab_filain WHERE mobile='" + _mobile + "'  LIMIT 1;"
                curC.execute(qryC)
                if ( curC.rowcount == 0 ):
                    print(str(datetime.now()) + " >> Mobile Não Encontrado, Inserir na Fila e Notificar o Usuário: " + _mobile)
                    qryD = "SELECT mobile FROM db_sanofi_ccs.tab_prior WHERE mobile='" + _mobile + "' LIMIT 1;"
                    curD.execute(qryD)
                    if ( curD.rowcount == 1 ):
                        qryE = "INSERT INTO db_sanofi_ccs.tab_filain (mobile, account, status) VALUES(" + _mobile + ", 'prior', '7');"
                        curE.execute(qryE)
                    else:
                        qryE = "INSERT INTO db_sanofi_ccs.tab_filain (mobile) VALUES(" + _mobile + ");"
                        curE.execute(qryE)
                    # Enviando mensagem Welcome, se UID <> CHAT
                    if ( _uid != "CHAT" ):
                        payload = {}
                        payload["mobile"] = _mobile
                        payload["type"] = "chat"
                        sio.emit("send_welcome", payload)
            else:
                print(str(datetime.now()) + " >> Mobile em Atendimento, Dispara Mensagem para Atendente: " + _mobile)
                for inat in curB:
                    _sessionid = inat[0]
                    _fkto      = inat[1]
                    _fkname    = inat[2]
                    _namea     = inat[3]
                payload = {}
                payload["id"]           = _id
                payload["uid"]          = _uid
                payload["contact_uid"]  = _mobile
                payload["message_uid"]  = _message_uid
                payload["message_type"] = _message_type
                payload["body_text"]    = _body_text
                payload["body_caption"] = _body_caption
                payload["body_url"]     = _body_url
                payload["sessionid"]    = _sessionid
                payload["fkto"]         = _fkto
                payload["fkname"]       = _fkname
                payload["name"]         = _namea
                sio.emit("sentinel_message_send", payload)
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())
    finally:
        job_sentinel_newmessage.resume()

## Persistences
def persistence_dbcc():
    try:
        global dbcc
        dbcc = mariadb.connect(host='localhost', user='admin', password='GmtB0kCs*Fic', database='db_sanofi_ccs')
        dbcc.autocommit = True
        global cursor
        cursor = dbcc.cursor()
        global curA
        curA = dbcc.cursor(buffered=True)
        global curB
        curB = dbcc.cursor(buffered=True)
        global curC
        curC = dbcc.cursor(buffered=True)
        global curD
        curD = dbcc.cursor(buffered=True)
        global curE
        curE = dbcc.cursor()
        print(str(datetime.now()) + " >> Conectado no Banco de Dados MariaDB/MySQL....")
        qry = "SELECT rtserver FROM db_sanofi_ccs.tab_config WHERE id=1;"
        cursor.execute(qry)
        for result in cursor:
            global rtserver
            rtserver = str(*result)
    except mariadb.Error as err:
        syslog.syslog(">> Erro ao Conectar no Banco de Dados MariaDB/MySQL, Erro: "  + str(err))
        print(">> Erro ao Conectar no Banco de Dados MariaDB/MySQL, Erro: "  + str(err))

def persistence_rt():
    try:
        sio.connect(str(rtserver))
        sio.wait()
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

# Scheduled Task e Started
sched = BackgroundScheduler()
sched.start()

# Add Job Scheduled
job_sentinel_waendpoint   = sched.add_job(sentinel_waendpoint, 'interval', seconds=3)
job_sentinel_clientsqueue = sched.add_job(sentinel_clientsqueue, 'interval', seconds=2)
job_sentinel_newmessage   = sched.add_job(sentinel_newmessages, 'interval', seconds=1)
job_sentinel_monitor      = sched.add_job(sentinel_monitor, 'interval', seconds=1800)

if __name__ == '__main__':
    try:
        syslog.syslog(">> Starting Sentinel Ubicua Platform...")
        job_sentinel_newmessage.pause()
        persistence_dbcc()
        persistence_rt()
    except:
        syslog.syslog(">> Exception: " + str(sys.exc_info()))
        print(sys.exc_info())

