package com.example.nln_project.repository;

import com.example.nln_project.model.AccountRole;
import com.example.nln_project.model.Report;
import com.example.nln_project.model.Role;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportRepo extends MongoRepository<Report, String> {
    List<Report> findByStatus(String status);
    Page<Report> findAll(Pageable pageable);
    List<Report> findByContentId(String contentId);

    Optional<Report> findByContentIdAndReporterId(String contentId, String reporterId);
}