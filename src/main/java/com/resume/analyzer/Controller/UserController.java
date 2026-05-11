package com.resume.analyzer.Controller;

import com.resume.analyzer.Model.User;
import com.resume.analyzer.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent()) {
            User u = user.get();
            // Return safe fields for frontend identity sync
            return ResponseEntity.ok(java.util.Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "name", u.getName() != null ? u.getName() : "OPERATOR",
                "role", u.getRole()
            ));
        }
        
        return ResponseEntity.status(401).body("Identity verification failed in neural context");
    }
}
