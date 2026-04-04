package com.textToLearn.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data @AllArgsConstructor
@NoArgsConstructor @Builder
public class User {
  @Id
  private String sub;

  private String email;
  private String name;

  @Builder.Default
  private List<String> recentCourseIds = new ArrayList<>();
}
