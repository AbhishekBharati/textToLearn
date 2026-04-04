package com.textToLearn.server.controller;

import com.textToLearn.server.dto.CourseRequest;
import com.textToLearn.server.model.Course;
import com.textToLearn.server.model.Module;
import com.textToLearn.server.repository.CourseRepository;
import com.textToLearn.server.service.impl.GoogleAuthService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @PostMapping("/generate")
    public ResponseEntity<?> generateCourse(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> requestBody) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String idToken = authHeader.substring(7);
        try {
            // 1. Check if user is Authenticated
            googleAuthService.verifyToken(idToken);
            
            String topic = requestBody.get("message");
            if (topic == null || topic.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message/Topic is required"));
            }

            // 2. Check if Course Exists (Case-Insensitive)
            Optional<Course> existingCourse = courseRepository.findByTitleIgnoreCase(topic.trim());
            if (existingCourse.isPresent()) {
                Course course = existingCourse.get();
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                    "title", course.getTitle(),
                    "modules", course.getModules().stream().map(Module::getTitle).collect(Collectors.toList()),
                    "message", "Course already exists"
                ));
            }

            // 3. Generate jobId
            String jobId = UUID.randomUUID().toString();

            // 4. Publish message over RabbitMQ
            CourseRequest courseRequest = CourseRequest.builder()
                    .message(topic)
                    .jobId(jobId)
                    .build();

            rabbitTemplate.convertAndSend(exchange, "topic.course", courseRequest);

            // 5. Return jobId to Frontend
            return ResponseEntity.ok(Map.of(
                "jobId", jobId,
                "message", "Course generation started"
            ));

        } catch (Exception e) {
            System.out.println("Authentication Failed during course generation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token"));
        }
    }
}
