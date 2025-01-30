package org.ies.FlyQuest.backend.webconfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    @Value("${app.allowOrigin}")
    private String origin;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") 
                        .allowedOrigins(origin) 
                        .allowedOrigins("http://deti-ies-05.ua.pt:3000")
                        .allowedOrigins("http://deti-ies-05.ua.pt:8090")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                        .allowedHeaders("*") 
                        .exposedHeaders("Authorization") 
                        .allowCredentials(true); 
            }
        };
    }
}
