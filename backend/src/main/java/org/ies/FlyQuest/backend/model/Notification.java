package org.ies.FlyQuest.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity(name = "notification")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "notified_user_id", nullable = false)
    private Long notifiedUserId;
    
    @Column(name = "message", nullable = false)
    private String message;
    
    @Column(name = "date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    
    @Column(name = "been_read", nullable = false)
    private Boolean beenRead;

    public Notification() {}

    public Notification(Long notifiedUserId, String message) {
        this.notifiedUserId = notifiedUserId;
        this.message = message;
        this.beenRead = false;
        this.date = new Date(); // Afinal afinal deve ser preciso isto
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNotifiedUserId() {
        return notifiedUserId;
    }

    public void setNotifiedUserId(Long notifiedUserId) {
        this.notifiedUserId = notifiedUserId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Boolean getBeenRead() {
        return beenRead;
    }

    public void setBeenRead(Boolean beenRead) {
        this.beenRead = beenRead;
    }
}