package org.ies.FlyQuest.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.ies.FlyQuest.backend.model.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByDepartureCity(String departure_city);
    List<Flight> findByArrivalCity(String arrival_city);
    List<Flight> findByPlaneId(long plane_id);
    List<Flight> findByCrewId(long crew_id);
    List<Flight> findByStatus(String status);
}
