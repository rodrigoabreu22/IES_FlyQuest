package org.ies.FlyQuest.backend.security;

import org.ies.FlyQuest.backend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class Authentication {
    @Value("${app.allowOrigin}")
    private String origin;

    @Autowired
    private StaffService staffService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(staffService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                        .requestMatchers(
                                            "/swagger-ui/**", 
                                            "/v3/api-docs/**", 
                                            "/swagger-ui.html", 
                                            "/v3/api-docs.yaml"
                                        ).permitAll()
                                        .requestMatchers("/api/v1/auth/**").permitAll()
                                        .requestMatchers("/api/v1/plane/**").permitAll()
                                        .requestMatchers("/api/v1/flight/**").permitAll()
                                        .requestMatchers("/api/v1/staff/**").permitAll()
                                        .requestMatchers("/api/v1/weather/**").permitAll()
                                        .requestMatchers("/api/v1/notification/**").permitAll()
                                        .requestMatchers("/actuator/**").permitAll()
                                        .anyRequest().authenticated());
                    
                        http.authenticationProvider(authenticationProvider());
                    
                        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
                    
                        return http.build();
                    }
                
                    @Bean
                    public CorsConfigurationSource corsConfigurationSource() {
                        CorsConfiguration configuration = new CorsConfiguration();
                        configuration.addAllowedOrigin("http://localhost:3000"); 
                        configuration.addAllowedOrigin("http://localhost:8090"); 
                        configuration.addAllowedOrigin("http://deti-ies-05.ua.pt:3000");
                        configuration.addAllowedOrigin("http://deti-ies-05.ua.pt:8090");
                        configuration.addAllowedOrigin(origin);
                        configuration.addAllowedMethod("*"); 
                        configuration.addAllowedHeader("*"); 
                        configuration.setAllowCredentials(true); 
                    
                        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                        source.registerCorsConfiguration("/**", configuration); 
                        return source;
                    }
}
