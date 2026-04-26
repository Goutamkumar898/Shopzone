package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.model.Cart;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired private CartService    cartService;
    @Autowired private UserRepository userRepository;

    private Long userId(UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cart>>> getCart(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(userId(ud))));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Cart>> add(
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal UserDetails ud) {
        Long productId = Long.valueOf(body.get("productId"));
        int  qty       = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(ApiResponse.ok("Added to cart",
                cartService.addItem(userId(ud), productId, qty)));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> updateQty(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.ok("Updated",
                cartService.updateQuantity(userId(ud), itemId, body.get("quantity"))));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Void>> remove(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails ud) {
        cartService.removeItem(userId(ud), itemId);
        return ResponseEntity.ok(ApiResponse.ok("Removed", null));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clear(
            @AuthenticationPrincipal UserDetails ud) {
        cartService.clearCart(userId(ud));
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
