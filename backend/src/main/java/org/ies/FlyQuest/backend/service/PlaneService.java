package org.ies.FlyQuest.backend.service;

import java.util.List;
import org.ies.FlyQuest.backend.model.Flight;
import org.ies.FlyQuest.backend.model.Plane;
import org.ies.FlyQuest.backend.repository.FlightRepository;
import org.ies.FlyQuest.backend.repository.PlaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;


@Service
public class PlaneService {

    @Autowired
    private PlaneRepository planeRepository;

    @Autowired
    private FlightRepository flightRepository;


    public Plane savePlane(Plane plane){
        return planeRepository.save(plane);
    }

    public List<Plane> getPlaneAll(){
        return planeRepository.findAll();
    }

    public Plane getPlaneById(long id){
        Plane plane = planeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Plane not found!"));
        return plane;
    }

    public List<Flight> getFlightsByPlaneId(long Plane_id){
        return flightRepository.findByPlaneId(Plane_id);

    }
    
}
