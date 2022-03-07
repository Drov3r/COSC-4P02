from itertools import count
from selenium import webdriver
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
from sqlalchemy import null
from zmq import NULL

#url of the page we want to scrape this url is set for mens basketball
url = "https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=4a73eb84-2cd9-499b-96c5-bf89e5b11589&SetLanguage=en-CA"
  
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
tuples = []

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
        tempTuple.append(roundName)
        
    # get the cells for a team game result
    headerCells = tbody.find_elements(by=By.CLASS_NAME, value="HeaderCell")
    if len(headerCells)>2:
        if "Game" in headerCells[0].text and "Team" in headerCells[1].text and "Points" in headerCells[2].text:


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
    tuples.append(tempTuple)
    tempTuple = []


for a in tuples:
    for row in a:
        print(row)

driver.close() # closing the webdriver