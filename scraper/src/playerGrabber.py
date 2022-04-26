import time

from selenium import webdriver
from selenium import webdriver
from selenium.webdriver.chrome.service import Service


from zmq import NULL
import sys

from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
guyName = sys.argv[1]
guyName2 = sys.argv[2]
url = 'https://cgc.gems.pro/AlumCgc/Alumni/FindAlumni_List.aspx?UseSessionState=Y&ShowAll=Y'
s = Service(r'chromedriver.exe')
driver = webdriver.Chrome(options=chrome_options,service=s)
driver.get(url) 
html = driver.page_source
fName = 'ctl00_ContentPlaceHolder1_txtFirstName'
lName = 'ctl00_ContentPlaceHolder1_txtLastName'
ent = 'ctl00_ContentPlaceHolder1_btnFind'
person = 'ctl00_ContentPlaceHolder1_pnlAlumni'
first = driver.find_element_by_id(fName)
last = driver.find_element_by_id(lName)
enter = driver.find_element_by_id(ent)
first.send_keys(guyName)
last.send_keys(guyName2)
enter.click()
driver.find_element_by_link_text(guyName).click()
time.sleep(2)
url = driver.current_url
print(url)
  
driver.close() # closing the webdriver