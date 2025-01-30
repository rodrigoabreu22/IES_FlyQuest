import URL_CONFIG from "../config";

const API_BASE_URL = URL_CONFIG.API_URL + '/weather';

const CityWeatherConsumer = {
    fetchAllCities: async () => {
        try {
            let response = await fetch(`${API_BASE_URL}/all`);
            let data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error:', error);
        }
    },

    // Fetch weather data for a specific city by name
    fetchWeatherByCityName: async (cityName) => {
        const response = await fetch(`${API_BASE_URL}/${cityName}`);
        if (!response.ok) {
            throw new Error(`Error fetching weather data for city: ${cityName}`);
        }
        return await response.json();
    },

    // Add new city weather data
    addCityWeather: async (cityWeather) => {
        const response = await fetch(`${API_BASE_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityWeather),
        });
        if (!response.ok) {
            throw new Error('Error adding city weather data');
        }
        return await response.json();
    },

    // Update weather data for a specific city by name
    updateCityWeather: async (cityName, cityWeather) => {
        const response = await fetch(`${API_BASE_URL}/${cityName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityWeather),
        });
        if (!response.ok) {
            throw new Error(`Error updating weather data for city: ${cityName}`);
        }
        return await response.json();
    },
};

export default CityWeatherConsumer;
