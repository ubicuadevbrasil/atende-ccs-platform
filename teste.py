from time import sleep
from cassandra.cluster import Cluster
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from datetime import datetime as dt
from random import randint
from datetime import date
from datetime import datetime
import socketio
import mysql.connector
import sys
import datetime
import csv
import pybase64
import asyncio
import json
import schedule

# Selenium ChromeWebDriver config
extension = "./wapp.crx"

options = Options()
options.add_argument("start-maximized")
options.add_argument("disable-infobars")
options.add_argument("--disable-gpu")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--no-sandbox")
options.add_extension(extension)
# Buscando Driver do GoogleChrome
driver = webdriver.Chrome('/home/ubicua/Documents/robo_monitor/chromedriver', options=options)
# Socket Config
sio = socketio.Client()

x = []


@sio.on('receive_picture')
def receive_picture(payload):
    mobile = payload["mobile"]
    message = payload["message"]
    resdata = {
        "mobile": mobile,
        "message": message
    }
    x.append(resdata)


@sio.on('connect')
def socket_connected():
    print("Socket Conectado: " + sio.sid)
    schedule.every(35).seconds.do(schelude_img)
    while True:
        schedule.run_pending()


@sio.on('disconnect')
def socket_disconnected():
    print("Socket Desconectado")


def open_wpp():
    driver.get("http://web.whatsapp.com")  # Link do WhatsApp Web


def socket_connect():
    sio.connect('https://ccs.sanofi-mobile.com.br')
    sio.wait()


def refresh_wpp():
    confirm = input("Digite 1 para refresh")

    if confirm == "1":
        return "1"
    elif confirm == "2":
        return "2"
    elif confirm == "3":
        return "3"
    else:
        return "fock"


def send_img(mobile, message):
    try:
        # Pesquisa o numero no wpp
        driver.find_element_by_css_selector(
            'input._2zCfw.copyable-text.selectable-text').send_keys("{}".format(mobile))
        sleep(1)
        driver.find_element_by_css_selector(
            'input._2zCfw.copyable-text.selectable-text').send_keys(Keys.ENTER)
        sleep(1)
        driver.find_element_by_css_selector("span[data-icon='clip']").click()
        sleep(1)
        driver.find_element_by_css_selector('input[type="file"]').send_keys(
            '/home/ubicua/Documents/robo_monitor/img.png')
        sleep(1)
        driver.find_element_by_css_selector(
            'div._3u328.copyable-text.selectable-text').click()
        driver.find_element_by_css_selector(
            'div._3u328.copyable-text.selectable-text').send_keys("{}".format(message))
        sleep(1)
        driver.find_element_by_xpath('//span[@data-icon="send-light"]').click()

    except Exception as ex:
        print(">>Erro: " + str(ex))


def schelude_img():
    if len(x) > 0:
        mobile = x[0]["mobile"]
        message = x[0]["message"]
        send_img(mobile, message)
        print(x)
        print('Disparado Numero:' + str(mobile))
        x.pop(0)

open_wpp()

input("Aperte enter após a leitura do QRCode e validação Wapbox")


socket_connect()
