package com.textToLearn.Consumer.repository;

import com.textToLearn.Consumer.model.JobStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobStatusRepository extends MongoRepository<JobStatus, String> {
}
