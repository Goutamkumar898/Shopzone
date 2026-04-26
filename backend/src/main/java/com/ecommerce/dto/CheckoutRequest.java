package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckoutRequest {

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String paymentMethod;

    public String getShippingAddress() { return shippingAddress; }
    public String getPaymentMethod()   { return paymentMethod; }
    public void setShippingAddress(String v) { this.shippingAddress = v; }
    public void setPaymentMethod(String v)   { this.paymentMethod = v; }
}
