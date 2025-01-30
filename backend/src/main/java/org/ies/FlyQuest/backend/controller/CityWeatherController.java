package org.ies.FlyQuest.backend.controller;

import jakarta.validation.Valid;

import io.jsonwebtoken.io.IOException;
import java.util.List;
import org.ies.FlyQuest.backend.model.CityWeather;
import org.ies.FlyQuest.backend.service.CityWeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/weather")
@Tag(name = "Weather", description = "Endpoints to manage weather data for cities")
public class CityWeatherController {

    @Autowired
    private CityWeatherService cityWeatherService;

    @Operation(summary = "Add a new city's weather", description = "Creates a new record for a city's weather data.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "City weather created successfully",
                content = @Content(schema = @Schema(implementation = CityWeather.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    })
    @PostMapping("/add")
    public CityWeather createCityWeather(@Valid @RequestBody CityWeather cityWeather) {
        return cityWeatherService.addCityWeather(cityWeather);
    }

    @Operation(summary = "Update weather data for a city", description = "Updates the weather data of an existing city based on its name.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "City weather updated successfully",
                content = @Content(schema = @Schema(implementation = CityWeather.class))),
            @ApiResponse(responseCode = "404", description = "City not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Failed to update city weather data", content = @Content)
    })
    @PutMapping("/{cityname}")
    public CityWeather updateCityWeather(@PathVariable(value = "cityname") String cityName, 
                                         @RequestBody CityWeather city) throws java.io.IOException {
        Long id = cityWeatherService.getWeatherByCityName(cityName).getId();

        try {
            CityWeather latestWeatherData = cityWeatherService.fetchWeatherData(city.getCityName(), city.getLatitude(), city.getLongitude());
            return cityWeatherService.updateCityWeather(id, latestWeatherData);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update city weather data", e);
        }
    }

    @Operation(summary = "Get weather data by city name", description = "Retrieve weather data for a specific city.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Weather data retrieved successfully",
                content = @Content(schema = @Schema(implementation = CityWeather.class))),
            @ApiResponse(responseCode = "404", description = "City not found", content = @Content)
    })
    @GetMapping("/{cityname}")
    public CityWeather getWeatherByCityName(@PathVariable(value = "cityname") String cityName) {
        return cityWeatherService.getWeatherByCityName(cityName);
    }

    @Operation(summary = "Get all cities' weather data", description = "Retrieve weather data for all cities.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Weather data for all cities retrieved successfully",
                content = @Content(schema = @Schema(implementation = CityWeather.class)))
    })
    @GetMapping("/all")
    public List<CityWeather> getAllCities() {
        return cityWeatherService.getCities();
    }
}
