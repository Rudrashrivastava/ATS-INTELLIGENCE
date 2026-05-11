package com.resume.analyzer.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_results")
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
}
