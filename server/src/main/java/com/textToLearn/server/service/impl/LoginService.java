package com.textToLearn.server.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.textToLearn.server.model.User;
import com.textToLearn.server.repository.UserRepository;
import com.textToLearn.server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Boolean login(GoogleIdToken.Payload payload) {
        String sub = payload.getSubject();
        Optional<User> userOptional = userRepository.findById(sub);

        if (userOptional.isPresent()) {
            System.out.println("User exists in DB: " + userOptional.get().getEmail());
            return true;
        } else {
            // User doesn't exist, create new user
            User newUser = User.builder()
                    .sub(sub)
                    .email(payload.getEmail())
                    .name((String) payload.get("name"))
                    .build();
            
            userRepository.save(newUser);
            System.out.println("New user created in DB: " + newUser.getEmail());
            return true;
        }
    }
}
