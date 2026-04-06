package com.textToLearn.Consumer.config;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.queue}")
    private String queue;

    @Value("${rabbitmq.persistence.queue}")
    private String persistenceQueue;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing-key}")
    private String routingKey;

    @Value("${rabbitmq.persistence.routing-key}")
    private String persistenceRoutingKey;

    @Bean
    public Queue queue() {
        return new Queue(queue);
    }

    @Bean
    public Queue persistenceQueue() {
        return new Queue(persistenceQueue);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(routingKey);
    }

    @Bean
    public Binding persistenceBinding(Queue persistenceQueue, TopicExchange exchange) {
        return BindingBuilder.bind(persistenceQueue).to(exchange).with(persistenceRoutingKey);
    }

    @Bean
    public ObjectMapper lenientObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER.mappedFeature(), true);
        mapper.configure(JsonReadFeature.ALLOW_JAVA_COMMENTS.mappedFeature(), true);
        mapper.configure(JsonReadFeature.ALLOW_YAML_COMMENTS.mappedFeature(), true);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        mapper.configure(DeserializationFeature.UNWRAP_SINGLE_VALUE_ARRAYS, true);
        return mapper;
    }

    @Bean
    public MessageConverter jsonMessageConverter(ObjectMapper lenientObjectMapper) {
        return new Jackson2JsonMessageConverter(lenientObjectMapper);
    }

    // DEDICATED TEMPLATE for sending JSON (AI Generator will use this)
    @Bean(name = "persistenceRabbitTemplate")
    public RabbitTemplate persistenceRabbitTemplate(ConnectionFactory connectionFactory, ObjectMapper lenientObjectMapper) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter(lenientObjectMapper));
        return template;
    }

    // DEDICATED FACTORY for receiving JSON (PersistenceConsumer will use this)
    @Bean
    public SimpleRabbitListenerContainerFactory jsonListenerContainerFactory(ConnectionFactory connectionFactory, ObjectMapper lenientObjectMapper) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter(lenientObjectMapper));
        return factory;
    }
}
