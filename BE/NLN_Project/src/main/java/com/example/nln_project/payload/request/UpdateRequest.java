package com.example.nln_project.payload.request;

import com.example.nln_project.validation.annotation.Adult;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateRequest {
    @NotBlank
    @Size(min = 5, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotNull(message = "Ngày sinh không được để trống.")
    @Adult
    private LocalDate dateOfBirth;

    @NotBlank
    @Email
    @Size(max = 50)
    private String email;

    @NotBlank
    private String phone;

    private String password; // Không bắt buộc nhập khi cập nhật
}
