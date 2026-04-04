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

@Document(collection = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    private String id;
    private String title;
    private String description;
    private String creator; // Typically Auth0 `sub`
    
    @DocumentReference
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Module> modules = new ArrayList<>();
    
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
