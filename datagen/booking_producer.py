from kafka import KafkaProducer
import requests
import json
import random

TOPIC = "booking"
BASE_URL = "http://backend:8090/api/v1"

# Endpoints
ALL_FLIGHTS_ENDPOINT = f"{BASE_URL}/flight/all"
SEATS_AVAILABLE_ENDPOINT = lambda flight_id: f"{BASE_URL}/flight/{flight_id}/seats/available"

def get_flights():
    """
    Fetch all flights from the API.
    """
    response = requests.get(ALL_FLIGHTS_ENDPOINT)
    print("------------------")
    print(response)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch flights. Status code: {response.status_code}")
        return []

def get_available_seats(flight_id):
    """
    Fetch all available seats for a given flight.
    """
    response = requests.get(SEATS_AVAILABLE_ENDPOINT(flight_id))
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch available seats for flight {flight_id}. Status code: {response.status_code}")
        return []

def seat_to_be_booked():
    """
    Selects a seat to be booked by filtering flights and picking an available seat.
    """
    flights = get_flights()
    
    # Filter flights that are "SCHEDULED"
    scheduled_flights = [flight for flight in flights if flight.get("status") == "SCHEDULED"]
    if not scheduled_flights:
        print("No scheduled flights available.")
        return None
    
    # Choose a random flight
    flight = random.choice(scheduled_flights)
    flight_id = flight["id"]
    print(f"Selected flight ID: {flight_id} (Status: {flight['status']})")

    # Fetch available seats for the flight
    available_seats = get_available_seats(flight_id)
    if not available_seats:
        print(f"No available seats for flight {flight_id}.")
        return None
    
    # Choose a random available seat
    seat = random.choice(available_seats)
    print(f"Selected seat ID: {seat['id']} on flight {flight_id}.")

    if seat:
        message = {
                "id": seat["id"],
            }

    return message
