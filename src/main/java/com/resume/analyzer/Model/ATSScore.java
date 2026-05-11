package com.resume.analyzer.Model;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ATSScore {
    private int score;
    private String recommendation;
    private List<String> strengths;
    private List<String> weaknesses;
    private Map<String, Integer> categoryScores;
    private String marketSearchQuery;
    private List<String> trajectory; // Step-by-step career evolution
    private List<Map<String, String>> opportunities; // Job alignment roadmap
    private List<Map<String, String>> resources; // NEW: Study resources (name, url)
}