package com.textToLearn.Consumer.dto;

import java.util.List;

public record ContentBlock(
        String type,
        String text,
        String language,
        String query,
        String videoId,
        String question,
        List<String> options,
        Integer answer,
        String explanation
) {}
