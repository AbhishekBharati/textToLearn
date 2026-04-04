package com.textToLearn.Consumer.dto;

import java.util.List;

public record CourseModule(String title, List<Lesson> lessons) {
}
