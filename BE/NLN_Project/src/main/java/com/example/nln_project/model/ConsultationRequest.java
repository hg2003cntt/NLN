package com.example.nln_project.model;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "consultation_requests") // Lưu vào MongoDB collection này
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequest {
    @Id
    private String id;

    @NotBlank
    private String fullName;

    @NotBlank
    private String phoneNumber;

    @NotNull
    private LocalDate dateOfBirth;

    private String description = ""; // Mô tả vấn đề (không bắt buộc)

    @NotBlank
    private String availableTimeSlots; // Bắt buộc phải có khung giờ tư vấn

    private String userId; // Liên kết với tài khoản đã đăng nhập
}
