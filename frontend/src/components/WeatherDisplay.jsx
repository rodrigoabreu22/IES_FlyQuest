import React, { useEffect, useState } from 'react';
import CityWeatherConsumer from '../api_consumer/CityWeatherConsumer';
import weatherLimits from './weatherlimits.json'; // Import weather limits
import '../css/weatherdisplay.css';

const WeatherDisplay = ({ refreshKey, onExceedLimits }) => {
    const [weatherData, setWeatherData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const departureCity = localStorage.getItem('departureCity');
    const arrivalCity = localStorage.getItem('arrivalCity');
    const cities = [departureCity, arrivalCity];

    useEffect(() => {
        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);
            const weatherResults = {};
            let exceedsLimits = false;

            try {
                if (!departureCity || !arrivalCity) return;

                for (const city of cities) {
                    const data = await CityWeatherConsumer.fetchWeatherByCityName(city);
                    weatherResults[city] = data;

                    // Check if any weather value exceeds limits
                    if (
                        data.temperature < weatherLimits.Temperature.Min || data.temperature > weatherLimits.Temperature.Max ||
                        data.windSpeed < weatherLimits.Wind.Min || data.windSpeed > weatherLimits.Wind.Max ||
                        data.precipitation < weatherLimits.Precipitation.Min || data.precipitation > weatherLimits.Precipitation.Max ||
                        data.humidity < weatherLimits.Humidity.Min || data.humidity > weatherLimits.Humidity.Max ||
                        data.visibility < weatherLimits.Visibility.Min || data.visibility > weatherLimits.Visibility.Max
                    ) {
                        exceedsLimits = true; // Flag that the conditions exceed limits
                    }
                    else {
                        exceedsLimits = false;
                    }
                }

                setWeatherData(weatherResults);
                onExceedLimits(exceedsLimits); // Notify parent component
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [departureCity, arrivalCity, refreshKey, onExceedLimits]);

    if (loading) return <div>Loading weather data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="weather-table-container">
            <table className="weather-table">
                <thead>
                    <tr>
                        <th></th>
                        {cities.map((city) => (
                            <th key={city}>{city}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='text-center'>Temperature</td>
                        {cities.map((city) => (
                            <td key={`${city}-temperature`}>{weatherData[city]?.temperature}°C</td>
                        ))}
                    </tr>
                    <tr>
                        <td className='text-center'>Wind</td>
                        {cities.map((city) => (
                            <td key={`${city}-wind`}>{weatherData[city]?.windSpeed} KM/H</td>
                        ))}
                    </tr>
                    <tr>
                        <td className='text-center'>Precipitation</td>
                        {cities.map((city) => (
                            <td key={`${city}-precipitation`}>{weatherData[city]?.precipitation} mm</td>
                        ))}
                    </tr>
                    <tr>
                        <td className='text-center'>Humidity</td>
                        {cities.map((city) => (
                            <td key={`${city}-humidity`}>{weatherData[city]?.humidity}%</td>
                        ))}
                    </tr>
                    <tr>
                        <td className='text-center'>Visibility</td>
                        {cities.map((city) => (
                            <td key={`${city}-visibility`}>{weatherData[city]?.visibility} km</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default WeatherDisplay;
