package com.example.nln_project.payload.request;
import com.example.nln_project.model.Role;
import com.example.nln_project.validation.annotation.Adult;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 5, max = 20)
    private String username;

    @NotBlank
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_])[A-Za-z\\d@$!%*?&_]{8,20}$",
            message = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
    )
    private String password;

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

    //private Set<String> roles;

}
