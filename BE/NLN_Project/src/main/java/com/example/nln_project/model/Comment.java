package com.example.nln_project.model;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
@Data
@NoArgsConstructor
public class Comment {
    @Id
    private String id;
    private String userId;
    private String name; 
    private String postId;
    private String content;
    private Long createdAt;
    private String parentId;


    public Comment(String userId, String name, String postId, String content, String parentId) {
        this.userId = userId;
        this.name = name;
        this.postId = postId;
        this.content = content;
        this.parentId = parentId;
        this.createdAt = System.currentTimeMillis();
    }
}

