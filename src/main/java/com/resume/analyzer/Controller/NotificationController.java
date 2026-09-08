package com.resume.analyzer.Controller;

import com.resume.analyzer.Model.OutreachNotification;
import com.resume.analyzer.Repository.NotificationRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @PostMapping("/dispatch")
    public ResponseEntity<?> dispatchOutreach(@RequestBody DispatchRequest request) {
        try {
            OutreachNotification notification = OutreachNotification.builder()
                    .candidateEmail(request.getCandidateEmail())
                    .recruiterName(request.getRecruiterName())
                    .recruiterEmail(request.getRecruiterEmail())
                    .companyName(request.getCompanyName())
                    .jobTitle(request.getJobTitle())
                    .subject(request.getSubject())
                    .message(request.getMessage())
                    .proposedSalary(request.getProposedSalary())
                    .createdAt(LocalDateTime.now())
                    .isRead(false)
                    .build();

            notificationRepository.save(notification);
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Outreach notification dispatched to " + request.getCandidateEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to dispatch notification: " + e.getMessage());
        }
    }

    @GetMapping("/my-notifications")
    public ResponseEntity<?> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<OutreachNotification> notifications = notificationRepository.findByCandidateEmailOrderByCreatedAtDesc(email);
        long unreadCount = notificationRepository.countByCandidateEmailAndIsReadFalse(email);

        return ResponseEntity.ok(java.util.Map.of(
            "notifications", notifications,
            "unreadCount", unreadCount
        ));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Optional<OutreachNotification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isPresent()) {
            OutreachNotification notif = notifOpt.get();
            notif.setRead(true);
            notificationRepository.save(notif);
            return ResponseEntity.ok("Marked as read");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/clear-all")
    public ResponseEntity<?> clearAll() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<OutreachNotification> list = notificationRepository.findByCandidateEmailOrderByCreatedAtDesc(email);
        notificationRepository.deleteAll(list);
        return ResponseEntity.ok("All notifications cleared");
    }
}

@Data
class DispatchRequest {
    private String candidateEmail;
    private String recruiterName;
    private String recruiterEmail;
    private String companyName;
    private String jobTitle;
    private String subject;
    private String message;
    private String proposedSalary;
}
