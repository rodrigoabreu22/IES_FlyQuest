package org.ies.FlyQuest.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.model.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByFlight(Flight flight);
    List<Seat> findByFlightAndAvailable(Flight flight, boolean available);
    List<Seat> findByFlightAndFlightClass(Flight flight, String flightClass);
    List<Seat> findByFlightAndFlightClassAndAvailable(Flight flight, String flightClass, boolean available);
}
