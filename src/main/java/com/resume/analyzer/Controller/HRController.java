package com.resume.analyzer.Controller;

import com.resume.analyzer.Model.AnalysisResult;
import com.resume.analyzer.Model.User;
import com.resume.analyzer.Repository.AnalysisResultRepository;
import com.resume.analyzer.Repository.UserRepository;
import com.resume.analyzer.Services.PDFService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hr")
@RequiredArgsConstructor
public class HRController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;
    private final PDFService pdfService;

    /**
     * HR Endpoint: Fetch all candidate CV analysis results with role & score filters.
     * Allows HR recruiters to search and filter top candidate resumes.
     */
    @GetMapping("/candidates")
    public ResponseEntity<?> getCandidates(
            @RequestParam(required = false, defaultValue = "") String role,
            @RequestParam(required = false, defaultValue = "0") Integer minScore) {
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> hrOpt = userRepository.findByEmail(email);
        
        if (hrOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized HR Access");
        }

        // Verify HR/RECRUITER/ADMIN role
        User hr = hrOpt.get();
        if (hr.getRole() != User.Role.HR && hr.getRole() != User.Role.RECRUITER && hr.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied: Requires HR or Recruiter credentials.");
        }

        List<AnalysisResult> candidates = analysisResultRepository.findCandidatesForHR(role, minScore);
        return ResponseEntity.ok(candidates);
    }

    /**
     * HR Endpoint: Click on a specific candidate CV result to view detailed ATS evaluation,
     * category scores, strengths, weaknesses, and career trajectory.
     */
    @GetMapping("/candidate/{id}")
    public ResponseEntity<?> getCandidateCVDetails(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> hrOpt = userRepository.findByEmail(email);
        
        if (hrOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized HR Access");
        }

        User hr = hrOpt.get();
        if (hr.getRole() != User.Role.HR && hr.getRole() != User.Role.RECRUITER && hr.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied: Requires HR or Recruiter credentials.");
        }

        Optional<AnalysisResult> candidateOpt = analysisResultRepository.findCandidateDetailsForHR(id);
        if (candidateOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(candidateOpt.get());
    }

    /**
     * HR Endpoint: Download dynamically generated candidate preparation dossier PDF.
     */
    @GetMapping("/candidate/{id}/prep-guide")
    public ResponseEntity<byte[]> downloadCandidatePrepGuide(@PathVariable Long id) {
        try {
            Optional<AnalysisResult> resultOpt = analysisResultRepository.findCandidateDetailsForHR(id);
            if (resultOpt.isEmpty()) return ResponseEntity.notFound().build();
            
            byte[] pdfBytes = pdfService.generatePrepGuide(resultOpt.get());
            
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=Candidate_Career_Prep_Guide.pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
