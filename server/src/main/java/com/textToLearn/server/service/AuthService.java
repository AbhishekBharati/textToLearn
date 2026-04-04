package com.textToLearn.server.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

public interface AuthService {
    Boolean login(GoogleIdToken.Payload payload);
}
