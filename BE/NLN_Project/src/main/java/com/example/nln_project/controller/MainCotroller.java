package com.example.nln_project.controller;

import com.example.nln_project.model.Account;
import com.example.nln_project.repository.AccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainCotroller {
    @Autowired
    AccountRepo accountRepo;
    @PostMapping("/addAccount")
    public void addAccount(@RequestBody Account account){
        System.out.println(account);
        accountRepo.save(account);
    }
}
