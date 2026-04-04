package com.textToLearn.server.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.textToLearn.server.service.impl.GoogleAuthService;
import com.textToLearn.server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private GoogleAuthService googleAuthService;
    @Autowired
    private AuthService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        try {
            GoogleIdToken.Payload payload = googleAuthService.verifyToken(idToken);
            
            loginService.login(payload);
            return ResponseEntity.ok(Map.of(
                "message", "User authenticated successfully",
                "user", Map.of(
                    "email", payload.getEmail(),
                    "name", payload.get("name"),
                    "picture", payload.get("picture")
                )
            ));
        } catch (Exception e) {
            System.out.println("Authentication Failed: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid ID token"));
        }
    }
}
