package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public OrderItem() {}

    public Long getId()           { return id; }
    public Order getOrder()       { return order; }
    public Product getProduct()   { return product; }
    public Integer getQuantity()  { return quantity; }
    public BigDecimal getPrice()  { return price; }

    public void setId(Long id)              { this.id = id; }
    public void setOrder(Order order)       { this.order = order; }
    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(Integer qty)    { this.quantity = qty; }
    public void setPrice(BigDecimal price)  { this.price = price; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrderItem oi = new OrderItem();
        public Builder order(Order v)       { oi.order = v; return this; }
        public Builder product(Product v)   { oi.product = v; return this; }
        public Builder quantity(Integer v)  { oi.quantity = v; return this; }
        public Builder price(BigDecimal v)  { oi.price = v; return this; }
        public OrderItem build()            { return oi; }
    }
}
