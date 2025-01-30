package org.ies.FlyQuest.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name="flight")
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Arrival city is mandatory")
    @Column(name = "arrivalCity", nullable = false)
    private String arrivalCity;

    @NotBlank(message = "Departure city is mandatory")
    @Column(name = "departureCity", nullable = false)
    private String departureCity;

    @NotBlank(message = "Arrival country is mandatory")
    @Column(name = "arrival_country", nullable = false)
    private String arrival_country;

    @NotBlank(message = "Departure country is mandatory")
    @Column(name = "departure_country", nullable = false)
    private String departure_country;

    @NotNull(message = "Arrival date is mandatory")
    @Column(name = "arrival_date", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime arrival_date;

    @NotNull(message = "Departure date is mandatory")
    @Column(name = "departure_date", nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime departure_date;

    @NotNull(message = "Business occupation is mandatory")
    @Column(name = "occupation_business", nullable = false)
    private int occupation_business;

    @NotNull(message = "Economic occupation is mandatory")
    @Column(name = "occupation_economic", nullable = false)
    private int occupation_economic;

    @NotNull(message = "Status occupation is mandatory")
    @Column(name = "status", nullable = false)
    private String status;

    @NotNull(message = "Plane is mandatory")
    @Column(name = "plane_id", nullable = false)
    private long planeId;

    @ManyToOne
    @NotNull(message = "Crew is mandatory")
    @JoinColumn(name = "crew", referencedColumnName = "id")
    private Crew crew;

    @OneToMany(mappedBy = "flight")
    private List<Seat> seats = new ArrayList<>();

    // Constructors
    public Flight(){
        this.status="SCHEDULED";
        this.occupation_business=0;
        this.occupation_economic=0;
    }

    // Getters and Setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getArrivalCity() {
        return arrivalCity;
    }

    public void setArrivalCity(String arrival_city) {
        this.arrivalCity = arrival_city;
    }

    public String getDepartureCity() {
        return departureCity;
    }

    public void setDepartureCity(String departure_city) {
        this.departureCity = departure_city;
    }

    public String getArrivalCountry() {
        return arrival_country;
    }

    public void setArrivalCountry(String arrival_country) {
        this.arrival_country = arrival_country;
    }

    public String getDepartureCountry() {
        return departure_country;
    }

    public void setDepartureCountry(String departure_country) {
        this.departure_country = departure_country;
    }

    public LocalDateTime getArrivalDate() {
        return arrival_date;
    }

    public void setArrivalDate(LocalDateTime arrival_date) {
        this.arrival_date = arrival_date;
    }

    public LocalDateTime getDepartureDate() {
        return departure_date;
    }

    public void setDepartureDate(LocalDateTime departure_date) {
        this.departure_date = departure_date;
    }

    public int getOccupationBusiness() {
        return occupation_business;
    }

    public void setOccupationBusiness(int occupation_business) {
        this.occupation_business = occupation_business;
    }

    public int getOccupationEconomic() {
        return occupation_economic;
    }

    public void setOccupationEconomic(int occupation_economic) {
        this.occupation_economic = occupation_economic;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getPlane() {
        return planeId;
    }

    public void setPlane(long plane_id) {
        this.planeId = plane_id;
    }

    public Crew getCrew() {
        return crew;
    }

    public void setCrew(Crew crew) {
        this.crew = crew;
    }
}


