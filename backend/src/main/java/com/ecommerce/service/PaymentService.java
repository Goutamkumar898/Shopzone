package com.ecommerce.service;

import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderRepository   orderRepository;

    @Transactional
    public Payment processPayment(Long orderId, String paymentMethod) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        String txnId   = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        boolean success = true;

        Payment payment = Payment.builder()
                .order(order)
                .paymentId(txnId)
                .amount(order.getTotalAmount())
                .paymentMethod(paymentMethod)
                .status(success ? Payment.PaymentStatus.SUCCESS : Payment.PaymentStatus.FAILED)
                .gatewayResponse("{\"txnId\":\"" + txnId + "\",\"status\":\"SUCCESS\"}")
                .paidAt(success ? LocalDateTime.now() : null)
                .build();

        Payment saved = paymentRepository.save(payment);

        if (success) {
            order.setStatus(Order.OrderStatus.PROCESSING);
            orderRepository.save(order);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public Payment getByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));
    }

    @Transactional
    public Payment refund(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));
        if (payment.getStatus() != Payment.PaymentStatus.SUCCESS)
            throw new IllegalArgumentException("Only successful payments can be refunded");
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        return paymentRepository.save(payment);
    }
}
