package com.resume.analyzer.Services;

import com.resume.analyzer.Model.ATSScore;
import com.fasterxml.jackson.databind.JsonNode;
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
public class ATSScoreService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${spring.ai.openai.api-key}")
    private String mistralKey;

    @Value("${spring.ai.openai.base-url}")
    private String mistralUrl;

    @Value("${spring.ai.openai.chat.options.model}")
    private String mistralModel;

    @Value("${groq.api.key}")
    private String groqKey;

    @Value("${groq.base-url}")
    private String groqUrl;

    @Value("${groq.model}")
    private String groqModel;

    public ATSScore calculateScore(String resumeText, String jobDescription) {
        // PRIMARY: Mistral Core
        try {
            log.info("Initiating Mistral Core Analysis...");
            ATSScore result = callAgent(mistralUrl + "/v1/chat/completions", mistralKey, mistralModel, resumeText, jobDescription);
            result.setModelSource("Mistral Core");
            return result;
        } catch (Exception e) {
            log.warn("Mistral Node Unstable. Activating Groq Bridge...");
            // SECONDARY: Groq Reliable Fallback
            try {
                ATSScore result = callAgent(groqUrl, groqKey, groqModel, resumeText, jobDescription);
                result.setModelSource("Groq Bridge");
                return result;
            } catch (Exception ex) {
                log.error("Neural Shield Depleted: Both agents failed.");
                ATSScore fallback = fallbackScore();
                fallback.setModelSource("Emergency Fallback");
                return fallback;
            }
        }
    }

    private ATSScore callAgent(String url, String key, String model, String resumeText, String jobDescription) throws Exception {
        long startTime = System.currentTimeMillis();
        String prompt = "Act as an advanced ATS Intelligence Agent. Analyze this resume against the job description.\n" +
                "RESUME: " + resumeText + "\n" +
                "JOB: " + jobDescription + "\n\n" +
                "Return ONLY a raw JSON object with these EXACT keys:\n" +
                "score (0-100 integer), recommendation (2-3 sentences), strengths (array of 4 strings), " +
                "weaknesses (array of 4 strings), categoryScores (object with: Skills, Formatting, Keywords, Experience as integers), " +
                "marketSearchQuery (a highly specific 3-5 word employment search query. CRITICAL: DO NOT use words like 'training', 'tutorial', 'course', or 'certification'. ONLY use employment terms like 'job', 'internship', 'associate', 'hiring', or 'vacancy' that fits the resume profile), trajectory (array of 6 strings), " +
                "opportunities (array of objects: {title, desc}), resources (array of objects: {name, url}).\n" +
                "CRITICAL: NO MARKDOWN. NO CONVERSATION. ONLY JSON.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + key.trim());

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        body.put("temperature", 0.1);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            log.info("Agent [{}] response received in {}ms", model, (System.currentTimeMillis() - startTime));
            return parseResponse(response.getBody());
        } catch (Exception e) {
            log.error("Agent [{}] failure after {}ms: {}", model, (System.currentTimeMillis() - startTime), e.getMessage());
            throw e;
        }
    }

    private ATSScore parseResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        String content = root.path("choices").get(0).path("message").path("content").asText();
        
        // Robust JSON extraction (removes potential markdown or prefix text)
        int start = content.indexOf("{");
        int end = content.lastIndexOf("}");
        if (start != -1 && end != -1) {
            content = content.substring(start, end + 1);
        } else {
            log.warn("Agent returned non-JSON content. Attempting raw parse...");
        }
        
        JsonNode data = objectMapper.readTree(content);

        List<String> trajectory = new ArrayList<>();
        data.path("trajectory").forEach(n -> trajectory.add(n.asText()));

        List<Map<String, String>> opps = new ArrayList<>();
        data.path("opportunities").forEach(n -> {
            Map<String, String> m = new HashMap<>();
            m.put("title", n.path("title").asText());
            m.put("desc", n.path("desc").asText());
            opps.add(m);
        });

        List<Map<String, String>> resources = new ArrayList<>();
        data.path("resources").forEach(n -> {
            Map<String, String> m = new HashMap<>();
            m.put("name", n.path("name").asText());
            m.put("url", n.path("url").asText());
            resources.add(m);
        });

        return ATSScore.builder()
                .score(data.path("score").asInt())
                .recommendation(data.path("recommendation").asText())
                .strengths(objectMapper.convertValue(data.path("strengths"), List.class))
                .weaknesses(objectMapper.convertValue(data.path("weaknesses"), List.class))
                .categoryScores(objectMapper.convertValue(data.path("categoryScores"), Map.class))
                .marketSearchQuery(data.path("marketSearchQuery").asText())
                .trajectory(trajectory)
                .opportunities(opps)
                .resources(resources)
                .build();
    }

    private ATSScore fallbackScore() {
        return ATSScore.builder()
                .score(45)
                .recommendation("Agent connection limited. Please synchronize API keys.")
                .marketSearchQuery("Software Engineer")
                .trajectory(List.of("Step 1: Check Mistral Sync", "Step 2: Check Groq Sync"))
                .build();
    }
}