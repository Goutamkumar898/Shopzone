package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false, length = 100)
    private String name;

    @Email @NotBlank @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonIgnore @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phone;

    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private Role role = Role.CUSTOMER;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Order> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cart> cartItems;

    public User() {}

    public Long getId()                  { return id; }
    public String getName()             { return name; }
    public String getEmail()            { return email; }
    public String getPassword()         { return password; }
    public String getPhone()            { return phone; }
    public Role getRole()               { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Order> getOrders()      { return orders; }
    public List<Cart> getCartItems()    { return cartItems; }

    public void setId(Long id)                        { this.id = id; }
    public void setName(String name)                  { this.name = name; }
    public void setEmail(String email)                { this.email = email; }
    public void setPassword(String password)          { this.password = password; }
    public void setPhone(String phone)                { this.phone = phone; }
    public void setRole(Role role)                    { this.role = role; }
    public void setCreatedAt(LocalDateTime v)         { this.createdAt = v; }
    public void setOrders(List<Order> v)              { this.orders = v; }
    public void setCartItems(List<Cart> v)            { this.cartItems = v; }

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User u = new User();
        public Builder id(Long v)         { u.id       = v; return this; }
        public Builder name(String v)     { u.name     = v; return this; }
        public Builder email(String v)    { u.email    = v; return this; }
        public Builder password(String v) { u.password = v; return this; }
        public Builder phone(String v)    { u.phone    = v; return this; }
        public Builder role(Role v)       { u.role     = v; return this; }
        public User build()               { return u; }
    }

    public enum Role { ADMIN, CUSTOMER }
}
