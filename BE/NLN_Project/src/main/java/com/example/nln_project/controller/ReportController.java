package com.example.nln_project.controller;

import com.example.nln_project.model.*;
import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.repository.NotificationRepo;
import com.example.nln_project.repository.ReportRepo;
import com.example.nln_project.security.services.NotificationService;
import com.example.nln_project.security.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    @Autowired
    private ReportService reportService;
    @Autowired
    private ReportRepo reportRepo;

    private NotificationService notificationService;
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private AccountRepo accountRepo;

    @PostMapping("/create")
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportService.createReport(report));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ admin mới có quyền xem tất cả báo cáo
    public ResponseEntity<?> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Report> reportsPage = reportService.getAllReports(page, size);

        // Nhóm báo cáo theo contentId
        Map<String, ReportSummary> groupedReports = new HashMap<>();

        for (Report report : reportsPage.getContent()) {
            String contentId = report.getContentId();
            groupedReports.putIfAbsent(contentId, new ReportSummary(report.getReportedUserId(),contentId, report.getContentType()));

            ReportSummary summary = groupedReports.get(contentId);
            summary.incrementReportCount();
            summary.addReason(report.getReason());
            summary.updateLatestReportedAt(report.getReportedAt());
            summary.setStatus(report.getStatus());
        }

        // Chuyển map thành danh sách
        List<ReportSummary> summaryList = new ArrayList<>(groupedReports.values());

        return ResponseEntity.ok(new PageImpl<>(summaryList, reportsPage.getPageable(), reportsPage.getTotalElements()));
    }

    @GetMapping("/checkReported")
    public ResponseEntity<Boolean> checkReported(@PathVariable String contentId,
                                            @RequestParam String reporterId){
        Optional<Report> existingReport =  reportRepo.findByContentIdAndReporterId(contentId, reporterId);
        return ResponseEntity.ok(existingReport.isPresent());
    }
    @PutMapping("/{contentId}/updateStatus")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable String contentId,
            @RequestParam String status) {

        // 🔥 Lấy tất cả báo cáo liên quan đến contentId
        List<Report> reports = reportRepo.findByContentId(contentId);

        if (reports.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy báo cáo!");
        }

        // 🔥 Cập nhật trạng thái mới cho tất cả báo cáo
        for (Report report : reports) {
            report.setStatus(status);
        }
        reportService.saveAll(reports);

        if (status.equals("Chờ duyệt")) {
            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        }

        //Chỉ thực hiện khi từ chối hoặc giải quyết báo cáo
        // Lấy danh sách người báo cáo
        Set<String> reporters = reports.stream()
                .map(Report::getReporterId)
                .collect(Collectors.toSet());


        // Lấy người bị báo cáo
        String reportedUserId = reportRepo.findByContentId(contentId).get(0).getReportedUserId();


        // tách post và cmt id
        // Tách contentId
        String[] parts = contentId.split("_");
        String postId = parts[0];
        String cmtId = (parts.length > 1) ? parts[1] : null;

        String noti="";
        if (status.equals("Đã giải quyết")){
            noti += "Quản trị viên đã giải quyết báo cáo vi phạm của bạn về ";

        } else if (status.equals("Từ chối")) {
            noti += "Quản trị viên đã từ chối báo cáo vi phạm của bạn về ";
        }
        if (cmtId != null) {
            noti += "bình luận của ";
        }else noti += "bài viết của " ;

        // Gửi thông báo cho tất cả người báo cáo
        for (String reporterId : reporters) {
            Notification notification = new Notification(
                    reporterId,
                    null,
                    postId,
                    cmtId,
                    noti + accountRepo.findById(reportedUserId).get().getName()
            );
            notificationRepo.save(notification);
        }

        return ResponseEntity.ok("Cập nhật trạng thái thành công!");
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getReportById(@PathVariable String id) {
        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")// Chỉ ADMIN mới có thể xóa báo cáo
    public ResponseEntity<Void> deleteReport(@PathVariable String id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
