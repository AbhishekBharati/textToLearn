package com.textToLearn.Consumer.dto;

import java.util.List;

public record ModuleContent(String title, List<LessonContent> lessons) {
}
