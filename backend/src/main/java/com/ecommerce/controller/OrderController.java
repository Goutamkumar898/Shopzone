package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.model.Order;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderService   orderService;
    @Autowired private UserRepository userRepository;

    private Long userId(UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(
            @Valid @RequestBody CheckoutRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully",
                orderService.placeOrder(userId(ud), req)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Order>>> myOrders(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getByUser(userId(ud))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAll()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok("Status updated",
                orderService.updateStatus(id, status)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails ud) {
        orderService.cancelOrder(id, userId(ud));
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled", null));
    }
}
