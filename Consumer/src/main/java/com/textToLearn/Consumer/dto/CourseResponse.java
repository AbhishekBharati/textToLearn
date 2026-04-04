package com.textToLearn.Consumer.dto;

import java.util.List;

public record CourseResponse(
        String title,
        String description,
        List<String> tags,
        List<CourseModule> modules
) {
}
