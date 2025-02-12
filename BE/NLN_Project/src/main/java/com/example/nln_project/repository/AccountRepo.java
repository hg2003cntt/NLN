package com.example.nln_project.repository;

import com.example.nln_project.model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface AccountRepo extends MongoRepository<Account,String> {
    Optional<Account> findByUsername(String username);
    Optional<Account> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
