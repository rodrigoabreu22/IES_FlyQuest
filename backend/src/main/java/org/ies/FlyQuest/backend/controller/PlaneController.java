package org.ies.FlyQuest.backend.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.model.Plane;
import org.ies.FlyQuest.backend.service.PlaneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/plane")
@Tag(name = "Planes", description = "Endpoints for managing planes")
public class PlaneController {

    @Autowired
    private PlaneService planeService;

    @Operation(summary = "Add a new plane", description = "Create a new plane and save it to the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plane created successfully",
                content = @Content(schema = @Schema(implementation = Plane.class))),
            @ApiResponse(responseCode = "400", description = "Invalid plane details", content = @Content)
    })
    @PostMapping("/add")
    public Plane createPlane(@Valid @RequestBody Plane plane) {
        return planeService.savePlane(plane);
    }

    @Operation(summary = "Get all planes", description = "Retrieve a list of all planes in the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Planes retrieved successfully",
                content = @Content(schema = @Schema(implementation = Plane.class))),
            @ApiResponse(responseCode = "404", description = "No planes found", content = @Content)
    })
    @GetMapping("/all")
    public List<Plane> getPlaneAll() {
        return planeService.getPlaneAll();
    }

    @Operation(summary = "Get a plane by ID", description = "Retrieve a specific plane by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plane retrieved successfully",
                content = @Content(schema = @Schema(implementation = Plane.class))),
            @ApiResponse(responseCode = "404", description = "Plane not found", content = @Content)
    })
    @GetMapping("/{id}")
    public Plane getPlaneById(@PathVariable long id) {
        return planeService.getPlaneById(id);
    }

    @Operation(summary = "Get all flights for a plane", description = "Retrieve a list of all flights associated with a specific plane by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flights retrieved successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "404", description = "Plane not found", content = @Content)
    })
    @GetMapping("/{id}/flights")
    public List<Flight> getAllFlightsByPlaneId(@PathVariable long id) {
        return planeService.getFlightsByPlaneId(id);
    }
}
