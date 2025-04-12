package com.example.nln_project.controller;

import com.example.nln_project.model.*;
import com.example.nln_project.payload.request.SignupRequest;
import com.example.nln_project.payload.request.UpdateRequest;

import com.example.nln_project.payload.response.MessageResponse;
import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.repository.PostRepo;
import com.example.nln_project.repository.RoleRepo;

import com.example.nln_project.repository.TopicRepo;
import com.example.nln_project.security.services.AccountDetailsImpl;
import com.example.nln_project.security.services.PostService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.crypto.password.PasswordEncoder;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Chỉ admin có quyền truy cập
public class AdminController {

    @Autowired
    AccountRepo accountRepo;

    @Autowired
    RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private TopicRepo topicRepo;

    @Autowired
    private PostService postService;


    /**
     * Lấy danh sách tất cả tài khoản có role USER
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUserAccounts() {
        List<Account> userAccounts = accountRepo.findAll().stream()
                .filter(account -> account.getRoles().stream()
                        .map(Role::getName)
                        .anyMatch(role -> role.equals(AccountRole.ROLE_USER)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userAccounts);
    }

    /**
     * Tìm kiếm tài khoản USER theo số điện thoại
     */
    @GetMapping("/user/search")
    public ResponseEntity<?> searchUserByPhone(@RequestParam String phone) {
        List<Account> matchingAccounts = accountRepo.findAll().stream()
                .filter(account -> account.getPhone() != null && account.getPhone().equals(phone))
                .collect(Collectors.toList());

        if (matchingAccounts.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: No user found with this phone number!"));
        }

        return ResponseEntity.ok(matchingAccounts);
    }

    /**
     * Cập nhật tài khoản USER
     */
    @PutMapping("/update-account/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable String id, @Valid @RequestBody UpdateRequest updateRequest) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Account not found"));

        // Kiểm tra username đã tồn tại chưa (trừ chính tài khoản đó)
        if (!account.getUsername().equals(updateRequest.getUsername()) &&
            accountRepo.existsByUsername(updateRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        // Kiểm tra email đã tồn tại chưa (trừ chính tài khoản đó)
        if (!account.getEmail().equals(updateRequest.getEmail()) &&
            accountRepo.existsByEmail(updateRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Kiểm tra số điện thoại đã tồn tại chưa (trừ chính tài khoản đó)
        if (!account.getPhone().equals(updateRequest.getPhone()) &&
            accountRepo.existsByPhone(updateRequest.getPhone())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already in use!"));
        }

        // Cập nhật thông tin tài khoản
        account.setUsername(updateRequest.getUsername());
        account.setName(updateRequest.getName());
        account.setDateOfBirth(updateRequest.getDateOfBirth());
        account.setEmail(updateRequest.getEmail());
        account.setPhone(updateRequest.getPhone());

        // Chỉ cập nhật mật khẩu nếu người dùng nhập
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            account.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        accountRepo.save(account);
        return ResponseEntity.ok(new MessageResponse("Account updated successfully!"));
    }


    /**
     * Xóa tài khoản USER (Admin không được tự xóa chính mình)
     */
    @DeleteMapping("/delete-account/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Account not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl currentUser = (AccountDetailsImpl) authentication.getPrincipal();

        // Không cho phép admin tự xóa chính mình
        if (account.getId().equals(currentUser.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: You cannot delete your own account!"));
        }

        accountRepo.delete(account);
        return ResponseEntity.ok(new MessageResponse("Account deleted successfully!"));
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Kiểm tra username đã tồn tại chưa
        if (accountRepo.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        // Kiểm tra email đã tồn tại chưa
        if (accountRepo.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        if (accountRepo.existsByPhone(signUpRequest.getPhone())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Phone number is already in use!"));
        }

        // Tạo tài khoản mới với role USER
        Account user = new Account();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setDateOfBirth(signUpRequest.getDateOfBirth());
        user.setEmail(signUpRequest.getEmail());
        user.setPhone(signUpRequest.getPhone());
        user.setStatus("Đang hoạt động");


        // Gán quyền mặc định là ROLE_USER
        Set<Role> roles = new HashSet<>();
        roles.add(roleRepo.findByName(AccountRole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Error: Role USER không tồn tại!")));
        user.setRoles(roles);

        accountRepo.save(user);
        return ResponseEntity.ok(new MessageResponse("User created successfully!"));
    }

    @GetMapping("/posts/article-by-date")
    public ResponseEntity<?> getPostStatsByDate(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        List<Post> posts = postRepo.findAll();

        Map<LocalDate, Long> result = posts.stream()
                .filter(p -> p.getCreatedAt() != null)
                .filter(p -> {
                    LocalDate created = p.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    return (!created.isBefore(from) && !created.isAfter(to));
                })
                .collect(Collectors.groupingBy(
                        p -> p.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                        Collectors.counting()
                ));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/posts/article-by-topic")
    public ResponseEntity<?> getPostStatsByTopic() {
        List<Topic> topics = topicRepo.findAll();
        List<Post> posts = postRepo.findAll();
        Map<String, Long> stats = topics.stream().collect(Collectors.toMap(
                Topic::getName,
                topic -> posts.stream()
                        .filter(p -> topic.getId().equals(p.getTopicId()))
                        .count()
        ));
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/posts/top-interacted")
    public ResponseEntity<?> getTopInteractedPosts() {
        List<Post> topPosts = postService.getTopInteractedPosts(5); // lấy top 10

        List<Map<String, Object>> result = topPosts.stream().map(post -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", post.getTitle());
            map.put("author", post.getAuthor());
            map.put("likeCount", post.getLikeCount());
            map.put("cmtCount", post.getCmtCount());
            map.put("totalInteractions", post.getLikeCount() + post.getCmtCount());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/top-writers")
    public ResponseEntity<?> getTopWriters() {
        List<Map<String, Object>> topWriters = postService.getTopWriters(5);
        return ResponseEntity.ok(topWriters);
    }

    @GetMapping("/users/top-commenters")
    public ResponseEntity<?> getTopCommenters() {
        List<Map<String, Object>> topCommenters = postService.getTopCommenters(5);
        return ResponseEntity.ok(topCommenters);
    }




}
