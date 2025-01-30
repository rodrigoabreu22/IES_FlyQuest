package org.ies.FlyQuest.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.ies.FlyQuest.backend.model.Crew;
import org.ies.FlyQuest.backend.model.Employee;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.model.Plane;
import org.ies.FlyQuest.backend.model.Seat;
import org.ies.FlyQuest.backend.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/flight")
@Tag(name = "Flights", description = "Endpoints for managing flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @Operation(summary = "Add a new flight", description = "Create a new flight and save it to the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flight created successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "400", description = "Invalid flight details", content = @Content)
    })
    @PostMapping("/add")
    public Flight createFlight(@Valid @RequestBody Flight flight) {
        return flightService.saveFlight(flight);
    }

    @Operation(summary = "Get all flights", description = "Retrieve a list of all flights, optionally filtered by status.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flights retrieved successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "404", description = "No flights found", content = @Content)
    })
    @GetMapping("/all")
    public List<Flight> getAllFlights(@RequestParam(required = false) String status) {
        return flightService.getFlights(status);
    }

    @Operation(summary = "Get a flight by ID", description = "Retrieve details of a specific flight by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flight retrieved successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}")
    public Flight getFlight(@PathVariable(value = "id") Long flight_id) {
        return flightService.getFlightById(flight_id);
    }

    @Operation(summary = "Update a flight", description = "Update the details of an existing flight by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flight updated successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable(value = "id") Long flight_id, @RequestBody Flight flight) {
        return flightService.updateFlight(flight_id, flight);
    }

    @Operation(summary = "Cancel a flight", description = "Cancel a specific flight by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flight canceled successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @PutMapping("/{id}/cancel")
    public Flight cancelFlight(@PathVariable(value = "id") Long flight_id) {
        return flightService.cancelFlight(flight_id);
    }

    @Operation(summary = "Get pilots for a flight", description = "Retrieve a list of pilots assigned to a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pilots retrieved successfully",
                content = @Content(schema = @Schema(implementation = Employee.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/pilots")
    public List<Employee> getPilots(@PathVariable(value = "id") Long flight_id) {
        return flightService.getPilotsByFlight(flight_id);
    }

    @Operation(summary = "Get attendants for a flight", description = "Retrieve a list of attendants assigned to a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attendants retrieved successfully",
                content = @Content(schema = @Schema(implementation = Employee.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/attendants")
    public List<Employee> getAttendants(@PathVariable(value = "id") Long flight_id) {
        return flightService.getAttendantsByFlight(flight_id);
    }

    @Operation(summary = "Get the plane for a flight", description = "Retrieve the plane assigned to a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plane retrieved successfully",
                content = @Content(schema = @Schema(implementation = Plane.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/plane")
    public Plane getPlane(@PathVariable(value = "id") Long flight_id) {
        return flightService.getPlaneByFlight(flight_id);
    }

    @Operation(summary = "Get departure city", description = "Retrieve the departure city of a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Departure city retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/departCity")
    public String getDepartCity(@PathVariable(value = "id") Long flight_id) {
        return flightService.getDepartureCity(flight_id);
    }

    @Operation(summary = "Get arrival city", description = "Retrieve the arrival city of a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Arrival city retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/arrivalCity")
    public String getArrivalCity(@PathVariable(value = "id") Long flight_id) {
        return flightService.getArrivalCity(flight_id);
    }

    @Operation(summary = "Update flight crew", description = "Update the crew details for a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Crew updated successfully",
                content = @Content(schema = @Schema(implementation = Crew.class))),
            @ApiResponse(responseCode = "404", description = "Flight or crew member not found", content = @Content)
    })
    @PutMapping("/{id}/crew/{employee_id}")
    public Crew updateCrew(@PathVariable(value = "id") Long flight_id, 
                           @PathVariable(value = "employee_id") Long employee_id, 
                           @RequestBody Crew crew) {
        return flightService.updateCrew(flight_id, employee_id, crew);
    }

    @Operation(summary = "Get seats for a flight", description = "Retrieve a list of seats for a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Seats retrieved successfully",
                content = @Content(schema = @Schema(implementation = Seat.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/seats")
    public List<Seat> getSeats(@PathVariable(value = "id") Long flight_id, @RequestParam(required = false) String flightClass) {
        if (flightClass == null) {
            return flightService.getSeatsByFlight(flight_id);
        }
        return flightService.getSeatsByFlightClass(flight_id, flightClass);
    }

    @Operation(summary = "Get available seats", description = "Retrieve all available seats for a specific flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Available seats retrieved successfully",
                content = @Content(schema = @Schema(implementation = Seat.class))),
            @ApiResponse(responseCode = "404", description = "Flight not found", content = @Content)
    })
    @GetMapping("/{id}/seats/available")
    public List<Seat> getAvailableSeats(@PathVariable(value = "id") Long flight_id) {
        return flightService.getAvailableSeatsByFlight(flight_id);
    }

    @Operation(summary = "Update seat availability", description = "Update the availability of a specific seat for a flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Seat availability updated successfully",
                content = @Content(schema = @Schema(implementation = Seat.class))),
            @ApiResponse(responseCode = "404", description = "Flight or seat not found", content = @Content)
    })
    @PutMapping("{id}/seat")
    public Seat updateSeat(@PathVariable(value = "id") Long flight_id, @RequestBody Seat seat) {
        return flightService.updateSeatAvailability(seat);
    }

    @Operation(summary = "Get occupied seats by class", description = "Retrieve the number of occupied seats for a specific class in a flight.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Occupied seats by class retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Flight or class not found", content = @Content)
    })
    @GetMapping("/{id}/seats/{flightClass}/occupied")
    public int getOccupiedSeatsByClass(@PathVariable(value = "id") Long flight_id, @PathVariable(value = "flightClass") String flightClass) {
        return flightService.getSeatsOccupiedByClass(flight_id, flightClass);
    }
    
}
