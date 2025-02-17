package com.example.nln_project.payload.request;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PostUpdateRequest {
    @Id
    private String id;
    @Size(max = 255)
    private String title;

    @Size(max = 5000)
    private String content;
    private String author;
    private String image;
    private String userID;

}
