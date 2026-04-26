package com.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull @Positive @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(0) @Column(nullable = false)
    private Integer stock = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Product() {}

    public Long getId()               { return id; }
    public String getName()           { return name; }
    public String getDescription()    { return description; }
    public BigDecimal getPrice()      { return price; }
    public Integer getStock()         { return stock; }
    public Category getCategory()     { return category; }
    public String getImageUrl()       { return imageUrl; }
    public BigDecimal getRating()     { return rating; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public void setId(Long id)                   { this.id = id; }
    public void setName(String name)             { this.name = name; }
    public void setDescription(String v)         { this.description = v; }
    public void setPrice(BigDecimal price)       { this.price = price; }
    public void setStock(Integer stock)          { this.stock = stock; }
    public void setCategory(Category category)   { this.category = category; }
    public void setImageUrl(String imageUrl)     { this.imageUrl = imageUrl; }
    public void setRating(BigDecimal rating)     { this.rating = rating; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Product p = new Product();
        public Builder id(Long v)              { p.id = v; return this; }
        public Builder name(String v)          { p.name = v; return this; }
        public Builder description(String v)   { p.description = v; return this; }
        public Builder price(BigDecimal v)     { p.price = v; return this; }
        public Builder stock(Integer v)        { p.stock = v; return this; }
        public Builder category(Category v)    { p.category = v; return this; }
        public Builder imageUrl(String v)      { p.imageUrl = v; return this; }
        public Builder rating(BigDecimal v)    { p.rating = v; return this; }
        public Product build()                 { return p; }
    }
}
