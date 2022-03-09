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
        if 'fr' not in urly:
            try:
                print(urly)
                request = requests.get(urly)
                soup = BeautifulSoup(request.text, 'html.parser')
                for link in soup.find_all('a'):
                    linky = link.get('href')
                    if 'niagara2022games' in linky:
                        try:
                            all.append(linky)
                        except:
                            print("Cant append that! :)")
            except:
                print("Nuh uh! You cant do that :)")
    return all

    
get_URL()