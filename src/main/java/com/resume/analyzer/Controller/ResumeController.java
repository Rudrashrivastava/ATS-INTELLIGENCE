package com.resume.analyzer.Controller;

import com.resume.analyzer.Model.AnalysisResult;
import com.resume.analyzer.Model.User;
import com.resume.analyzer.Repository.AnalysisResultRepository;
import com.resume.analyzer.Repository.UserRepository;
import com.resume.analyzer.Services.ATSScoreService;
import com.resume.analyzer.Services.PDFService;
import com.resume.analyzer.Model.ATSScore;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ATSScoreService atsScoreService;
    private final PDFService pdfService;
    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestParam("file") MultipartFile file, 
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {
        try {
            String finalJobDesc = (jobDescription == null || jobDescription.trim().isEmpty()) 
                ? "General career analysis and market alignment" 
                : jobDescription;
            
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("User not found");

            String resumeText = pdfService.extractText(file);
            ATSScore score = atsScoreService.calculateScore(resumeText, finalJobDesc);

            AnalysisResult result = AnalysisResult.builder()
                    .user(userOpt.get())
                    .primaryRole(score.getMarketSearchQuery())
                    .overallScore(score.getScore())
                    .analysisDate(LocalDateTime.now())
                    .recommendation(score.getRecommendation())
                    .strengths(objectMapper.writeValueAsString(score.getStrengths()))
                    .weaknesses(objectMapper.writeValueAsString(score.getWeaknesses()))
                    .categoryScoresJson(objectMapper.writeValueAsString(score.getCategoryScores()))
                    .trajectoryJson(objectMapper.writeValueAsString(score.getTrajectory()))
                    .opportunitiesJson(objectMapper.writeValueAsString(score.getOpportunities()))
                    .resourcesJson(objectMapper.writeValueAsString(score.getResources()))
                    .build();

            return ResponseEntity.ok(analysisResultRepository.save(result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Analysis failed: " + e.getMessage());
        }
    }

    @GetMapping("/all-history")
    public ResponseEntity<List<AnalysisResult>> getHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.map(user -> ResponseEntity.ok(analysisResultRepository.findByUserOrderByAnalysisDateDesc(user)))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }

    @GetMapping("/global-ecosystem")
    public ResponseEntity<List<AnalysisResult>> getGlobalEcosystem() {
        return ResponseEntity.ok(analysisResultRepository.findTop6ByOrderByAnalysisDateDesc());
    }

    @GetMapping("/global-ecosystem-full")
    public ResponseEntity<List<AnalysisResult>> getGlobalEcosystemFull() {
        return ResponseEntity.ok(analysisResultRepository.findGlobalEcosystem());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<AnalysisResult>> getLeaderboard() {
        return ResponseEntity.ok(analysisResultRepository.findLeaderboard());
    }

    @GetMapping("/global-stats")
    public ResponseEntity<?> getGlobalStats() {
        Double avg = analysisResultRepository.getAverageScore();
        long total = analysisResultRepository.count();
        
        return ResponseEntity.ok(java.util.Map.of(
            "avgMatch", avg != null ? avg.intValue() : 0,
            "totalProcessed", total,
            "activeEngines", 14
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).build();

        List<AnalysisResult> history = analysisResultRepository.findByUserOrderByAnalysisDateDesc(userOpt.get());
        int avg = history.isEmpty() ? 0 : (int) history.stream().mapToInt(AnalysisResult::getOverallScore).average().orElse(0);
        
        return ResponseEntity.ok(java.util.Map.of(
            "avgMatch", avg,
            "totalProcessed", history.size(),
            "activeEngines", 14
        ));
    }

    @GetMapping("/download-guide/{id}")
    public ResponseEntity<byte[]> downloadGuide(@PathVariable Long id) {
        try {
            Optional<AnalysisResult> resultOpt = analysisResultRepository.findById(id);
            if (resultOpt.isEmpty()) return ResponseEntity.notFound().build();
            
            byte[] pdfBytes = pdfService.generatePrepGuide(resultOpt.get());
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=Career_Prep_Guide.pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}