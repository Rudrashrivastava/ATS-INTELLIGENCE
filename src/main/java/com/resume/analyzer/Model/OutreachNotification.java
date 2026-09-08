package com.resume.analyzer.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "outreach_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutreachNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String candidateEmail;

    @Column(nullable = false)
    private String recruiterName;

    @Column(nullable = false)
    private String recruiterEmail;

    private String companyName;

    private String jobTitle;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String proposedSalary;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private boolean isRead = false;
}
