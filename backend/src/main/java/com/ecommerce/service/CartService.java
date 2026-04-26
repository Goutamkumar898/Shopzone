package com.ecommerce.service;

import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CartService {

    @Autowired private CartRepository    cartRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository    userRepository;

    @Transactional(readOnly = true)
    public List<Cart> getCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Transactional
    public Cart addItem(Long userId, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        if (product.getStock() < quantity)
            throw new IllegalArgumentException("Insufficient stock for: " + product.getName());

        return cartRepository.findByUserIdAndProductId(userId, productId)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + quantity);
                    return cartRepository.save(existing);
                })
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Cart item = Cart.builder()
                            .user(user)
                            .product(product)
                            .quantity(quantity)
                            .build();
                    return cartRepository.save(item);
                });
    }

    @Transactional
    public Cart updateQuantity(Long userId, Long itemId, int quantity) {
        Cart item = cartRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));
        if (!item.getUser().getId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        if (quantity <= 0) { cartRepository.delete(item); return null; }
        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    @Transactional
    public void removeItem(Long userId, Long itemId) {
        Cart item = cartRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));
        if (!item.getUser().getId().equals(userId))
            throw new IllegalArgumentException("Access denied");
        cartRepository.delete(item);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
