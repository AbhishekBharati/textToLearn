package com.textToLearn.server.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class YouTubeSearchService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String searchVideoId(String query) {
        if (query == null || query.isEmpty()) return null;
        
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                    .queryParam("part", "snippet")
                    .queryParam("maxResults", 1)
                    .queryParam("q", query)
                    .queryParam("type", "video")
                    .queryParam("key", apiKey)
                    .build()
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            if (root.has("error")) {
                return null;
            }

            JsonNode items = root.path("items");
            if (items.isArray() && !items.isEmpty()) {
                return items.get(0).path("id").path("videoId").asText();
            }
        } catch (Exception e) {
            System.err.println("Error searching YouTube: " + e.getMessage());
        }
        return null;
    }
}
