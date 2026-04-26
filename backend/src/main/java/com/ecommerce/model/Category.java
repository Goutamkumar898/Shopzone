package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "categories")
public class Category {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    public Category() {}

    public Long getId()               { return id; }
    public String getName()           { return name; }
    public String getDescription()    { return description; }
    public String getImageUrl()       { return imageUrl; }
    public List<Product> getProducts(){ return products; }

    public void setId(Long id)              { this.id = id; }
    public void setName(String name)        { this.name = name; }
    public void setDescription(String v)    { this.description = v; }
    public void setImageUrl(String v)       { this.imageUrl = v; }
    public void setProducts(List<Product> v){ this.products = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Category c = new Category();
        public Builder id(Long v)           { c.id = v; return this; }
        public Builder name(String v)       { c.name = v; return this; }
        public Builder description(String v){ c.description = v; return this; }
        public Builder imageUrl(String v)   { c.imageUrl = v; return this; }
        public Category build()             { return c; }
    }
}
