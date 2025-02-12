package com.example.nln_project.repository;

import com.example.nln_project.model.AccountRole;
import com.example.nln_project.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepo extends MongoRepository<Role, String> {

    /**
     * Find a Role by its name.
     *
     * @param name The name of the role represented as an AccountRole enum.
     * @return An Optional containing the Role if found, or empty if not found.
     */
    Optional<Role> findByName(AccountRole name);
}