import requests
import json

BASE_URL = "http://localhost:8090/api/v1"

def insert_data(type):
    if type == "planes":
        with open('./planes.txt', 'r') as file:
            for data in file:
                r = requests.post(BASE_URL + "/plane/add", json=json.loads(data))
                print(r.text)

    elif type == "employees":
        with open('./employees.txt', 'r') as file:
            for data in file:
                r = requests.post(BASE_URL + "/auth/createAccount", json=json.loads(data))
                print(r.text)
    
    elif type == "cities":
        with open('./cities.txt', 'r') as file:
            for data in file:
                r = requests.post(BASE_URL + "/weather/add", json=json.loads(data))
                print(r.text)

    elif type == "flights":
        with open('./flights.txt', 'r') as file:
            for data in file:
                r = requests.post(BASE_URL + "/flight/add", json=json.loads(data))
                print(r.text)

def main():
    insert_data("planes")
    insert_data("employees")
    insert_data("cities")
    insert_data("flights")


if __name__ == "__main__":
    main()