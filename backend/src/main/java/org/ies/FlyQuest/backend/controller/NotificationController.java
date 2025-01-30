package org.ies.FlyQuest.backend.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.ies.FlyQuest.backend.model.Notification;
import org.ies.FlyQuest.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/notification")
@Tag(name = "Notifications", description = "Endpoints for managing notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Operation(summary = "Get all notifications for a user", 
               description = "Retrieve all notifications for a specific user by their user ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully",
                content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    @GetMapping("/all/{user_id}")
    public List<Notification> getAllNotificationsByUserId(@PathVariable(value = "user_id") Long user_id) {
        return notificationService.getAllNotificationsByUserId(user_id);
    }

    @Operation(summary = "Mark a notification as read", 
               description = "Mark a specific notification as read using its notification ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read successfully",
                content = @Content(schema = @Schema(implementation = Notification.class))),
            @ApiResponse(responseCode = "404", description = "Notification not found", content = @Content)
    })
    @PutMapping("/{notification_id}")
    public Notification markNotificationAsRead(@PathVariable(value = "notification_id") Long notification_id) {
        return notificationService.markNotificationAsRead(notification_id);
    }

    @Operation(summary = "Delete a notification", 
               description = "Delete a specific notification by its notification ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Notification not found", content = @Content)
    })
    @DeleteMapping("/{notification_id}")
    public void deleteNotification(@PathVariable(value = "notification_id") Long notification_id) {
        notificationService.deleteNotification(notification_id);
    }
}
