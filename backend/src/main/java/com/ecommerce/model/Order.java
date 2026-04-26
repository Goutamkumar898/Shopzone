package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    public Order() {}

    public Long getId()                    { return id; }
    public User getUser()                  { return user; }
    public BigDecimal getTotalAmount()     { return totalAmount; }
    public OrderStatus getStatus()         { return status; }
    public String getShippingAddress()     { return shippingAddress; }
    public String getPaymentMethod()       { return paymentMethod; }
    public LocalDateTime getCreatedAt()    { return createdAt; }
    public List<OrderItem> getItems()      { return items; }
    public Payment getPayment()            { return payment; }

    public void setId(Long id)                      { this.id = id; }
    public void setUser(User user)                  { this.user = user; }
    public void setTotalAmount(BigDecimal v)        { this.totalAmount = v; }
    public void setStatus(OrderStatus status)       { this.status = status; }
    public void setShippingAddress(String v)        { this.shippingAddress = v; }
    public void setPaymentMethod(String v)          { this.paymentMethod = v; }
    public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }
    public void setItems(List<OrderItem> items)     { this.items = items; }
    public void setPayment(Payment payment)         { this.payment = payment; }

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Order o = new Order();
        public Builder id(Long v)                  { o.id = v; return this; }
        public Builder user(User v)                { o.user = v; return this; }
        public Builder totalAmount(BigDecimal v)   { o.totalAmount = v; return this; }
        public Builder status(OrderStatus v)       { o.status = v; return this; }
        public Builder shippingAddress(String v)   { o.shippingAddress = v; return this; }
        public Builder paymentMethod(String v)     { o.paymentMethod = v; return this; }
        public Builder items(List<OrderItem> v)    { o.items = v; return this; }
        public Order build()                       { return o; }
    }

    public enum OrderStatus { PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED }
}
