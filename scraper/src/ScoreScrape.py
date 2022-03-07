from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
from zmq import NULL

#url of the page we want to scrape this url is set for mens basketball
url = "https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=4a73eb84-2cd9-499b-96c5-bf89e5b11589&SetLanguage=en-CA"
  
# initiating the webdriver. Parameter includes the path of the webdriver.
s = Service(r'chromedriver.exe')
driver = webdriver.Chrome(service=s)
driver.get(url) 
  
# this is just to ensure that the page is loaded
time.sleep(5) 
  
html = driver.page_source
  
# this renders the JS code and stores all
# of the information in static HTML code.

matched_elements = driver.find_elements(by=By.CLASS_NAME, value="DataCell")
texts = []
for matched_element in matched_elements:
    text = matched_element.text
    if(text==' '):
        text = '0'
    texts.append(text)
    print(text)

#for row in Table:
#    print(row.text)
  
driver.close() # closing the webdriver