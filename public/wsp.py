from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def enviar_whatsapp(numero, mensaje):
    # Ruta al ChromeDriver que descargaste
    driver = webdriver.Chrome("C:/Users/Angel/Downloads/chrome-win64/chrome-win64/chrome.exe")
    
    driver.get('https://web.whatsapp.com')
    input("⏳ Escanea QR y presiona Enter...")
    
    # Buscar contacto
    search = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, '//div[@contenteditable="true"]'))
    )
    search.send_keys(numero)
    time.sleep(2)
    search.send_keys(Keys.ENTER)
    
    # Enviar mensaje
    time.sleep(2)
    msg = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
    msg.send_keys(mensaje)
    msg.send_keys(Keys.ENTER)
    
    print("✅ Enviado")
    time.sleep(2)
    driver.quit()

enviar_whatsapp("+56912345678", "Hola desde Python")