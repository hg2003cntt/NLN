package com.example.nln_project.controller;

import com.example.nln_project.model.Account;
import com.example.nln_project.model.AccountRole;
import com.example.nln_project.model.Role;
import com.example.nln_project.payload.request.LoginRequest;
import com.example.nln_project.payload.response.JwtResponse;
import com.example.nln_project.payload.response.MessageResponse;
import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.payload.request.SignupRequest;
import com.example.nln_project.repository.RoleRepo;
import com.example.nln_project.security.jwt.JwtUtils;
import com.example.nln_project.security.services.AccountDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Allow cross-origin requests for all origins
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AccountRepo accountRepo;

    @Autowired
    RoleRepo roleRepo;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts() {
        List<Account> accounts = accountRepo.findAll();
        if (accounts.isEmpty()) {
            return new ResponseEntity<>("No account available", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                            loginRequest.getPassword()));

            System.out.println(loginRequest.getUsername() + ";" + loginRequest.getPassword());

            // Lưu authentication vào SecurityContextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Tạo JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);
            System.out.println("token: " + jwt);

            // Lấy thông tin người dùng
            AccountDetailsImpl accountDetails = (AccountDetailsImpl) authentication.getPrincipal();

            // Lấy danh sách quyền
            List<String> roles = new ArrayList<>();
            for (GrantedAuthority authority : accountDetails.getAuthorities()) {
                roles.add(authority.getAuthority());
            }

            return ResponseEntity.ok(new JwtResponse(jwt,
                    accountDetails.getId(),
                    accountDetails.getUsername(),
                    accountDetails.getName(),
                    accountDetails.getEmail(),
                    accountDetails.getPhone(),
                    roles)
            );

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username or password is incorrect!");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống!");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        // Check if the username is already taken
        if (accountRepo.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if the email is already in use
        if (accountRepo.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create a new user's account
        Account account = new Account(signupRequest.getUsername(), encoder.encode(signupRequest.getPassword()), signupRequest.getName(),
                signupRequest.getDateOfBirth(), signupRequest.getEmail(), signupRequest.getPhone()
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
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        Account user = accountRepo.findByUsername(userDetails.getUsername()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(user);
    }
}
