package org.ies.FlyQuest.backend.repository;

import org.ies.FlyQuest.backend.model.CityWeather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityWeatherRepository extends JpaRepository<CityWeather, Long>{
    CityWeather findByCityName(String city_name);
}
