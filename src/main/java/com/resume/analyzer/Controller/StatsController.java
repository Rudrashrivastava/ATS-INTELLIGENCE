package com.resume.analyzer.Controller;

import com.resume.analyzer.Model.AnalysisResult;
import com.resume.analyzer.Repository.AnalysisResultRepository;
import com.resume.analyzer.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stats")
public class StatsController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;

    @Value("${groq.api.key:}")
    private String groqKey;

    @Value("${rapidapi.key:}")
    private String rapidKey;

    @Value("${openwebninja.api-key:}")
    private String ninjaKey;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalProcessed = analysisResultRepository.count();
        Double avgScore = analysisResultRepository.getAverageScore();
        long uniqueRoles = analysisResultRepository.countUniqueRoles();

        int activeApis = 0;
        if (groqKey != null && !groqKey.isEmpty()) activeApis++;
        if (rapidKey != null && !rapidKey.isEmpty()) activeApis++;
        if (ninjaKey != null && !ninjaKey.isEmpty()) activeApis++;

        // 1. Calculative Active Engines (Neural Nodes)
        // Calculated as: (Unique Roles * 2) + (Total Processes * 0.5) + Active API Nodes
        long totalActiveEngines = (uniqueRoles * 2) + (long)(totalProcessed * 0.5) + activeApis;
        if (totalActiveEngines < 1) totalActiveEngines = 1;

        // 2. Real Market Reach (Neural Connections)
        // Based on the 'Market Sentiment' and 'Search Diversity'
        // Formula: (Total Processed * Avg Score / 10) + (Unique Roles * 5)
        double reachValue = (totalProcessed * (avgScore != null ? avgScore : 0) / 10.0) + (uniqueRoles * 5);
        long finalReach = Math.round(reachValue);

        // Map recent results
        List<Map<String, Object>> recentFeed = analysisResultRepository.findTop5ByOrderByAnalysisDateDesc()
            .stream()
            .map(res -> {
                Map<String, Object> item = new HashMap<>();
                item.put("name", res.getUser() != null ? (res.getUser().getName() != null ? res.getUser().getName() : res.getUser().getUsername()) : "Anonymous");
                item.put("role", res.getPrimaryRole());
                item.put("score", res.getOverallScore());
                item.put("timestamp", res.getAnalysisDate());
                return item;
            })
            .collect(Collectors.toList());

        stats.put("totalProcessed", totalProcessed);
        stats.put("averageScore", avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0);
        stats.put("activeEngines", totalActiveEngines);
        stats.put("recentFeed", recentFeed);
        
        // Market Analytics
        stats.put("marketReach", finalReach); 
        stats.put("syncStatus", avgScore != null && avgScore > 75 ? "HIGH FIDELITY" : (activeApis >= 2 ? "OPTIMIZED" : "STABLE"));

        // Advanced Moving Average Trend
        List<AnalysisResult> allResults = analysisResultRepository.findAllByOrderByAnalysisDateDesc();
        double trendValue = 0.0;
        
        if (allResults.size() >= 4) {
            int mid = Math.min(allResults.size() / 2, 10);
            double latestAvg = allResults.subList(0, mid).stream().mapToInt(AnalysisResult::getOverallScore).average().orElse(0);
            double previousAvg = allResults.subList(mid, Math.min(mid * 2, allResults.size())).stream().mapToInt(AnalysisResult::getOverallScore).average().orElse(0);
            trendValue = latestAvg - previousAvg;
        } else if (allResults.size() >= 2) {
            trendValue = allResults.get(0).getOverallScore() - allResults.get(1).getOverallScore();
        }
        
        stats.put("trend", trendValue >= 0 ? "+" + String.format("%.1f", trendValue) : String.format("%.1f", trendValue));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/global-history")
    public ResponseEntity<List<Map<String, Object>>> getGlobalHistory() {
        return ResponseEntity.ok(
            analysisResultRepository.findAllByOrderByAnalysisDateDesc()
                .stream()
                .map(res -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", res.getUser() != null ? (res.getUser().getName() != null ? res.getUser().getName() : res.getUser().getUsername()) : "Anonymous");
                    item.put("role", res.getPrimaryRole());
                    item.put("score", res.getOverallScore());
                    item.put("date", res.getAnalysisDate());
                    return item;
                })
                .collect(Collectors.toList())
        );
    }
}
