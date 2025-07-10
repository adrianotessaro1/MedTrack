package com.example.backend.auth.controllers;

import com.example.backend.auth.dto.AuthResponse;
import com.example.backend.auth.dto.LoginRequest;
import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.user.entity.User;
import com.example.backend.auth.exceptions.InvalidCredentialsException;
import com.example.backend.auth.exceptions.ResourceConflictException;
import com.example.backend.auth.services.TokenService;
import com.example.backend.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest body) {
        User user = this.repository.findByEmail(body.email()).orElseThrow(() -> new InvalidCredentialsException());
        if (passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(user.getName(), token));
        } else {
            throw new InvalidCredentialsException();
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequest body) {
        Optional<User> user = this.repository.findByEmail(body.email());
        if (user.isEmpty()) {
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());

            User savedUser = repository.save(newUser);

            String token = this.tokenService.generateToken(savedUser);
            return ResponseEntity.ok(new AuthResponse(savedUser.getName(), token));
        } else {
            throw new ResourceConflictException("Email already being used: " + body.email());
        }

    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRe>
}
