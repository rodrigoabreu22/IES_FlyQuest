package org.ies.FlyQuest.backend.service;

import org.ies.FlyQuest.backend.model.CityWeather;
import org.ies.FlyQuest.backend.repository.CityWeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.io.IOException;
import okhttp3.Request;
import okhttp3.Response;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.text.ParseException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Service
public class CityWeatherService {
    @Autowired
    private CityWeatherRepository cityWeatherRepository;

    @Value("${tomorrow.url}")
    private String apiUrl;

    @Value("${tomorrow.api_key}")
    private String apiKey ;


    private final okhttp3.OkHttpClient httpClient = new okhttp3.OkHttpClient();

    public CityWeather addCityWeather(CityWeather cityWeather) {
        return cityWeatherRepository.save(cityWeather);
    }

    public List<CityWeather> getCities() {
        return cityWeatherRepository.findAll();
    }

    public CityWeather updateCityWeather(Long id, CityWeather cityWeather) {
        Optional<CityWeather> existingCityWeather = cityWeatherRepository.findById(id);
        if (existingCityWeather.isPresent()) {
            CityWeather updatedCityWeather = existingCityWeather.get();
            updatedCityWeather.setCityName(cityWeather.getCityName());
            updatedCityWeather.setDate(cityWeather.getDate());
            updatedCityWeather.setLatitude(cityWeather.getLatitude());
            updatedCityWeather.setLongitude(cityWeather.getLongitude());
            updatedCityWeather.setTemperature(cityWeather.getTemperature());
            updatedCityWeather.setWindSpeed(cityWeather.getWindSpeed());
            updatedCityWeather.setPrecipitation(cityWeather.getPrecipitation());
            updatedCityWeather.setHumidity(cityWeather.getHumidity());
            updatedCityWeather.setVisibility(cityWeather.getVisibility());
            return cityWeatherRepository.save(updatedCityWeather);
        }
        return null;
    }

    public CityWeather fetchWeatherData(String cityName, double latitude, double longitude) throws IOException, java.io.IOException {
        String url = String.format(Locale.US, "%s?location=%f,%f&apikey=%s", apiUrl, latitude, longitude, apiKey);

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("accept", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String jsonResponse = response.body().string();
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode root = objectMapper.readTree(jsonResponse);

                JsonNode dataNode = root.at("/data");
                JsonNode locationNode = root.at("/location");

                CityWeather cityWeather = new CityWeather();
                cityWeather.setCityName(cityName);
                cityWeather.setLatitude(locationNode.get("lat").asDouble());
                cityWeather.setLongitude(locationNode.get("lon").asDouble());

                String timeStr = dataNode.get("time").asText();
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                Date date = dateFormat.parse(timeStr);
                cityWeather.setDate(date);

                JsonNode values = dataNode.get("values");
                cityWeather.setTemperature(values.get("temperature").asDouble());
                cityWeather.setWindSpeed(values.get("windSpeed").asDouble());
                cityWeather.setPrecipitation(values.get("rainIntensity").asDouble());
                cityWeather.setHumidity(values.get("humidity").asDouble());
                cityWeather.setVisibility(values.get("visibility").asDouble());

                return cityWeather;
            } else {
                throw new IOException("Failed to fetch weather data: " + response);
            }
        } catch (ParseException e) {
            throw new IOException("Failed to parse date from API response", e);
        }
    }


    public CityWeather getWeatherByCityName(String cityName) {
        return cityWeatherRepository.findByCityName(cityName);
    }

    
}
