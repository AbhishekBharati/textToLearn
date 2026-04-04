package com.textToLearn.Consumer.repository;

import com.textToLearn.Consumer.model.Course;
import com.textToLearn.Consumer.model.Module;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuleRepository extends MongoRepository<Module, String> {
    Optional<Module> findByTitleAndCourse(String title, Course course);
}
