package org.ies.FlyQuest.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.ies.FlyQuest.backend.model.Crew;
import org.ies.FlyQuest.backend.model.Employee;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.repository.CrewRepository;
import org.ies.FlyQuest.backend.repository.FlightRepository;
import org.ies.FlyQuest.backend.repository.StaffRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import java.util.ArrayList;
import java.util.List;

@Service
public class StaffService implements UserDetailsService {
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private CrewRepository crewRepository;
    @Autowired
    private FlightRepository flightRepository;

    public List<Employee> getAllEmployees() {
        return staffRepository.findAll();
    }

    public List<Employee> getAllEmployeesByRole(String role) {
        List<Employee> employees = new ArrayList<>();
        for (Employee employee : staffRepository.findAll()) {
            if (employee.getRole().equalsIgnoreCase(role)) {
                employees.add(employee);
            }
        }
        return employees;
    }

    public Employee getEmployee(long id) {
        return staffRepository.findById(id).get();
    }

    public Employee updateEmployee(Long employee_id, Employee employee) {
        Employee emp2update = staffRepository.findById(employee_id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found!"));
        emp2update.setFirstName(employee.getFirstName());
        emp2update.setLastName(employee.getLastName());
        emp2update.setEmail(employee.getEmail());
        emp2update.setPhone(employee.getPhone());
        emp2update.setAddress(employee.getAddress());
        emp2update.setGender(employee.getGender());
        emp2update.setZip(employee.getZip());
        emp2update.setRole(employee.getRole());
        emp2update.setActive(employee.getActive());
        return staffRepository.save(emp2update);
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

    public List<Flight> getFlightsByEmployee(Employee employee) {
        List<Crew> employeeCrews = getCrewsByEmployee(employee);
        List<Flight> flights = getFlightsByCrews(employeeCrews);
        return flights;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return staffRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found with Email: " + email));
    }
}