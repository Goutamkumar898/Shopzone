package com.ecommerce.dto;

import com.ecommerce.model.User;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long   id;
    private String name;
    private String email;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String token, User user) {
        this.token = token;
        this.id    = user.getId();
        this.name  = user.getName();
        this.email = user.getEmail();
        this.role  = user.getRole().name();
    }

    public String getToken() { return token; }
    public String getType()  { return type; }
    public Long getId()      { return id; }
    public String getName()  { return name; }
    public String getEmail() { return email; }
    public String getRole()  { return role; }

    public void setToken(String token) { this.token = token; }
    public void setType(String type)   { this.type = type; }
    public void setId(Long id)         { this.id = id; }
    public void setName(String name)   { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role)   { this.role = role; }
}
