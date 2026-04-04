package com.textToLearn.Consumer.dto;

import java.util.List;

public record LessonContent(
        String title,
        List<String> objectives,
        List<ContentBlock> content
) {
}
