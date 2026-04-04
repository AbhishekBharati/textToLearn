package com.textToLearn.Consumer.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "modules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Module {
    @Id
    private String id;
    private String title;
    
    @DocumentReference(lazy = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Course course;
    
    @DocumentReference
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Lesson> lessons = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
