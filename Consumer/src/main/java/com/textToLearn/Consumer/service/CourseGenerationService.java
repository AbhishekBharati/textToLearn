package com.textToLearn.Consumer.service;

import com.textToLearn.Consumer.dto.FullCourseResponse;

public interface CourseGenerationService {
    FullCourseResponse generateFullCourse(String topic, String creator, String jobId);
}
