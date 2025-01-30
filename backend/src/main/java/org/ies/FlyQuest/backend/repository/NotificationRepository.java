package org.ies.FlyQuest.backend.repository;

import java.util.List;
import org.ies.FlyQuest.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByNotifiedUserId(Long notifiedUserId);
    //notifications by user
}