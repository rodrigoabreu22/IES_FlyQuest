package org.ies.FlyQuest.backend.repository;


import org.ies.FlyQuest.backend.model.Plane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaneRepository extends JpaRepository<Plane, Long>{
}