package com.example.nln_project.security.services;

import com.example.nln_project.model.ConsultationRequest;
import com.example.nln_project.repository.ConsultationRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationRequestService {
    @Autowired
    private ConsultationRequestRepo repository;

    public List<ConsultationRequest> getAllCustomers() {
        return repository.findAll();
    }

    public List<ConsultationRequest> getRequestsByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public ConsultationRequest getCustomerById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<ConsultationRequest> searchCustomerByPhone(String phone) {
        return repository.findAll().stream()
                .filter(c -> c.getPhoneNumber().equals(phone))
                .toList();
    }

    public ConsultationRequest updateCustomerPhone(String id, String newPhoneNumber) {
        Optional<ConsultationRequest> customerOpt = repository.findById(id);
        if (customerOpt.isPresent()) {
            ConsultationRequest customer = customerOpt.get();
            customer.setPhoneNumber(newPhoneNumber);
            return repository.save(customer);
        }
        return null;
    }
}
