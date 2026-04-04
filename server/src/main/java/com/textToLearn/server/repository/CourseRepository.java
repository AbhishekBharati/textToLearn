package com.textToLearn.server.repository;

import com.textToLearn.server.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findByTitleIgnoreCase(String title);
}
