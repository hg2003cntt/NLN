package com.example.nln_project.model;

import com.example.nln_project.validation.annotation.Adult;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "accounts")
@Data //nhớ đổi file pom.xml
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    private String id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 20)
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

    @DBRef //Khác với signup request/Khóa ngoaai
    private Set<Role> roles = new HashSet<>();

    public Account(String username, String password, String name, LocalDate dateOfBirth, String email, String phone) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.phone = phone;
    }

}
