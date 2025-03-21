package com.example.nln_project.repository;

import com.example.nln_project.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AccountRepo extends MongoRepository<Account, String> {
    Optional<Account> findByUsername(String username);
    Optional<Account> findByEmail(String email);
    Optional<Account> findByPhone(String phone); // Thêm phương thức tìm kiếm theo số điện thoại
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone); // Kiểm tra số điện thoại có tồn tại không
}
