package com.ecommerce.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank @Size(min = 2, max = 100)
    private String name;

    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 6, max = 100)
    private String password;

    private String phone;

    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public String getPhone()    { return phone; }

    public void setName(String name)         { this.name = name; }
    public void setEmail(String email)       { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setPhone(String phone)       { this.phone = phone; }
}
