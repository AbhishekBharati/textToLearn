package com.textToLearn.Consumer.service;

import com.textToLearn.Consumer.dto.FullCourseResponse;

public interface CourseGenerationService {
    public FullCourseResponse generateFullCourse(String topic);
}
