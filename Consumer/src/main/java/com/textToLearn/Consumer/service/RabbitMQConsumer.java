package com.textToLearn.Consumer.service;

import com.textToLearn.Consumer.dto.CourseRequest;
import com.textToLearn.Consumer.dto.FullCourseResponse;
import com.textToLearn.Consumer.service.impl.OpenAICourseGeneration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQConsumer {

    private final CourseGenerationService courseGenerationService;

    public RabbitMQConsumer(OpenAICourseGeneration openAICourseGeneration){
        this.courseGenerationService = openAICourseGeneration;
    }

    @RabbitListener(queues = "${rabbitmq.queue}", containerFactory = "jsonListenerContainerFactory")
    public void consume(CourseRequest request) {
        String topic = request.getMessage();
        System.out.println("Generating course for topic: " + topic);
        FullCourseResponse response = courseGenerationService.generateFullCourse(topic);
        System.out.println("Generated Course Content:\n" + response);
    }
}
