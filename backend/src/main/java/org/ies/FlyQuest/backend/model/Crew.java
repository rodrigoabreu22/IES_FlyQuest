package org.ies.FlyQuest.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;

@Entity(name="crew")
public class Crew {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "Pilot is mandatory")
    @Column(name="pilot_id", nullable=false)
    private long pilotId;

    @NotNull(message = "Copilot is mandatory")
    @Column(name="copilot_id", nullable=false)
    private long copilotId;

    @NotNull(message = "Attendant is mandatory")
    @Column(name="attendent1_id", nullable=false)
    private long attendant1Id;

    @NotNull(message = "Attendant is mandatory")
    @Column(name="attendent2_id", nullable=false)
    private long attendant2Id;

    @NotNull(message = "Attendant is mandatory")
    @Column(name="attendent3_id", nullable=false)
    private long attendant3Id;

    @NotNull(message = "Attendant is mandatory")
    @Column(name="attendent4_id", nullable=false)
    private long attendant4Id;

    @OneToMany(mappedBy = "crew")
    private List<Flight> flights = new ArrayList<>();

    // Getters and Setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getPilot() {
        return pilotId;
    }

    public void setPilot(long pilot_id) {
        this.pilotId = pilot_id;
    }

    public long getCopilot() {
        return copilotId;
    }

    public void setCopilot(long copilot_id) {
        this.copilotId = copilot_id;
    }

    public long getAttendant1() {
        return attendant1Id;
    }

    public void setAttendant1(long attendant1_id) {
        this.attendant1Id = attendant1_id;
    }

    public long getAttendant2() {
        return attendant2Id;
    }

    public void setAttendant2(long attendant2_id) {
        this.attendant2Id = attendant2_id;
    }

    public long getAttendant3() {
        return attendant3Id;
    }

    public void setAttendant3(long attendant3_id) {
        this.attendant3Id = attendant3_id;
    }

    public long getAttendant4() {
        return attendant4Id;
    }

    public void setAttendant4(long attendant4_id) {
        this.attendant4Id = attendant4_id;
    }
}
