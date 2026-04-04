package com.textToLearn.server.controller;

import com.textToLearn.server.dto.CourseRequest;
import com.textToLearn.server.model.Course;
import com.textToLearn.server.model.Module;
import com.textToLearn.server.model.User;
import com.textToLearn.server.repository.CourseRepository;
import com.textToLearn.server.repository.LessonRepository;
import com.textToLearn.server.repository.ModuleRepository;
import com.textToLearn.server.repository.UserRepository;
import com.textToLearn.server.service.impl.GoogleAuthService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
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
    private ModuleRepository moduleRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    private void addToRecent(String sub, String courseId) {
        userRepository.findById(sub).ifPresent(user -> {
            List<String> recent = user.getRecentCourseIds();
            if (recent == null) recent = new ArrayList<>();
            recent.remove(courseId);
            recent.add(0, courseId);
            if (recent.size() > 10) {
                recent = recent.subList(0, 10);
            }
            user.setRecentCourseIds(recent);
            userRepository.save(user);
        });
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateCourse(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> requestBody) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String idToken = authHeader.substring(7);
        String sub;
        try {
            sub = googleAuthService.verifyToken(idToken).getSubject();
        } catch (Exception e) {
            System.err.println("Auth Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token"));
        }

        try {
            String topic = requestBody.get("message");
            if (topic == null || topic.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message/Topic is required"));
            }

            Optional<Course> existingCourse = courseRepository.findByTitleIgnoreCase(topic.trim());
            if (existingCourse.isPresent()) {
                Course course = existingCourse.get();
                
                addToRecent(sub, course.getId());

                List<Module> fullModules = (List<Module>) moduleRepository.findAllById(course.getModules());
                
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                    "id", course.getId(),
                    "title", course.getTitle(),
                    "description", course.getDescription(),
                    "modules", fullModules.stream().map(m -> Map.of(
                        "id", m.getId(),
                        "title", m.getTitle()
                    )).collect(Collectors.toList()),
                    "message", "Course already exists"
                ));
            }

            String jobId = UUID.randomUUID().toString();
            CourseRequest courseRequest = CourseRequest.builder()
                    .message(topic)
                    .jobId(jobId)
                    .build();

            rabbitTemplate.convertAndSend(exchange, "topic.course", courseRequest);

            return ResponseEntity.ok(Map.of(
                "jobId", jobId,
                "message", "Course generation started"
            ));

        } catch (Exception e) {
            System.err.println("Generation Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to start course generation: " + e.getMessage()));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentCourses(@RequestHeader("Authorization") String authHeader) {
        try {
            String sub = googleAuthService.verifyToken(authHeader.substring(7)).getSubject();
            Optional<User> userOpt = userRepository.findById(sub);
            if (userOpt.isPresent()) {
                List<String> ids = userOpt.get().getRecentCourseIds();
                if (ids == null || ids.isEmpty()) return ResponseEntity.ok(new ArrayList<>());
                
                List<Course> courses = (List<Course>) courseRepository.findAllById(ids);
                Map<String, Course> courseMap = courses.stream().collect(Collectors.toMap(Course::getId, c -> c));
                
                List<Map<String, String>> result = ids.stream()
                    .filter(courseMap::containsKey)
                    .map(id -> {
                        Course c = courseMap.get(id);
                        return Map.of("id", c.getId(), "title", c.getTitle());
                    }).collect(Collectors.toList());
                    
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<?> getLessonsByModule(@RequestHeader("Authorization") String authHeader, @PathVariable String moduleId) {
        try {
            googleAuthService.verifyToken(authHeader.substring(7));
            Optional<Module> moduleOpt = moduleRepository.findById(moduleId);
            if (moduleOpt.isPresent()) {
                List<String> lessonIds = moduleOpt.get().getLessons();
                return ResponseEntity.ok(lessonRepository.findAllById(lessonIds));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<?> getLessonById(@RequestHeader("Authorization") String authHeader, @PathVariable String lessonId) {
        try {
            googleAuthService.verifyToken(authHeader.substring(7));
            return ResponseEntity.of(lessonRepository.findById(lessonId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
