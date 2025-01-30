package org.ies.FlyQuest.backend.repository;

import java.util.List;
import java.util.Optional;

import org.ies.FlyQuest.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Employee, Long>{
    Optional<Employee> findByEmail(String email);
    List<Employee> findByRole(String role);
}
