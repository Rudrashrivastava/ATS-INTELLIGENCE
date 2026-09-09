package com.resume.analyzer.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping({"/health", "/ping"})
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ApplySphere AI Engine: ONLINE");
    }
}
