package com.example.nln_project.repository;

import com.example.nln_project.model.ConsultationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ConsultationRequestRepo extends MongoRepository<ConsultationRequest, String> {
    List<ConsultationRequest> findByUserId(String userId); // Lấy danh sách đăng ký của user
}
