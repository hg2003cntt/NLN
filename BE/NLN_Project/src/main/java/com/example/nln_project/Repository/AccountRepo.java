package com.example.nln_project.Repository;

import com.example.nln_project.Model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepo extends MongoRepository<Account,String> {
}
