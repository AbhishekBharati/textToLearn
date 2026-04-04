package com.textToLearn.server.repository;

import com.textToLearn.server.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.mongodb.repository.Query;
import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    @Query("{ 'module.$id': ?0 }")
    List<Lesson> findByModuleId(String moduleId);
}
