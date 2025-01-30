import json
from datetime import datetime

def generate_weather_data(city_name):
    """Generate a weather data set for the given city."""
    weather_data = {
        "cityName": city_name,
        "date": datetime.utcnow().isoformat(),
        "latitude": 0,
        "longitude": 0,
        "temperature": 0,
        "windSpeed": 0,
        "precipitation": 0,
        "humidity": 0,
        "visibility": 0
    }
    return weather_data

def write_weather_data_to_file(cities, file_name):
    """Generate weather data for a list of cities and write to a file."""
    with open(file_name, "w") as file:
        for city in cities:
            try:
                weather_data = generate_weather_data(city)
                file.write(json.dumps(weather_data) + "\n")
            except Exception as e:
                print(f"Error processing city {city}: {e}")

if __name__ == "__main__":
    cities = [
        "Lisbon", "Porto", "Barcelona", "Paris", "Berlin", "London", "Amsterdam", "Madrid", "Rome", "Vienna", "Prague",
        "New York", "Tokyo", "Sydney", "San Francisco", "Los Angeles", "Dubai", "Singapore", "Bangkok", "Hong Kong", "Toronto",
        "Buenos Aires", "Lima", "Rio de Janeiro", "Sao Paulo", "Moscow", "Stockholm", "Munich", "Bali", "Valencia"
    ]
    output_file = "cities.txt"
    write_weather_data_to_file(cities, output_file)
    print(f"Weather data written to {output_file}")
