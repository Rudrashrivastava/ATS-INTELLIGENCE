package com.resume.analyzer.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
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

    @Value("${groq.model:llama-3.1-8b-instant}")
    private String model;

    public String getChatResponse(String userQuery, Map<String, Object> context) {
        try {
            // Safety sanitization: Truncate oversized user input
            String safeQuery = userQuery != null ? userQuery.trim() : "";
            if (safeQuery.length() > 2500) {
                safeQuery = safeQuery.substring(0, 2500) + "... [Truncated due to payload length]";
            }

            // Safety sanitization: Build compact context
            StringBuilder systemPrompt = new StringBuilder("You are the ATS Intelligence Assistant (Powered by Groq). " +
                    "PROJECT MANUAL: " +
                    "1. ANALYZER: Upload a PDF resume to get an AI score and roadmap. " +
                    "2. DASHBOARD: View your history, global stats, and career trajectories. " +
                    "3. DETAILS: See a 6-step roadmap and job alignment strategy. " +
                    "MISTRAL MODEL: Performs the ATS scoring. " +
                    "GROQ MODEL: Powers this real-time assistant chat. " +
                    "ALWAYS provide professional, concise advice without markdown tags like **. ");

            if (context != null) {
                String role = String.valueOf(context.getOrDefault("role", "Candidate"));
                if (role.length() > 100) role = role.substring(0, 100);

                Object scoreObj = context.getOrDefault("score", 0);

                systemPrompt.append("RESUME CONTEXT: Target Role: ").append(role).append(". ")
                            .append("ATS Score: ").append(scoreObj).append("%. ");

                if (context.containsKey("recommendation") && context.get("recommendation") != null) {
                    String rec = String.valueOf(context.get("recommendation"));
                    if (rec.length() > 250) rec = rec.substring(0, 250);
                    systemPrompt.append("AI Advice: ").append(rec).append(". ");
                }
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + (apiKey != null ? apiKey.trim() : ""));

            String safeModel = (model == null || model.isBlank() || model.contains("compound-mini")) 
                    ? "llama-3.1-8b-instant" : model.trim();

            Map<String, Object> body = new HashMap<>();
            body.put("model", safeModel);
            body.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt.toString()),
                Map.of("role", "user", "content", safeQuery)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String targetUrl = resolveFullUrl(baseUrl);
            log.info("Sending Groq Chat Request to: {}", targetUrl);
            ResponseEntity<String> response = restTemplate.postForEntity(targetUrl, entity, String.class);

            Map<String, Object> responseBody = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            
            return ((String) message.get("content")).replaceAll("\\*\\*", "");
        } catch (HttpStatusCodeException e) {
            log.error("Groq HTTP Error [Status {}]: {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode() == HttpStatus.PAYLOAD_TOO_LARGE || e.getRawStatusCode() == 413) {
                return "Neural Assistant Notice: Your message or context was too large for processing. Please shorten your prompt and try again.";
            }
            return "Neural Link Error (Groq " + e.getStatusCode().value() + "): Unable to process query at this time.";
        } catch (Exception e) {
            log.error("Groq Failure", e);
            return "Neural Link Error (Groq): " + e.getMessage();
        }
    }

    private String resolveFullUrl(String inputUrl) {
        if (inputUrl == null || inputUrl.isBlank()) {
            return "https://api.groq.com/openai/v1/chat/completions";
        }
        String u = inputUrl.trim();
        if (u.endsWith("/chat/completions")) {
            return u;
        }
        if (u.endsWith("/")) {
            u = u.substring(0, u.length() - 1);
        }
        if (u.endsWith("/openai/v1") || u.endsWith("/v1")) {
            return u + "/chat/completions";
        }
        return u + "/v1/chat/completions";
    }
}

