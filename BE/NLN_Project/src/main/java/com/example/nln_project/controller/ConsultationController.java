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
    public ResponseEntity<?> registerConsultation(@Valid @RequestBody ConsultationRequest consultationRequest) {
        // Lấy thông tin người dùng đang đăng nhập
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

        // Gán userId của tài khoản hiện tại vào request
        consultationRequest.setUserId(userDetails.getId());

        // Lưu vào MongoDB
        consultationRequestRepo.save(consultationRequest);

        return ResponseEntity.ok("Đăng ký tư vấn thành công!");
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
