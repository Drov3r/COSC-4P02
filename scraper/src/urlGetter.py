import requests
from bs4 import BeautifulSoup

def get_URL():
  print("Hello from a function")
url = 'https://niagara2022games.ca/'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')

urls = []
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        urls.append(linky) 

url = 'https://niagara2022games.ca/about/alumni/'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')


for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'alumni' in linky:
            if linky not in urls:
                urls.append(linky)      

url = 'https://niagara2022games.ca/about/'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'about' in linky:
            if linky not in urls:
                urls.append(linky)
            

url = 'https://niagara2022games.ca/news'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'news' in linky:
            if linky not in urls:
                urls.append(linky)

url = 'https://niagara2022games.ca/events'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'events' in linky:
            if linky not in urls:
                urls.append(linky)
