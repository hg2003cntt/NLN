package com.example.nln_project.controller;

import com.example.nln_project.model.Account;
import com.example.nln_project.model.AccountRole;
import com.example.nln_project.model.Role;
import com.example.nln_project.payload.response.MessageResponse;
import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.payload.request.SignupRequest;
import com.example.nln_project.repository.RoleRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class AccountController {
    @Autowired
    AccountRepo accountRepo;

    @Autowired
    RoleRepo roleRepo;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts() {
        List<Account> accounts = accountRepo.findAll();
        if (accounts.isEmpty()) {
            return new ResponseEntity<>("No account available",HttpStatus.NOT_FOUND);
        }else
            return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        //Check if the username is already taken
        if (accountRepo.existsByUsername(signupRequest.getUsername())){
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if the email is already in use
        if (accountRepo.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        System.out.println("nhập vào:"+signupRequest.getUsername());
        //Create a new user's account
        Account account = new Account(signupRequest.getUsername(),encoder.encode(signupRequest.getPassword()), signupRequest.getName(),
                signupRequest.getDateOfBirth(),signupRequest.getEmail(),signupRequest.getPhone()
        );
        System.out.println(account.getUsername());
        Set<Role> roles = new HashSet<>();

        // Mặc định tất cả người dùng đăng ký đều có ROLE_USER
        Role userRole = roleRepo.findByName(AccountRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        account.setRoles(roles);
        accountRepo.save(account);
        return ResponseEntity.ok(new MessageResponse("Successfully registered!"));



    }
}
