#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys
get_ipython().system('{sys.executable} -m pip install bs4')
import requests
from bs4 import BeautifulSoup


# In[2]:


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


# In[3]:


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


# In[4]:


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


# In[5]:


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


# In[6]:


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


# In[7]:


f.close()


# In[ ]:




