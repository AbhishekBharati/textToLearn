package com.textToLearn.Consumer.dto;

import java.util.List;

public record FullCourseResponse(
        String title,
        String description,
        List<String> tags,
        List<ModuleContent> modules
) {
}
