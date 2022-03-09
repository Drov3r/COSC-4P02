from itertools import count
from sched import scheduler
from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import json
from sqlalchemy import null
from zmq import NULL

urls = ["https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=cd0b2071-53e4-4116-bc64-550da34c4558&SetLanguage=en-CA",
        "https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=bf5fb5d5-06b9-4de6-b177-1655bf8bfcb1&SetLanguage=en-CA",
        "https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=ba76453a-da5e-4f38-9142-70ef0112baf7&SetLanguage=en-CA",
        "https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=4a73eb84-2cd9-499b-96c5-bf89e5b11589&SetLanguage=en-CA"]

schedule = {}

for url in urls:
    # initiating the webdriver. Parameter includes the path of the webdriver.
    s = Service(r'scraper/src/chromedriver')
    driver = webdriver.Chrome(service=s)
    driver.get(url) 
    
    # this is just to ensure that the page is loaded
    time.sleep(5) 
    
    html = driver.page_source
    
    # this renders the JS code and stores all
    # of the information in static HTML code.

    # get the sport name
    sportName = ""
    title_elements = driver.find_elements(by=By.CLASS_NAME, value="LM_PageTitle")
    for title in title_elements:
        sportName = sportName + title.text
    sportName = sportName.replace("\n"," - ")
    print(sportName)

    # get all table bodies on page
    table_bodies = driver.find_elements(by=By.TAG_NAME, value="tbody")

    # tuples to add to database
    tuples = {}

    # initialize temporary tuple
    tempTuple = []

    # loop through all the table bodies, skipping first (show/hide) and last (blue provisional result)
    for tbody in table_bodies[1:-1]:
        # get the table bodies
        roundNames = tbody.find_elements(by=By.CLASS_NAME, value="LM_ResultRoundName")
        if len(roundNames)>0:
            roundName = ""
            for rName in roundNames:
                roundName += rName.text
            tempTuple = []
            
        # get the cells for a team game result
        headerCells = tbody.find_elements(by=By.CLASS_NAME, value="HeaderCell")
        if len(headerCells)>2:
            if "Game" in headerCells[0].text and \
                "Team" in headerCells[1].text and \
                "Points" in headerCells[2].text or \
                    "Runs" in headerCells[2].text or \
                    "Goals" in headerCells[2].text or \
                    "Score" in headerCells[2].text:


                oddRows = tbody.find_elements(by=By.CLASS_NAME, value="DataRowOdd")
                count=0
                tempInnerTuple = []
                for row in oddRows:
                    cells = row.find_elements(by=By.CLASS_NAME, value="DataCell")
                    for cell in cells:
                        cellDetails = cell.text.split("\n")
                        for detail in cellDetails:
                            tempInnerTuple.append(detail)
                    if count%2==1:
                        tempTuple.append(tempInnerTuple)
                        tempInnerTuple = []
                    count = count + 1

                count = 0
                evenRows = tbody.find_elements(by=By.CLASS_NAME, value="DataRowEven")
                tempInnerTuple = []
                for row in evenRows:
                    cells = row.find_elements(by=By.CLASS_NAME, value="DataCell")
                    for cell in cells:
                        cellDetails = cell.text.split("\n")
                        for detail in cellDetails:
                            tempInnerTuple.append(detail)
                    if count%2==1:
                        tempTuple.append(tempInnerTuple)
                        tempInnerTuple = []
                    count = count + 1
        if len(tempTuple)>0:
            tuples[roundName] = tempTuple
            tempTuple = []

    schedule[sportName] = tuples
    driver.close() # closing the webdriver

with open('scraper/src/schedule.json', 'w', encoding='utf-8') as f:
    json.dump(schedule, f, ensure_ascii=False, indent=4)