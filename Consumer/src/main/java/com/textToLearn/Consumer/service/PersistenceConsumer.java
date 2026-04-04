package com.textToLearn.Consumer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.textToLearn.Consumer.dto.CourseResponse;
import com.textToLearn.Consumer.dto.LessonContent;
import com.textToLearn.Consumer.dto.PersistenceMessage;
import com.textToLearn.Consumer.model.Course;
import com.textToLearn.Consumer.model.Lesson;
import com.textToLearn.Consumer.model.Module;
import com.textToLearn.Consumer.repository.CourseRepository;
import com.textToLearn.Consumer.repository.LessonRepository;
import com.textToLearn.Consumer.repository.ModuleRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class PersistenceConsumer {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final ObjectMapper objectMapper;

    public PersistenceConsumer(CourseRepository courseRepository, 
                               ModuleRepository moduleRepository, 
                               LessonRepository lessonRepository, 
                               ObjectMapper objectMapper) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.lessonRepository = lessonRepository;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "${rabbitmq.persistence.queue}", containerFactory = "jsonListenerContainerFactory")
    public void consume(PersistenceMessage message) {
        try {
            if (message.getType() == PersistenceMessage.Type.COURSE_OUTLINE) {
                CourseResponse outline = objectMapper.convertValue(message.getData(), CourseResponse.class);
                saveCourseOutline(outline);
            } else if (message.getType() == PersistenceMessage.Type.LESSON_CONTENT) {
                LessonContent lessonContent = objectMapper.convertValue(message.getData(), LessonContent.class);
                saveLessonContent(lessonContent, message.getCourseTitle(), message.getModuleTitle());
            }
        } catch (Exception e) {
            System.err.println("Error persisting message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void saveCourseOutline(CourseResponse outline) {
        Course course = courseRepository.findByTitle(outline.title())
                .orElse(Course.builder()
                        .title(outline.title())
                        .description(outline.description())
                        .tags(outline.tags())
                        .creator("AI_GENERATOR") // Placeholder
                        .modules(new ArrayList<>())
                        .build());
        
        course = courseRepository.save(course);
        
        for (var moduleDto : outline.modules()) {
            final Course finalCourse = course;
            Module module = moduleRepository.findByTitleAndCourse(moduleDto.title(), course)
                    .orElse(Module.builder()
                            .title(moduleDto.title())
                            .course(finalCourse)
                            .lessons(new ArrayList<>())
                            .build());
            module = moduleRepository.save(module);
            
            final Module savedModule = module;
            boolean alreadyInCourse = course.getModules().stream()
                .anyMatch(m -> m.getId() != null && m.getId().equals(savedModule.getId()));
                
            if (!alreadyInCourse) {
                course.getModules().add(module);
            }
        }
        courseRepository.save(course);
        System.out.println("Saved course outline: " + course.getTitle());
    }

    private void saveLessonContent(LessonContent lessonContent, String courseTitle, String moduleTitle) {
        Optional<Course> courseOpt = courseRepository.findByTitle(courseTitle);
        if (courseOpt.isPresent()) {
            Optional<Module> moduleOpt = moduleRepository.findByTitleAndCourse(moduleTitle, courseOpt.get());
            if (moduleOpt.isPresent()) {
                Module module = moduleOpt.get();
                
                Lesson lesson = Lesson.builder()
                        .title(lessonContent.title())
                        .content(new ArrayList<>(lessonContent.content()))
                        .isEnriched(true)
                        .module(module)
                        .build();
                
                lesson = lessonRepository.save(lesson);
                
                final Lesson savedLesson = lesson;
                boolean alreadyInModule = module.getLessons().stream()
                    .anyMatch(l -> l.getId() != null && l.getId().equals(savedLesson.getId()));

                if (!alreadyInModule) {
                    module.getLessons().add(lesson);
                }
                moduleRepository.save(module);
                System.out.println("Saved lesson: " + lesson.getTitle() + " in module: " + module.getTitle());
            } else {
                System.err.println("Module not found: " + moduleTitle + " for course: " + courseTitle);
            }
        } else {
            System.err.println("Course not found: " + courseTitle);
        }
    }
}
