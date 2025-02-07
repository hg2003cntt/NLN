package com.example.nln_project.Model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data //nhớ đổi file pom.xml
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    private String username;
    private String password;
    @Override
    public String toString() {
        return "Account{" +
                "username=" + username +
                ", pass='" + password+
                '}';
    }
}
