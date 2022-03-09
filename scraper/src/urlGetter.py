import requests
from bs4 import BeautifulSoup

def get_URL():
    print("Getting URLs")
    urlSt = 'https://niagara2022games.ca/'
    reqs = requests.get(urlSt)
    soup = BeautifulSoup(reqs.text, 'html.parser')
    urls = []
    for link in soup.find_all('a'):
        linky = link.get('href')
        if 'niagara2022games' in linky:
            urls.append(linky)
    
    all = []
    for urly in urls:
        print(urly)
        request = requests.get(urly)
        soup = BeautifulSoup(request.text, 'html.parser')
        for link in soup.find_all('a'):
            linky = link.get('href')
            if 'niagara2022games' in linky:
                all.append(linky)

    for url in all:
        print(url)

    
get_URL()