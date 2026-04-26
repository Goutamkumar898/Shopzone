package com.ecommerce.service;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository   orderRepository;
    @Autowired private CartRepository    cartRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository    userRepository;

    @Transactional
    public Order placeOrder(Long userId, CheckoutRequest req) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty())
            throw new IllegalArgumentException("Cart is empty");

        BigDecimal total = BigDecimal.ZERO;
        for (Cart ci : cartItems) {
            if (ci.getProduct().getStock() < ci.getQuantity())
                throw new IllegalArgumentException("Insufficient stock: " + ci.getProduct().getName());
            total = total.add(ci.getProduct().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(Order.OrderStatus.PENDING)
                .shippingAddress(req.getShippingAddress())
                .paymentMethod(req.getPaymentMethod())
                .build();

        List<OrderItem> items = new ArrayList<>();
        for (Cart ci : cartItems) {
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(ci.getProduct())
                    .quantity(ci.getQuantity())
                    .price(ci.getProduct().getPrice())
                    .build();
            items.add(oi);
        }
        order.setItems(items);
        Order saved = orderRepository.save(order);

        // Deduct stock
        for (Cart ci : cartItems) {
            Product p = ci.getProduct();
            p.setStock(p.getStock() - ci.getQuantity());
            productRepository.save(p);
        }

        cartRepository.deleteByUserId(userId);
        return saved;
    }

    @Transactional(readOnly = true)
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    @Transactional(readOnly = true)
    public List<Order> getByUser(Long userId) { return orderRepository.findByUserIdOrderByCreatedAtDesc(userId); }

    @Transactional(readOnly = true)
    public List<Order> getAll()               { return orderRepository.findAllByOrderByCreatedAtDesc(); }

    @Transactional
    public Order updateStatus(Long orderId, Order.OrderStatus status) {
        Order order = getById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = getById(orderId);
        if (!order.getUser().getId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        if (order.getStatus() == Order.OrderStatus.DELIVERED)
            throw new IllegalArgumentException("Cannot cancel a delivered order");
        order.setStatus(Order.OrderStatus.CANCELLED);
        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            productRepository.save(p);
        }
        orderRepository.save(order);
    }
}
