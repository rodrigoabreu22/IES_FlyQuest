package org.ies.FlyQuest.backend.service;

import org.ies.FlyQuest.backend.model.Crew;
import org.ies.FlyQuest.backend.model.Notification;
import org.ies.FlyQuest.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationRepository.findByNotifiedUserId(userId);
    }

    public void deleteNotification(long id) {
        notificationRepository.deleteById(id);
    }

    public Notification markNotificationAsRead(Long notificationId) {
        Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setBeenRead(true);
            notification.setDate(new Date());
            return notificationRepository.save(notification);
        }
        return null;
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void newFligthInfoNotification(Crew crew, String message) {
        List<Long> crewIds = getCrewIds(crew);

        for (Long crewId : crewIds) {
            Notification newNotification = new Notification();
            newNotification.setNotifiedUserId(crewId);
            newNotification.setMessage(message);
            newNotification.setBeenRead(false);
            newNotification.setDate(new Date());
            saveNotification(newNotification);
        }
    }

    public void newRemoveStaffNotification(long staff_id, String message) {
        Notification newNotification = new Notification();
        newNotification.setNotifiedUserId(staff_id);
        newNotification.setMessage(message);
        newNotification.setBeenRead(false);
        newNotification.setDate(new Date());
        saveNotification(newNotification);
    }

    private List<Long> getCrewIds(Crew crew) {
        List<Long> crewIds = new ArrayList<Long>();
        crewIds.add(crew.getPilot());
        crewIds.add(crew.getCopilot());
        crewIds.add(crew.getAttendant1());
        crewIds.add(crew.getAttendant2());
        crewIds.add(crew.getAttendant3());
        crewIds.add(crew.getAttendant4());
        return crewIds;
    }
}
