import React, { useState } from 'react';
import CityWeatherConsumer from '../api_consumer/CityWeatherConsumer';
import '../css/weatherupdatebutton.css';

const WeatherUpdateButton = ({ cities, onWeatherUpdate }) => {
  const [updateStatus, setUpdateStatus] = useState({});
  const [error, setError] = useState(null);

  const handleUpdateWeather = async () => {
    setError(null);
    const statusResults = {};

    try {
      for (const city of cities) {
        const currentWeather = await CityWeatherConsumer.fetchWeatherByCityName(city);
        const response = await CityWeatherConsumer.updateCityWeather(city, currentWeather);
        statusResults[city] = `Updated successfully: ${JSON.stringify(response)}`;
      }

      setUpdateStatus(statusResults);
      if (onWeatherUpdate) onWeatherUpdate(); // Trigger refresh
    } catch (err) {
      setError(`Error updating weather: ${err.message}`);
    }
  };

  return (
    <div className="weather-update-container">
      <button className="weather-update-button" onClick={handleUpdateWeather}>
        Update Weather for Cities
      </button>
    </div>
  );
};

export default WeatherUpdateButton;
