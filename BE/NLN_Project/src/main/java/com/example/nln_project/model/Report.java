package com.example.nln_project.model;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reports")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Report {
    @Id
    private String id;
    private String reporterId;
    private String reportedUserId;
    private String contentId;
    private String contentType; // "POST" hoặc "COMMENT"
    private String reason;
    private LocalDateTime reportedAt;
    private String status; // "PENDING", "APPROVED", "REJECTED"

}

