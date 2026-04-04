package com.textToLearn.Consumer.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "job_status")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobStatus {
    @Id
    private String jobId;
    private String status; // IN_PROGRESS, COMPLETED, FAILED
    private String courseId; // Optional: Link to the course ID when completed
    private String error; // Optional: Error message if failed

    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
