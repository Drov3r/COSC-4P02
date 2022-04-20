from itertools import count
from sched import scheduler
from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
import json
from sqlalchemy import null
from zmq import NULL

s = Service(r'scraper/src/chromedriver')
driver = webdriver.Chrome(service=s)



tests = [
    ["how long till games start", "There are 3 months, and 17 days until the games! (100 days in total)"],
    ["Hello", "Hello, how can I help you?"]
    
]


i=0 
for case in tests:
    i = i + 1
    url = "http://boomerbot.duckdns.org/"
    # initiating the webdriver. Parameter includes the path of the webdriver.
    driver.get(url) 

    #assert 'Yahoo' in driver.title

    elem = driver.find_element(By.TAG_NAME, 'input')  # Find the search box
    elem.send_keys(case[0] + Keys.RETURN)
    delay = 6 # seconds
    try:
        # dummy line to make it wait 
        myElem = WebDriverWait(driver, delay).until(EC.presence_of_element_located((By.XPATH, '/html/body/h7')))
        
    except TimeoutException:
        pass
    answer = driver.find_element(By.XPATH, '/html/body/div/div/div/div[2]/div[2]/div/div/div[3]/div[3]/div[2]/h3')
    
    try:
        assert case[1] in answer.text 
        print("test " + str(i) + " passed")
    except AssertionError:
        print("test " + str(i) + " failed, should be: " + case[1])
    

    

driver.quit()