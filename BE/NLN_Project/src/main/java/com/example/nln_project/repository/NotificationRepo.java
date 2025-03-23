package com.example.nln_project.repository;

import com.example.nln_project.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepo extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdAndIsReadFalse(String userId); // Lấy thông báo chưa đọc
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId); // Lấy tất cả thông báo, sắp xếp theo thời gian
}
