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
    ["Hello", "Hello, how can I help you?"], 
    #["how long till games start", "There are 3 months, and 17 days until the games! (108 days in total)"], //Days change
    ["hi","Hello, how can I help you?"], 
    ["how are you","Hello, how can I help you?"], 
    ["hey","Hello, how can I help you?"], 
    ["good morning","Hello, how can I help you?"], 
    ["where is cycling","Hello, how can I help you?"], 
    ["when is cycling","The next cycling event will at the following time: 2022-08-08 12:00:00"], 
    ["where is rugby","The rugby events will be at the following venues: Brock Sport Facilities"], 
    ["when is rugby","The next rugby event will at the following time: 2022-08-08 14:00:00"], 
    ["where is beach volley ball","The volley events will be at the following venues: Canada Games Park, Niagara College Welland Campus"], 
    ["when is volleyball","The next volleyball event will at the following time: 2022-08-08 09:00:00"], 
    ["when is wrestling","The next wrestling event will at the following time: 2022-08-09 09:00:00"], 
    ["where is wrestling","The next wrestling event will at the following time: 2022-08-09 09:00:00"], 
    ["when is diving","The next diving event will at the following time: 2022-08-16 13:15:00"], 
    ["where is diving","The diving events will be at the following venues: Brock Sport Facilities, Etobicoke Olympium"], 
    ["where is golf","The golf events will be at the following venues: Legends on the Niagara Golf Course - Battlefield Course"], 
    ["when is golf","The next golf event will at the following time: 2022-08-17 09:00:00"], 
    ["where is basketball","The basketball events will be at the following venues: Meridian Centre, Niagara College Welland Campus"], 
    ["when is basketball","The next basketball event will at the following time: 2022-08-08 08:30:00"], 
    ["where is sailing","The sailing events will be at the following venues: Niagara-on-the-Lake Sailing Club"], 
    ["when is sailing","The next sailing event will at the following time: 2022-08-17 11:00:00"], 
    ["where is baseball","The baseball events will be at the following venues: Oakes Park, Welland Baseball Stadium"], 
    ["when is baseball","The next baseball event will at the following time: 2022-08-07 10:00:00"], 
    ["when is soccer","The next soccer event will at the following time: 2022-08-07 16:00:00"], 
    ["when is cycling","The next cycling event will at the following time: 2022-08-08 12:00:00"], 
    ["where is tennis","The tennis events will be at the following venues: Niagara-on-the-Lake Tennis Club, Welland Tennis Club"], 
    ["when is tennis","The next tennis event will at the following time: 2022-08-07 09:00:00"], 
    ["when is rowing","The next rowing event will at the following time: 2022-08-17 09:00:00"], 
    ["where is rowing","The rowing events will be at the following venues: Royal Canadian Henley Rowing Course"], 
    ["where is mountain bike event","The mountain events will be at the following venues: Twelve Mile Creek"], 
    ["where is mountain biking event","The mountain events will be at the following venues: Twelve Mile Creek"]
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