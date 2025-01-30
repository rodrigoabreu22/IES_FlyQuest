package org.ies.FlyQuest.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity(name="seat")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "flight", referencedColumnName = "id")
    private Flight flight;

    @NotBlank(message = "Class is mandatory")
    @Column(name="class", nullable=false)
    private String flightClass;

    @NotNull(message = "Row is mandatory")
    @Column(name="row", nullable=true)
    private int row;

    @NotNull(message = "Column is mandatory")
    @Column(name="Letter", nullable=true)
    private char letter;

    @Column(name="available", nullable=true)
    private boolean available;

    // Constructor
    public Seat() {
        this.available = true;
    }

    public Seat(Flight flight, String flightClass, int row, char letter) {
        this.flight = flight;
        this.flightClass = flightClass;
        this.row = row;
        this.letter = letter;
        this.available = true;
    }

    // Getters and Setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public String getFlightClass() {
        return flightClass;
    }

    public void setFlightClass(String flight_class) {
        this.flightClass = flight_class;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public char getLetter() {
        return letter;
    }

    public void setLetter(char letter) {
        this.letter = letter;
    }

    public boolean isAvailable() {
        return available;
    }

    public void book() {
        this.available = false;
    }

    public void unbook() {
        this.available = true;
    }
}