package com.example.nln_project.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
@Data
@NoArgsConstructor
public class Like {
    @Id
    String id;
    String userId;
    String postId;

    public Like(String userId, String postId) {
        this.userId = userId;
        this.postId = postId;
    }
}
