package com.resume.analyzer.Controller;

import com.resume.analyzer.Services.GroqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GroqService groqService;

    @PostMapping("/query")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        String userQuery = (String) request.get("query");
        Map<String, Object> context = (Map<String, Object>) request.get("context");
        
        // ACCURATE IDENTITY: Using GroqService
        String response = groqService.getChatResponse(userQuery, context);
        
        Map<String, String> result = new HashMap<>();
        result.put("response", response);
        return ResponseEntity.ok(result);
    }
}
