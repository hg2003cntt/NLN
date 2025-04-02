package com.example.nln_project.controller;

import com.example.nln_project.dto.ConsultationStatusUpdateRequest;
import com.example.nln_project.dto.UpdateCustomerPhone;
import com.example.nln_project.model.ConsultationRequest;
import com.example.nln_project.model.Notification;
import com.example.nln_project.repository.NotificationRepo;
import com.example.nln_project.security.services.AccountDetailsImpl;
import com.example.nln_project.repository.ConsultationRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationRequestRepo consultationRequestRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    // API để đăng ký tư vấn
    @PostMapping("/register")
    public ResponseEntity<?> registerConsultation(@RequestBody ConsultationRequest consultationRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Unauthorized: Người dùng chưa đăng nhập!");
            }

            AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

            // Kiểm tra các trường bắt buộc
            if (consultationRequest.getAvailableTimeSlots() == null || consultationRequest.getAvailableTimeSlots().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn khung giờ tư vấn!");
            }

            if (consultationRequest.getDescription() == null || consultationRequest.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng nhập mô tả vấn đề!");
            }

            if (consultationRequest.getConsultationDate() == null) {
                return ResponseEntity.badRequest().body("Vui lòng chọn ngày tư vấn!");
            }

            // Kiểm tra ngày tư vấn không phải quá khứ
            if (consultationRequest.getConsultationDate().isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body("Ngày tư vấn không hợp lệ!");
            }

            // Check trùng lịch tư vấn
            Optional<ConsultationRequest> existing = consultationRequestRepo.findByConsultationDateAndAvailableTimeSlots(
                            consultationRequest.getConsultationDate(),
                            consultationRequest.getAvailableTimeSlots()
            );
            if (existing.isPresent()) {
                return ResponseEntity.status(409).body("Khung giờ này đã có người đăng ký. Vui lòng chọn khung khác!");
            }

            if (consultationRequest.getFullName() == null || consultationRequest.getFullName().trim().isEmpty()) {
                consultationRequest.setFullName(userDetails.getName());
            }
            if (consultationRequest.getDateOfBirth() == null) {
                consultationRequest.setDateOfBirth(userDetails.getDateOfBirth());
            }
            if (consultationRequest.getPhoneNumber() == null || consultationRequest.getPhoneNumber().trim().isEmpty()) {
                consultationRequest.setPhoneNumber(userDetails.getPhone());
            }

            consultationRequest.setUserId(userDetails.getId());
            consultationRequest.setStatus("Chưa liên hệ");

            // Lưu vào cơ sở dữ liệu
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

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAllRequests")
    public ResponseEntity<?> getAllRequest() {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(consultationRequestRepo.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateConsultationStatus(
            @PathVariable String id,
            @RequestBody ConsultationStatusUpdateRequest request) {
        Optional<ConsultationRequest> consultationOpt = consultationRequestRepo.findById(id);
        if (!consultationOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ConsultationRequest consultation = consultationOpt.get();
        consultation.setStatus(request.getStatus());


//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

        // Nếu trạng thái là "Hủy bỏ", lưu lý do
        if ("Hủy bỏ".equals(request.getStatus())) {
            String detail = "ngày " + consultation.getConsultationDate()+" vào khung giờ "+consultation.getAvailableTimeSlots();
            Notification notification = new Notification(
                    consultation.getUserId(),
                    null,
                    null,
                    null,
                    "Lịch đăng ký " + detail + " bị hủy bỏ vì lý do: " + request.getCancelReason()

            );
            notificationRepo.save(notification);
        }

        consultationRequestRepo.save(consultation);
        return ResponseEntity.ok(consultation);
    }


    // Tìm kiếm khách hàng theo số điện thoại
    @GetMapping("/admin/search")
    public ResponseEntity<?> searchCustomerByPhone(@RequestParam String phone) {
        try {
            List<ConsultationRequest> customers = consultationRequestRepo.findAll()
                    .stream()
                    .filter(c -> c.getPhoneNumber().equals(phone))
                    .toList();

            if (customers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy khách hàng!");
            }

            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tìm kiếm khách hàng!");
        }
    }

    // Cập nhật số điện thoại khách hàng
    @PutMapping("/{id}/update-phone")
    public ResponseEntity<?> updateCustomerPhone(@PathVariable String id, @RequestBody UpdateCustomerPhone request) {
        Optional<ConsultationRequest> consultationOpt = consultationRequestRepo.findById(id);
        if (!consultationOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy khách hàng!");
        }

        ConsultationRequest customer = consultationOpt.get();
        customer.setPhoneNumber(request.getPhone()); // ✅ Lưu đúng số điện thoại
        consultationRequestRepo.save(customer);

        return ResponseEntity.ok("Cập nhật số điện thoại thành công!");
    }

    @GetMapping("/booked-slots")
    public ResponseEntity<?> getBookedSlots(@RequestParam("date") LocalDate date) {
        List<ConsultationRequest> booked = consultationRequestRepo.findByConsultationDate(date);

        List<String> takenSlots = booked.stream()
                .map(ConsultationRequest::getAvailableTimeSlots)
                .distinct()
                .toList();

        return ResponseEntity.ok(takenSlots);
    }


}
