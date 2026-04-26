package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
public class Cart {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;

    public Cart() {}

    public Long getId()               { return id; }
    public User getUser()             { return user; }
    public Product getProduct()       { return product; }
    public Integer getQuantity()      { return quantity; }
    public LocalDateTime getAddedAt() { return addedAt; }

    public void setId(Long id)              { this.id = id; }
    public void setUser(User user)          { this.user = user; }
    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(Integer qty)    { this.quantity = qty; }
    public void setAddedAt(LocalDateTime v) { this.addedAt = v; }

    @PrePersist
    protected void onCreate() { this.addedAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Cart c = new Cart();
        public Builder id(Long v)           { c.id = v; return this; }
        public Builder user(User v)         { c.user = v; return this; }
        public Builder product(Product v)   { c.product = v; return this; }
        public Builder quantity(Integer v)  { c.quantity = v; return this; }
        public Cart build()                 { return c; }
    }
}
