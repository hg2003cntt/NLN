package com.example.nln_project.model;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
public class Notification {
    @Id
    private String id;
        
    @NotBlank
    private String userId; // Người nhận thông báo

    @NotBlank
    private String senderId; // Người gửi thông báo

    @NotBlank
    private String postId; // Bài viết liên quan (nếu có)

    private String commentId; // Bình luận liên quan (nếu có)

    private String message; // Nội dung thông báo
    private boolean isRead = false; // Trạng thái đã đọc hay chưa
    private Date createdAt = new Date();

    public Notification(String userId, String senderId, String postId, String commentId, String message) {
        this.userId = userId;
        this.senderId = senderId;
        this.postId = postId;
        this.commentId = commentId;
        this.message = message;
        this.createdAt = new Date(System.currentTimeMillis());
    }

    // Phương thức sinh đường dẫn điều hướng dựa vào postId và commentId
    public String getLink() {
        if (commentId != null && !commentId.isEmpty()) {
            return "/article/" + postId + "#comment-" + commentId; // Điều hướng đến bài viết với anchor bình luận
        } else if (postId != null && !postId.isEmpty()) {
            return "/article/" + postId;
        }
        return "/home"; // Nếu không có postId, về trang chủ
    }
}
