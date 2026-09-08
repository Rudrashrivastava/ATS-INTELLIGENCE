package com.resume.analyzer.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_results", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_primary_role", columnList = "primaryRole"),
    @Index(name = "idx_overall_score", columnList = "overallScore"),
    @Index(name = "idx_analysis_date", columnList = "analysisDate"),
    @Index(name = "idx_role_score", columnList = "primaryRole, overallScore DESC")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private String primaryRole;
    private Integer overallScore;
    private LocalDateTime analysisDate;

    @Column(columnDefinition = "LONGTEXT")
    private String recommendation;

    @Column(columnDefinition = "LONGTEXT")
    private String trajectoryJson;

    @Column(columnDefinition = "LONGTEXT")
    private String opportunitiesJson;

    @Column(columnDefinition = "LONGTEXT")
    private String resourcesJson; // NEW: AI-generated learning resources

    @Column(columnDefinition = "LONGTEXT")
    private String categoryScoresJson;

    @Column(columnDefinition = "LONGTEXT")
    private String strengths;

    @Column(columnDefinition = "LONGTEXT")
    private String weaknesses;

    private String modelSource; // NEW: Tracks if Mistral or Groq was used
}
