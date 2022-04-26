from pandas import qcut
from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
from zmq import NULL
import sys
import datetime

current = datetime.datetime.now()
current = current.strftime("%B %d")
#url of the page we want to scrape this url is set for mens basketball
url = sys.argv[1]
# initiating the webdriver. Parameter includes the path of the webdriver.
s = Service(r'chromedriver.exe')
driver = webdriver.Chrome(service=s)
driver.get(url) 
  
# this is just to ensure that the page is loaded
time.sleep(5) 
  
html = driver.page_source
  
# this renders the JS code and stores all
# of the information in static HTML code.
team1 = "QC" 
team2 = "SK"
matched_elements = driver.find_elements(by=By.CLASS_NAME, value="DataCell")
texts = []
for matched_element in matched_elements:
    text = matched_element.text
    if(text==' '):
        text = '0'
    texts.append(text)
dateCheck = current 
# date and time in yyyy/mm/dd hh:mm:ss format
date = current
matching = [s for s in texts if dateCheck in s]
if len(matching) == 0:
    print("There are no games today!")
    matching = [s for s in texts if "August 8" in s]
    date = "August 8"
print("Scores on " + str(date) + " are: ")
for x in matching:
    print(texts[texts.index(x)-1])
    print(texts[texts.index(x)+1])
    print(texts[texts.index(x)+2])
    print(texts[texts.index(x)+3])
    print(texts[texts.index(x)+4])
#for row in Table:
#    print(row.text)
  
driver.close() # closing the webdriver