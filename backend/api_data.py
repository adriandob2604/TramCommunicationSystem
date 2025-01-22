import requests
tram_numbers = [str(num) for num in range(1, 13)]
trams = []
url = "https://ckan2.multimediagdansk.pl/gpsPositions?v=1"
data = requests.get(url).json()
for tram in data['Vehicles']:
    if tram['Line'] in tram_numbers:
        trams.append(tram)

print(trams)