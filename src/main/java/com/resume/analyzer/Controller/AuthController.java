package com.resume.analyzer.Controller;

import com.resume.analyzer.Model.User;
import com.resume.analyzer.Repository.UserRepository;
import com.resume.analyzer.Services.JwtService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Neural Auth Engine: ONLINE");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(new AuthResponse(null, "This identity (email) is already established."));
            }

            User user = User.builder()
                    .email(request.getEmail())
                    .username(request.getEmail()) // Fallback
                    .password(passwordEncoder.encode(request.getPassword()))
                    .name(request.getName())
                    .role(User.Role.USER)
                    .build();
            
            userRepository.save(user);

            String jwtToken = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(jwtToken, "Operator identity established successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new AuthResponse(null, "Neural Link Error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        java.util.Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(new AuthResponse(null, "Identity not found. Please establish a link first."));
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            User user = userOpt.get();
            String jwtToken = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(jwtToken, "Neural Link established"));
            
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, "Neural Verification Failed: Invalid credentials."));
        }
    }
}

@Data @NoArgsConstructor @AllArgsConstructor
class AuthRequest {
    private String email;
    private String password;
}

@Data @NoArgsConstructor @AllArgsConstructor
class RegisterRequest {
    private String name;
    private String email;
    private String password;
}

@Data @NoArgsConstructor @AllArgsConstructor
class AuthResponse {
    private String token;
    private String message;
}
