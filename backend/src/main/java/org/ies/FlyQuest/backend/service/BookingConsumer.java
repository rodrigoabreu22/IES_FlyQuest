package org.ies.FlyQuest.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ies.FlyQuest.backend.repository.SeatRepository;
import org.ies.FlyQuest.backend.model.Seat;
import org.ies.FlyQuest.backend.model.SeatIdMessage;

@Service
public class BookingConsumer {
    private static final String TOPIC = "booking";
    private final SeatRepository seatRepository;

    @Autowired
    public BookingConsumer(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @KafkaListener(topics = TOPIC, groupId = "booking_listener")
    @Transactional
    public void consume(SeatIdMessage seat_message) {
        System.out.println("Received message: " + seat_message);
        try {

            Seat seat = seatRepository.findById(seat_message.getId()).orElse(null);
            if (seat != null) {
                   // Mark the seat as unavailable
                   seat.book();
                   seatRepository.save(seat);
                   System.out.println("Seat booking updated successfully.");
            } else {
                System.err.println("Seat not found: " + seat_message);
            }
        } catch (Exception e) {
            System.err.println("Error processing message: " + seat_message);
            e.printStackTrace();
        }
    }
}
