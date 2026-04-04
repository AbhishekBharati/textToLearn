package com.textToLearn.server.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.textToLearn.server.model.User;

public interface AuthService {
    User login(GoogleIdToken.Payload payload);
}
