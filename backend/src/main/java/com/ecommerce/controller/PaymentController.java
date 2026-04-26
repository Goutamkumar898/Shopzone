package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.model.Payment;
import com.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired private PaymentService paymentService;

    @PostMapping("/process/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> process(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        String method = body.getOrDefault("paymentMethod", "CARD");
        return ResponseEntity.ok(ApiResponse.ok("Payment processed",
                paymentService.processPayment(orderId, method)));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getByOrderId(orderId)));
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> refund(@PathVariable Long paymentId) {
        return ResponseEntity.ok(ApiResponse.ok("Refund processed",
                paymentService.refund(paymentId)));
    }
}
