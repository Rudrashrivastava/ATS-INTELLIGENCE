package com.resume.analyzer.Controller;

import com.resume.analyzer.Services.GroqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/market-ai")
@RequiredArgsConstructor
public class MarketAIController {

    private final GroqService groqService;

    @PostMapping("/analyze-market")
    public ResponseEntity<Map<String, String>> analyzeMarket(@RequestBody Map<String, String> request) {
        String role = request.get("role");
        String prompt = "Provide a brief market trend analysis for the role of " + role + ". Mention salary trends and demand.";
        
        String response = groqService.getChatResponse(prompt, null);
        
        Map<String, String> result = new HashMap<>();
        result.put("analysis", response);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/career-pivot")
    public ResponseEntity<Map<String, String>> pivotAdvice(@RequestBody Map<String, String> request) {
        String current = request.get("current");
        String target = request.get("target");
        String prompt = "Give a 3-step advice on pivoting from " + current + " to " + target + ".";
        
        String response = groqService.getChatResponse(prompt, null);
        
        Map<String, String> result = new HashMap<>();
        result.put("advice", response);
        return ResponseEntity.ok(result);
    }
}
