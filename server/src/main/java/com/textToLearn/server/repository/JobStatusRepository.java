package com.textToLearn.server.repository;

import com.textToLearn.server.model.JobStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobStatusRepository extends MongoRepository<JobStatus, String> {
}
