package com.textToLearn.Consumer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersistenceMessage implements Serializable {
    public enum Type {
        COURSE_OUTLINE,
        LESSON_CONTENT
    }

    private Type type;
    private Object data;
    
    // For LESSON_CONTENT, we might need extra context
    private String courseTitle;
    private String moduleTitle;
}
