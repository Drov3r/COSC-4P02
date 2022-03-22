from urlGetter import get_URL
import requests

if __name__ == "__main__":

  list = get_URL()
  count=0
  for url in list:
    r = requests.get(url, allow_redirects=True)
    print("Got:", url)
    filename = url.replace("/","7")


    f = open(str(count)+".html", 'wb')
    count=count+1
    f.write(r.content)
    f.close()

    # open and read the file after the appending:
    print(filename, "is made")
