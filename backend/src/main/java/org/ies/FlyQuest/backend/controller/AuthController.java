package org.ies.FlyQuest.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ies.FlyQuest.backend.model.Employee;
import org.ies.FlyQuest.backend.repository.StaffRepository;
import org.ies.FlyQuest.backend.security.JwtResponse;
import org.ies.FlyQuest.backend.security.JwtUtils;
import org.ies.FlyQuest.backend.security.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and account management")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(summary = "Authenticate user", description = "Authenticate user using email and password, and return a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated", 
                content = @Content(schema = @Schema(implementation = JwtResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid email/password supplied", 
                content = @Content),
            @ApiResponse(responseCode = "500", description = "Server error", 
                content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            String jwt = jwtUtils.generateJwtToken(authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Employee user = staffRepository.findByEmail(loginRequest.getEmail()).get();

            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), user.getRole()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email/password supplied!");
        }
    }

    @Operation(summary = "Create a new account", description = "Create a new user account and return a JWT token upon successful registration")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Account created successfully",
                content = @Content(schema = @Schema(implementation = JwtResponse.class))),
            @ApiResponse(responseCode = "400", description = "Email is already in use",
                content = @Content),
            @ApiResponse(responseCode = "500", description = "Server error",
                content = @Content)
    })
    @PostMapping("/createAccount")
    public ResponseEntity<?> createAccount(@Valid @RequestBody Employee employee) {
        if (staffRepository.findByEmail(employee.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        String unencryptedPassword = employee.getPassword();
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        staffRepository.save(employee);

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(employee.getEmail(), unencryptedPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt, employee.getId(), employee.getEmail(), employee.getRole()));
    }
}
