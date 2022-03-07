import requests
from bs4 import BeautifulSoup



url = 'https://niagara2022games.ca/'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
f = open('file.txt', 'w')

 
urls = []
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        urls.append(linky) 

# getting length of list
length = len(urls)
  
# Iterating the index
# same as 'for i in range(len(list))'
with open('all.txt', 'w') as f:
    for i in range(length):
        f.write(urls[i]+"\n")


url = 'https://niagara2022games.ca/about/alumni/'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
urls = []
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'alumni' in linky:
            if linky not in urls:
                urls.append(linky)
            
# getting length of list
length = len(urls)
  
# Iterating the index
# same as 'for i in range(len(list))'
with open('alumni.txt', 'w') as f:
    for i in range(length):
        f.write(urls[i]+"\n")


url = 'https://niagara2022games.ca/about/'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
urls = []
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'about' in linky:
            if linky not in urls:
                urls.append(linky)
            
# getting length of list
length = len(urls)
  
# Iterating the index
# same as 'for i in range(len(list))'
with open('about.txt', 'w') as f:
    for i in range(length):
        f.write(urls[i]+"\n")


url = 'https://niagara2022games.ca/news'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
urls = []
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'news' in linky:
            if linky not in urls:
                urls.append(linky)
            
# getting length of list
length = len(urls)
  
# Iterating the index
# same as 'for i in range(len(list))'
with open('news.txt', 'w') as f:
    for i in range(length):
        f.write(urls[i]+"\n")



url = 'https://niagara2022games.ca/events'
reqs = requests.get(url)
soup = BeautifulSoup(reqs.text, 'html.parser')
 
urls = []
for link in soup.find_all('a'):
    linky = link.get('href')
    if 'niagara2022games' in linky:
        if 'events' in linky:
            if linky not in urls:
                urls.append(linky)
            
# getting length of list
length = len(urls)
  
# Iterating the index
# same as 'for i in range(len(list))'
with open('events.txt', 'w') as f:
    for i in range(length):
        f.write(urls[i]+"\n")



f.close()
