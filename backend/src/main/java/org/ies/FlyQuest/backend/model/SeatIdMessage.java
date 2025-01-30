package org.ies.FlyQuest.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SeatIdMessage {
    private long seatId;

    public SeatIdMessage(){}

    @JsonCreator
    public SeatIdMessage(@JsonProperty("id") long id) {
        this.seatId = id;
    }

    public void setId(long seatId) {
        this.seatId = seatId;
    }

    public long getId() {
        return seatId;
    }
}