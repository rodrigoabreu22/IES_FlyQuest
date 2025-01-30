package org.ies.FlyQuest.backend.repository;

import java.util.List;
import org.ies.FlyQuest.backend.model.Crew;
import org.ies.FlyQuest.backend.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrewRepository extends JpaRepository<Crew, Long> {
    Crew findByFlights(Flight flight);
    List<Crew> findByPilotId(long crewMember);
    List<Crew> findByCopilotId(long crewMember);
    List<Crew> findByAttendant1Id(long crewMember);
    List<Crew> findByAttendant2Id(long crewMember);
    List<Crew> findByAttendant3Id(long crewMember);
    List<Crew> findByAttendant4Id(long crewMember);
}
