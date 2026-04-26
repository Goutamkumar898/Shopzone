package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @Column(name = "payment_id", length = 100)
    private String paymentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Payment() {}

    public Long getId()                 { return id; }
    public Order getOrder()             { return order; }
    public String getPaymentId()        { return paymentId; }
    public BigDecimal getAmount()       { return amount; }
    public PaymentStatus getStatus()    { return status; }
    public String getPaymentMethod()    { return paymentMethod; }
    public String getGatewayResponse()  { return gatewayResponse; }
    public LocalDateTime getPaidAt()    { return paidAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id)                      { this.id = id; }
    public void setOrder(Order order)               { this.order = order; }
    public void setPaymentId(String paymentId)      { this.paymentId = paymentId; }
    public void setAmount(BigDecimal amount)        { this.amount = amount; }
    public void setStatus(PaymentStatus status)     { this.status = status; }
    public void setPaymentMethod(String v)          { this.paymentMethod = v; }
    public void setGatewayResponse(String v)        { this.gatewayResponse = v; }
    public void setPaidAt(LocalDateTime paidAt)     { this.paidAt = paidAt; }
    public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Payment p = new Payment();
        public Builder order(Order v)               { p.order = v; return this; }
        public Builder paymentId(String v)          { p.paymentId = v; return this; }
        public Builder amount(BigDecimal v)         { p.amount = v; return this; }
        public Builder status(PaymentStatus v)      { p.status = v; return this; }
        public Builder paymentMethod(String v)      { p.paymentMethod = v; return this; }
        public Builder gatewayResponse(String v)    { p.gatewayResponse = v; return this; }
        public Builder paidAt(LocalDateTime v)      { p.paidAt = v; return this; }
        public Payment build()                      { return p; }
    }

    public enum PaymentStatus { PENDING, SUCCESS, FAILED, REFUNDED }
}
