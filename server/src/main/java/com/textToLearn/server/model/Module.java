package com.textToLearn.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
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
    
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Object> lessons = new ArrayList<>(); // Use Object if Lesson model isn't needed in server yet

    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
