package com.example.nln_project.payload.response;

import lombok.Data;

import java.util.List;
@Data
public class JwtResponse {
    private String token;
    private String id;
    private String username;
    private String name;
    private String email;
    private String phone;
    private List<String> roles;

    public JwtResponse(String token, String id, String username, String name, String email, String phone, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.roles = roles;
    }
}
