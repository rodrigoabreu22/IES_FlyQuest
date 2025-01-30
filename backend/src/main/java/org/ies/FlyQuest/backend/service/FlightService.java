package org.ies.FlyQuest.backend.service;

import java.util.ArrayList;
import java.util.List;
import org.ies.FlyQuest.backend.model.Crew;
import org.ies.FlyQuest.backend.model.Employee;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.model.Plane;
import org.ies.FlyQuest.backend.model.Seat;
import org.ies.FlyQuest.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private CrewRepository crewRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PlaneRepository planeRepository;

    @Autowired
    private NotificationService notificationService;
    
    public Flight saveFlight(Flight f) {
        Crew crew = f.getCrew();
        crewRepository.save(crew);

        Flight flight = flightRepository.save(f);

        String message = "You been added to a new flight (ID: " + flight.getId() + ") scheduled from " + flight.getDepartureCity() + " on " + flight.getDepartureDate()  + " to " + flight.getArrivalCity() + " on " + flight.getArrivalDate();
        notificationService.newFligthInfoNotification(crew, message);

        char column[] = {'A', 'B', 'C', 'D', 'E', 'F'};

        for (int i = 1; i <= 5; i++) {
            for (int j = 0; j < 6; j++) {
                Seat seat = new Seat(flight, "Business", i, column[j]);
                seatRepository.save(seat);
            }
        }

        for (int i = 5 + 1; i <= 20; i++) {
            for (int j = 0; j < 6; j++) {
                Seat seat = new Seat(flight, "Economic", i, column[j]);
                seatRepository.save(seat);
            }
        }

        return flight;
    }

    public List<Flight> getFlights(String status) {
        if (status == null) {
            return flightRepository.findAll();
        }
        return flightRepository.findByStatus(status);
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Flight not found!"));
    }

    //adicionar funções para filtrar os voos segundo a interface

    public Flight cancelFlight(long flight_id) {
        Flight flight = getFlightById(flight_id);
        flight.setStatus("CANCELED");

        //notificar tripulantes
        String message = "Flight (ID: " + flight.getId() + ") scheduled from " + flight.getDepartureCity() + " on " + flight.getDepartureDate()  + " to " + flight.getArrivalCity() + " on " + flight.getArrivalDate() + " has been canceled.";
        notificationService.newFligthInfoNotification(flight.getCrew(), message);

        return flightRepository.save(flight);
    }

    public Flight updateFlight(long flight_id, Flight flight) {
        Flight existingFlight = flightRepository.findById(flight_id).orElseThrow(() -> new EntityNotFoundException("Flight not found!"));
        existingFlight.setDepartureCity(flight.getDepartureCity());
        existingFlight.setArrivalCity(flight.getArrivalCity());
        existingFlight.setDepartureDate(flight.getDepartureDate());
        existingFlight.setArrivalDate(flight.getArrivalDate());
        existingFlight.setPlane(flight.getPlane());
        existingFlight.setStatus(flight.getStatus());
        existingFlight.setArrivalCountry(flight.getArrivalCountry());
        existingFlight.setDepartureCountry(flight.getDepartureCountry());
        existingFlight.setOccupationBusiness(flight.getOccupationBusiness());
        existingFlight.setOccupationEconomic(flight.getOccupationEconomic());
        return flightRepository.save(existingFlight);
    }

    public List<Flight> getFlightsByDepartureCity(String departure_city) {
        return flightRepository.findByDepartureCity(departure_city);
    }

    public List<Flight> getFlightsByArrivalCity(String arrival_city) {
        return flightRepository.findByArrivalCity(arrival_city);
    }
 
    //functions to get city id
    public String getDepartureCity(long id) {
        Flight flight = getFlightById(id);
        return flight.getDepartureCity();
    }

    public String getArrivalCity(long id) {
        Flight flight = getFlightById(id);
        return flight.getArrivalCity();
    }

    //functions to get seats
    public List<Seat> getSeatsByFlight(long flight_id) {
        Flight flight = getFlightById(flight_id);
        return seatRepository.findByFlight(flight);
    }

    public List<Seat> getAvailableSeatsByFlight(long flight_id) {
        Flight flight = getFlightById(flight_id);
        return seatRepository.findByFlightAndAvailable(flight, true);
    }

    public List<Seat> getSeatsByFlightClass(long flight_id, String flightClass) {
        Flight flight = getFlightById(flight_id);
        return seatRepository.findByFlightAndFlightClass(flight, flightClass);
    }

    public int getSeatsOccupiedByClass(long flight_id, String flightClass) {
        Flight flight = getFlightById(flight_id);
        return seatRepository.findByFlightAndFlightClassAndAvailable(flight, flightClass, false).size();
    }

    public Seat updateSeatAvailability(Seat seat) {
        Seat existingSeat = seatRepository.findById(seat.getId()).orElseThrow(() -> new EntityNotFoundException("Seat not found!"));
        Flight existingFlight = existingSeat.getFlight();

        try{
            existingSeat.book();

            if (existingSeat.getFlightClass().equals("Business")) {
                existingFlight.setOccupationBusiness(existingFlight.getOccupationBusiness() + 1);
            } 
            else {
                existingFlight.setOccupationEconomic(existingFlight.getOccupationEconomic() + 1);
            }

            flightRepository.save(existingFlight);
            return seatRepository.save(existingSeat);
        }
        catch(Exception e){
            return null;
        }
    }

    //functions to get crew
    public List<Employee> getPilotsByFlight(long flight_id) {
        Flight flight = getFlightById(flight_id);
        Crew crew = flight.getCrew();

        List<Long> pilots = new ArrayList<Long>();
        pilots.add(crew.getPilot());
        pilots.add(crew.getCopilot());

        List<Employee> employees = new ArrayList<Employee>();
        for (long id : pilots) {
            Employee emp = staffRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Staff not found!"));
            employees.add(emp);
        }
        
        return employees;
    }

    public List<Employee> getAttendantsByFlight(long flight_id) {
        Flight flight = getFlightById(flight_id);
        Crew crew = flight.getCrew();

        List<Long> attendants = new ArrayList<Long>();
        attendants.add(crew.getAttendant1());
        attendants.add(crew.getAttendant2());
        attendants.add(crew.getAttendant3());
        attendants.add(crew.getAttendant4());
        
        List<Employee> employees = new ArrayList<Employee>();
        for (long id : attendants) {
            Employee emp = staffRepository.findById(id).orElse(null);
            employees.add(emp);
        }

        return employees;
    }

    public Crew updateCrew(long flight_id, long employee_id, Crew crew) {
        Flight flight = getFlightById(flight_id);
        Crew existingCrew = crewRepository.findByFlights(flight);
        existingCrew.setPilot(crew.getPilot());
        existingCrew.setCopilot(crew.getCopilot());
        existingCrew.setAttendant1(crew.getAttendant1());
        existingCrew.setAttendant2(crew.getAttendant2());
        existingCrew.setAttendant3(crew.getAttendant3());
        existingCrew.setAttendant4(crew.getAttendant4());

        //notificar tripulante removido
        String message = "You been removed from flight (ID: " + flight.getId() + ") scheduled from " + flight.getDepartureCity() + " on " + flight.getDepartureDate()  + " to " + flight.getArrivalCity() + " on " + flight.getArrivalDate();
        notificationService.newRemoveStaffNotification(employee_id, message);

        //notificar crew das mudanças
        message = "Your flight crew has been updated. Check the new crew members.";
        notificationService.newFligthInfoNotification(existingCrew, message);

        return crewRepository.save(existingCrew);
    }

    public Plane getPlaneByFlight(long flight_id) {
        Flight flight = getFlightById(flight_id);
        long plane_id = flight.getPlane();
        return planeRepository.findById(plane_id).orElseThrow(() -> new EntityNotFoundException("Plane not found!"));
    }

    public List<Crew> getCrewsByEmployee(Employee employee) {
        List<Crew> crews = new ArrayList<>();

        switch (employee.getRole()) {

            case "Pilot":
                List<Crew> crew = crewRepository.findByPilotId(employee.getId());
                if (crew != null) {
                    crews.addAll(crew);
                }
                crew = crewRepository.findByCopilotId(employee.getId());
                if (crew != null) {
                    crews.addAll(crew);
                }
                return crews;

            case "Flight Attendant":
                List<Crew> creww = crewRepository.findByAttendant1Id(employee.getId());
                if (creww != null) {
                    crews.addAll(creww);
                }
                creww = crewRepository.findByAttendant2Id(employee.getId());
                if (creww != null) {
                    crews.addAll(creww);
                }
                creww = crewRepository.findByAttendant3Id(employee.getId());
                if (creww != null) {
                    crews.addAll(creww);
                }
                creww = crewRepository.findByAttendant4Id(employee.getId());
                if (creww != null) {
                    crews.addAll(creww);
                }
                return crews;

            default:
                break;
        }
        return null;
    }

    public List<Flight> getFlightsByCrews(List<Crew> crews) {
        List<Flight> flights = new ArrayList<>();
        for (Crew crew : crews) {
            List<Flight> crew_flights = flightRepository.findByCrewId(crew.getId());
            if (crew_flights != null) {
                flights.addAll(crew_flights);
            }
        }
        return flights;
    }

}
