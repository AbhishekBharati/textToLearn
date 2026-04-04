package com.textToLearn.Consumer.service;

import com.textToLearn.Consumer.dto.CourseRequest;
import com.textToLearn.Consumer.dto.FullCourseResponse;
import com.textToLearn.Consumer.model.JobStatus;
import com.textToLearn.Consumer.repository.JobStatusRepository;
import com.textToLearn.Consumer.service.impl.OpenAICourseGeneration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RabbitMQConsumer {

    private final CourseGenerationService courseGenerationService;
    private final JobStatusRepository jobStatusRepository;

    public RabbitMQConsumer(OpenAICourseGeneration openAICourseGeneration, JobStatusRepository jobStatusRepository){
        this.courseGenerationService = openAICourseGeneration;
        this.jobStatusRepository = jobStatusRepository;
    }

    @RabbitListener(queues = "${rabbitmq.queue}", containerFactory = "jsonListenerContainerFactory")
    public void consume(CourseRequest request) {
        String topic = request.getMessage();
        String jobId = request.getJobId();
        System.out.println("Generating course for topic: " + topic + " with jobId: " + jobId);
        
        try {
            // In a real scenario, the creator would also come from the request
            FullCourseResponse response = courseGenerationService.generateFullCourse(topic, "AUTHENTICATED_USER", jobId);
            System.out.println("Generated Course Content:\n" + response);
        } catch (Exception e) {
            System.err.println("Error during course generation for jobId " + jobId + ": " + e.getMessage());
            jobStatusRepository.findById(jobId).ifPresent(status -> {
                status.setStatus("FAILED");
                status.setError(e.getMessage());
                status.setUpdatedAt(LocalDateTime.now());
                jobStatusRepository.save(status);
            });
        }
    }
}
