package com.example.nln_project.model;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Data
public class ReportSummary {
    private String reportedUserId;
    private String contentId;
    private String contentType;
    private int reportCount;
    private String mostCommonReason;
    private LocalDate latestReportedAt;
    private String status;

    private Map<String, Integer> reasonCount = new HashMap<>();

    public ReportSummary(String reportedUserId, String contentId, String contentType) {
        this.reportedUserId = reportedUserId;
        this.contentId = contentId;
        this.contentType = contentType;
        this.reportCount = 0;
    }

    public void incrementReportCount() {
        this.reportCount++;
    }

    public void addReason(String reason) {
        reasonCount.put(reason, reasonCount.getOrDefault(reason, 0) + 1);
        updateMostCommonReason();
    }

    private void updateMostCommonReason() {
        this.mostCommonReason = reasonCount.entrySet().stream()
                .max(Comparator.comparingInt(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse("Không có lý do");
    }

    public void updateLatestReportedAt(LocalDateTime reportedAt) {
        LocalDate date = reportedAt.toLocalDate();
        if (this.latestReportedAt == null || date.isAfter(this.latestReportedAt)) {
            this.latestReportedAt = date;
        }
    }
}
