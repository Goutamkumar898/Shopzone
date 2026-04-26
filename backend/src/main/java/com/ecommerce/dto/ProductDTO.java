package com.ecommerce.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductDTO {

    private Long id;

    @NotBlank
    private String name;

    private String description;

    @NotNull @Positive
    private BigDecimal price;

    @Min(0)
    private Integer stock;

    private Long categoryId;
    private String imageUrl;
    private BigDecimal rating;

    public Long getId()             { return id; }
    public String getName()         { return name; }
    public String getDescription()  { return description; }
    public BigDecimal getPrice()    { return price; }
    public Integer getStock()       { return stock; }
    public Long getCategoryId()     { return categoryId; }
    public String getImageUrl()     { return imageUrl; }
    public BigDecimal getRating()   { return rating; }

    public void setId(Long id)                  { this.id = id; }
    public void setName(String name)            { this.name = name; }
    public void setDescription(String v)        { this.description = v; }
    public void setPrice(BigDecimal price)      { this.price = price; }
    public void setStock(Integer stock)         { this.stock = stock; }
    public void setCategoryId(Long categoryId)  { this.categoryId = categoryId; }
    public void setImageUrl(String imageUrl)    { this.imageUrl = imageUrl; }
    public void setRating(BigDecimal rating)    { this.rating = rating; }
}
