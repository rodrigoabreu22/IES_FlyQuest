package org.ies.FlyQuest.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity(name="plane")
public class Plane {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "Number of business seats is mandatory")
    @Column(name="business_seats", nullable=false)
    private int business_seats;

    @NotNull(message = "Number of economic seats is mandatory")
    @Column(name="economic_seats", nullable=false)
    private int economic_seats;

    // Constructors
    public Plane() {
        this.business_seats = 30;
        this.economic_seats = 90;
    }

    public Plane(int business_seats, int economic_seats) {
        this.business_seats = business_seats;
        this.economic_seats = economic_seats;
    }

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getBusinessSeats() {
        return business_seats;
    }

    public void setBusinessSeats(int business_seats) {
        this.business_seats = business_seats;
    }

    public int getEconomicSeats() {
        return economic_seats;
    }

    public void setEconomicSeats(int economic_seats) {
        this.economic_seats = economic_seats;
    }
}