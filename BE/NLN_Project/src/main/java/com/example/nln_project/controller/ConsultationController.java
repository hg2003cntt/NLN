package com.example.nln_project.controller;

import com.example.nln_project.model.ConsultationRequest;
import com.example.nln_project.security.services.AccountDetailsImpl;
import com.example.nln_project.repository.ConsultationRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationRequestRepo consultationRequestRepo;

    // API để đăng ký tư vấn
    @PostMapping("/register")
    public ResponseEntity<?> registerConsultation(@RequestBody ConsultationRequest consultationRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

            if (consultationRequest.getAvailableTimeSlots() == null ) {
                return ResponseEntity.badRequest().body("Vui lòng chọn khung giờ tư vấn!");
            }

            consultationRequest.setFullName(userDetails.getName());
            consultationRequest.setDateOfBirth(userDetails.getDateOfBirth());
            consultationRequest.setPhoneNumber(userDetails.getPhone());
            consultationRequest.setUserId(userDetails.getId());

            consultationRequestRepo.save(consultationRequest);
            return ResponseEntity.ok("Đăng ký tư vấn thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi đăng ký tư vấn: " + e.getMessage());
        }
    }

    // API để lấy danh sách yêu cầu tư vấn của user hiện tại
    @GetMapping("/myrequests")
    public ResponseEntity<?> getUserConsultations() {
        // Lấy thông tin user đang đăng nhập
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

        // Lấy danh sách yêu cầu tư vấn của user
        List<ConsultationRequest> requests = consultationRequestRepo.findByUserId(userDetails.getId());

        return ResponseEntity.ok(requests);
    }
}
