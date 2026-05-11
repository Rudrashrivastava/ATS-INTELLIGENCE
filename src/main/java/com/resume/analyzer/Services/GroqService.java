package com.resume.analyzer.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroqService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.base-url:https://api.groq.com/openai/v1/chat/completions}")
    private String baseUrl;

    @Value("${groq.model}")
    private String model;

    public String getChatResponse(String userQuery, Map<String, Object> context) {
        try {
            String systemPrompt = "You are the ATS Intelligence Assistant (Powered by Groq). " +
                    "PROJECT MANUAL: " +
                    "1. ANALYZER: Upload a PDF resume to get an AI score and roadmap. " +
                    "2. DASHBOARD: View your history, global stats, and career trajectories. " +
                    "3. DETAILS: See a 6-step roadmap and job alignment strategy. " +
                    "MISTRAL MODEL: Performs the ATS scoring. " +
                    "GROQ MODEL: Powers this real-time assistant chat. " +
                    "ALWAYS provide professional, concise advice without markdown tags like **. ";

            if (context != null) {
                systemPrompt += "RESUME CONTEXT: Target Role: " + context.get("role") + ". " +
                        "ATS Score: " + context.get("score") + "%. " +
                        "AI Advice: " + context.get("recommendation") + ". ";
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userQuery)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(baseUrl, entity, String.class);

            Map<String, Object> responseBody = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            
            return ((String) message.get("content")).replaceAll("\\*\\*", "");
        } catch (Exception e) {
            log.error("Groq Failure", e);
            return "Neural Link Error (Groq): " + e.getMessage();
        }
    }
}
