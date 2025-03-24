/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.nln_project.security.services;


import com.example.nln_project.model.Report;
import com.example.nln_project.repository.ReportRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepo reportRepository;

    public Report createReport(Report report) {
        report.setReportedAt(LocalDateTime.now());
        report.setStatus("Chờ duyệt");
        return reportRepository.save(report);
    }

    public Page<Report> getAllReports(int page, int size) {
        return reportRepository.findAll(PageRequest.of(page, size));
    }

    public Optional<Report> getReportById(String id) {
        return reportRepository.findById(id);
    }

    public void deleteReport(String id) {
        reportRepository.deleteById(id);
    }
}
