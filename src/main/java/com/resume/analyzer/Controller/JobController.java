package com.resume.analyzer.Controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @GetMapping
    public ResponseEntity<List<JobOpening>> getJobOpenings() {
        // Return dummy data for multi-company job openings
        List<JobOpening> jobs = Arrays.asList(
                new JobOpening(1L, "Software Engineer", "Google", "Mountain View, CA", "Full-time", "Experience with Java, Spring Boot, React. Strong algorithms background."),
                new JobOpening(2L, "Frontend Developer", "Meta", "Menlo Park, CA", "Full-time", "React, Redux, Tailwind CSS, UI/UX focus."),
                new JobOpening(3L, "Backend Engineer", "Amazon", "Seattle, WA", "Full-time", "AWS, Microservices, Java, DynamoDB."),
                new JobOpening(4L, "AI Researcher", "Mistral AI", "Paris, France", "Full-time", "LLMs, PyTorch, Natural Language Processing.")
        );
        return ResponseEntity.ok(jobs);
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class JobOpening {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String type;
    private String description;
}
