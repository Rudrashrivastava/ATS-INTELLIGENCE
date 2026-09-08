package com.resume.analyzer.Repository;

import com.resume.analyzer.Model.AnalysisResult;
import com.resume.analyzer.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    List<AnalysisResult> findByUserOrderByAnalysisDateDesc(User user);
    
    List<AnalysisResult> findTop5ByOrderByAnalysisDateDesc();
    
    List<AnalysisResult> findTop5ByOrderByIdDesc();

    List<AnalysisResult> findTop8ByOrderByIdDesc();
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user"})
    List<AnalysisResult> findTop6ByOrderByAnalysisDateDesc();

    @org.springframework.data.jpa.repository.Query("SELECT a FROM AnalysisResult a LEFT JOIN FETCH a.user ORDER BY a.analysisDate DESC")
    List<AnalysisResult> findGlobalEcosystem();

    List<AnalysisResult> findAllByOrderByAnalysisDateDesc();

    @org.springframework.data.jpa.repository.Query("SELECT a FROM AnalysisResult a LEFT JOIN FETCH a.user ORDER BY a.overallScore DESC")
    List<AnalysisResult> findLeaderboard();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT a.primaryRole) FROM AnalysisResult a")
    long countUniqueRoles();

    @org.springframework.data.jpa.repository.Query("SELECT AVG(a.overallScore) FROM AnalysisResult a")
    Double getAverageScore();

    // HR / Recruiter Scouting Queries
    @org.springframework.data.jpa.repository.Query("SELECT a FROM AnalysisResult a LEFT JOIN FETCH a.user WHERE LOWER(a.primaryRole) LIKE LOWER(CONCAT('%', :role, '%')) AND a.overallScore >= :minScore ORDER BY a.overallScore DESC")
    List<AnalysisResult> findCandidatesForHR(@org.springframework.data.repository.query.Param("role") String role, @org.springframework.data.repository.query.Param("minScore") Integer minScore);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM AnalysisResult a LEFT JOIN FETCH a.user WHERE a.id = :id")
    java.util.Optional<AnalysisResult> findCandidateDetailsForHR(@org.springframework.data.repository.query.Param("id") Long id);
}

