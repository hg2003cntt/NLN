package com.example.nln_project.controller;

import com.example.nln_project.model.Account;
import com.example.nln_project.repository.AccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Account user = accountRepo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User không tồn tại!"));
            ///  Giữ ảnh cũ
            String base64Image = request.get("avatar");
            if (base64Image != null && !base64Image.trim().isEmpty()) {
                user.setAvatar(base64Image);
                accountRepo.save(user);
            }

            return ResponseEntity.ok("Avatar đã được cập nhật!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật avatar!");
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@RequestBody Map<String, String> request) {
        try {
            //  Xác định user từ token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Account user = accountRepo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User không tồn tại!"));

            //  Chỉ cập nhật số điện thoại
            user.setPhone(request.getOrDefault("phone", user.getPhone()));
            accountRepo.save(user);

            return ResponseEntity.ok("Cập nhật số điện thoại thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật số điện thoại!");
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName(); // Lấy tên người dùng từ token
            Account user = accountRepo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User không tồn tại!"));

            // Lấy mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới từ request
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");

            // Kiểm tra mật khẩu cũ có đúng không
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu cũ không chính xác!");
            }

            // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
            if (oldPassword.equals(newPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu mới không được giống mật khẩu cũ!");
            }

            // Mã hóa mật khẩu mới
            user.setPassword(passwordEncoder.encode(newPassword));
            accountRepo.save(user);

            return ResponseEntity.ok("Cập nhật mật khẩu thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật mật khẩu!");
        }
    }


}
