package com.textToLearn.Consumer.service.impl;

import com.textToLearn.Consumer.dto.*;
import com.textToLearn.Consumer.service.CourseGenerationService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.client.ChatClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OpenAICourseGeneration implements CourseGenerationService {

    private final ChatClient chatClient;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.persistence.routing-key}")
    private String persistenceRoutingKey;

    public OpenAICourseGeneration(ChatClient.Builder builder, @Qualifier("persistenceRabbitTemplate") RabbitTemplate rabbitTemplate){
        this.chatClient = builder.build();
        this.rabbitTemplate = rabbitTemplate;
    }

    public FullCourseResponse generateFullCourse(String topic){
        CourseResponse courseOutline = generateOutline(topic);

        // Publish Course Outline for Persistence
        rabbitTemplate.convertAndSend(exchange, persistenceRoutingKey, 
            PersistenceMessage.builder()
                .type(PersistenceMessage.Type.COURSE_OUTLINE)
                .data(courseOutline)
                .build());

        List<ModuleContent> fullModules = courseOutline.modules().parallelStream().map( module -> {

            List<LessonContent> detailedLessons = module.lessons().parallelStream().map(lesson -> {
                LessonContent lessonContent = generateLessonContent(courseOutline.title(), module.title(), lesson.title());
                
                // Publish Lesson Content for Persistence
                rabbitTemplate.convertAndSend(exchange, persistenceRoutingKey,
                    PersistenceMessage.builder()
                        .type(PersistenceMessage.Type.LESSON_CONTENT)
                        .data(lessonContent)
                        .courseTitle(courseOutline.title())
                        .moduleTitle(module.title())
                        .build());
                        
                return lessonContent;
            }).collect(Collectors.toList());

            return new ModuleContent(module.title(), detailedLessons);
        }).collect(Collectors.toList());
        return new FullCourseResponse(
                courseOutline.title(),
                courseOutline.description(),
                courseOutline.tags(),
                fullModules
        );
    }

    public CourseResponse generateOutline(String topic){
        var outputConverter = new BeanOutputConverter<>(CourseResponse.class);
        String outlinePrompt = """
                You are an expert curriculum designer. Create a highly structured course outline for the topic: "{topic}".
                The curriculum must progress logically from foundational to advanced concepts.

                {format}
                """;

        return chatClient.prompt()
                .user(user -> user
                        .text(outlinePrompt)
                        .param("topic", topic)
                        .param("format", outputConverter.getFormat())
                )
                .call()
                .entity(outputConverter);
    }

    private LessonContent generateLessonContent(String courseTitle, String moduleTitle, String lessonTitle) {
        var outputConverter = new BeanOutputConverter<>(LessonContent.class);

        String lessonPrompt = """
                You are an expert technical instructor. Generate detailed lesson content for a specific lesson within a course.
                Course Title: "{courseTitle}"
                Module Title: "{moduleTitle}"
                Lesson Title: "{lessonTitle}"

                Rules:
                1. Provide 2-3 clear learning objectives.
                2. The content array must use these specific block types: "heading", "paragraph", "code", "video", "mcq".
                3. Include a "video" block with a highly relevant YouTube search query (do not provide a direct URL).
                4. Include a "code" block ONLY if it is directly relevant to the topic.
                5. End the content array with 4-5 "mcq" blocks. Each MCQ must include the question, an array of options, the correct answer index, and a brief explanation.
                
                {format}
                """;

        return chatClient.prompt()
                .user(user -> user
                        .text(lessonPrompt)
                        .param("courseTitle", courseTitle)
                        .param("moduleTitle", moduleTitle)
                        .param("lessonTitle", lessonTitle)
                        .param("format", outputConverter.getFormat())
                )
                .call()
                .entity(outputConverter);
    }
}
