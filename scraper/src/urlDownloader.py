import urlGetter
import requests

if __name__ == "__main__":

  list = urlGetter.get_URL()
  for url in list:
    r = requests.get(url, allow_redirects=True)
    filename = url.replace("/","_")
    open(filename, 'wb').write(r.content)
