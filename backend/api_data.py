import requests
url = "https://ckan2.multimediagdansk.pl/departures"

tram_destinations = [
    "Brzeźno Plaża", "Nowy Port Oliwska", "Stogi Plaża", "Łostowice Świętokrzyska",
    "Chełm Witosa", "Siedlce", "Zaspa", "Oliwa", "Jelitkowo", "Strzyża PKM",
    "Ujeścisko", "Lawendowe Wzgórze", "Migowo", "Przeróbka",
    "Zajezdnia Nowy Port", "Zajezdnia Wrzeszcz"]

data = requests.get(url).json()
departure_numbers = data.keys()
departures = []
for key in departure_numbers:
    departures.append(data[key]["departures"])

flattened_departures = sum(departures, [])
tram_departures = []
for dep in flattened_departures:
    if dep['headsign'] in tram_destinations:
        route_object = {'headsign': dep['headsign'], 'delay': dep['delayInSeconds']}
        tram_departures.append(dep)

print(tram_departures[0])