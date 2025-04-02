package com.example.nln_project.dto;

import lombok.Data;

@Data
public class ConsultationStatusUpdateRequest {
    private String status;
    private String cancelReason; // Lý do hủy bỏ
}
