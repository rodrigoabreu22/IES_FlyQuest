package org.ies.FlyQuest.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ies.FlyQuest.backend.model.Employee;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/staff")
@Tag(name = "Staff", description = "Endpoints for managing staff and their assigned flights")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Operation(summary = "Get all employees", description = "Retrieve a list of all employees, optionally filtered by role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employees retrieved successfully",
                content = @Content(schema = @Schema(implementation = Employee.class))),
            @ApiResponse(responseCode = "404", description = "No employees found", content = @Content)
    })
    @GetMapping("/all")
    public List<Employee> getAllEmployees(@RequestParam(required = false) String role) {
        if (role == null) {
            return staffService.getAllEmployees();
        }
        return staffService.getAllEmployeesByRole(role);
    }

    @Operation(summary = "Get an employee by ID", description = "Retrieve details of a specific employee by their ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee retrieved successfully",
                content = @Content(schema = @Schema(implementation = Employee.class))),
            @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content)
    })
    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable(value = "id") Long employee_id) {
        return staffService.getEmployee(employee_id);
    }

    @Operation(summary = "Update an employee", description = "Update the details of an existing employee by their ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employee updated successfully",
                content = @Content(schema = @Schema(implementation = Employee.class))),
            @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content)
    })
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable(value = "id") Long employee_id, @RequestBody Employee employee) {
        return staffService.updateEmployee(employee_id, employee);
    }

    @Operation(summary = "Get all flights assigned to an employee", description = "Retrieve all flights assigned to a specific employee.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Flights retrieved successfully",
                content = @Content(schema = @Schema(implementation = Flight.class))),
            @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content)
    })
    @GetMapping("/{id}/flights")
    public List<Flight> getFlights(@PathVariable(value = "id") Long employee_id) {
        Employee employee = staffService.getEmployee(employee_id);
        return staffService.getFlightsByEmployee(employee);
    }

}
