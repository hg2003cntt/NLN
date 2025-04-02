package com.example.nln_project.repository;

import com.example.nln_project.model.ConsultationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ConsultationRequestRepo extends MongoRepository<ConsultationRequest, String> {
    List<ConsultationRequest> findByUserId(String userId); // Lấy danh sách đăng ký của user

    Optional<ConsultationRequest> findByConsultationDateAndAvailableTimeSlots(LocalDate consultationDate, String availableTimeSlots);

    List<ConsultationRequest> findByConsultationDate(LocalDate consultationDate);

}
