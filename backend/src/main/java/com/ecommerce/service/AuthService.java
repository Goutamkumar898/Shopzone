package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired private UserRepository        userRepository;
    @Autowired private PasswordEncoder       passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil               jwtUtil;
    @Autowired private UserDetailsService    userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.CUSTOMER)
                .build();

        userRepository.save(user);
        UserDetails ud    = userDetailsService.loadUserByUsername(user.getEmail());
        String      token = jwtUtil.generateToken(ud);
        return new AuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", req.getEmail()));
        UserDetails ud    = userDetailsService.loadUserByUsername(user.getEmail());
        String      token = jwtUtil.generateToken(ud);
        return new AuthResponse(token, user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
