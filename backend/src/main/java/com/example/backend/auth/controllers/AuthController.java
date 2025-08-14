package com.example.backend.auth.controllers;

import com.example.backend.auth.dto.*;
import com.example.backend.common.config.JWTProperties;
import com.example.backend.user.model.User;
import com.example.backend.auth.exceptions.InvalidCredentialsException;
import com.example.backend.auth.exceptions.ResourceConflictException;
import com.example.backend.auth.services.TokenService;
import com.example.backend.user.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Optional;

@RestController // @Controller + @RequestBody
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private final UserRepository repository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final TokenService tokenService;

    private JWTProperties jwtProperties;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest body) {
        User user = this.repository.findByEmail(body.email()).orElseThrow(() -> new InvalidCredentialsException());
        if (passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);

            ResponseCookie cookie = ResponseCookie.from("access_token", token)
                    .httpOnly(true)
                    .secure(false) // True in Production; False for local HTTP
                    .path("/")
                    .maxAge(jwtProperties.getAccessTokenTTl())
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthResponse(user.getName(), token));
        } else {
            throw new InvalidCredentialsException();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest body) {
        Optional<User> user = this.repository.findByEmail(body.email());
        if (user.isEmpty()) {
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());

            User savedUser = repository.save(newUser);

            String token = this.tokenService.generateToken(savedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(savedUser.getName(), token));
        } else {
            throw new ResourceConflictException("Email already being used: " + body.email());
        }

    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie clearedCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true).secure(false).path("/").maxAge(0).build();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, clearedCookie.toString()).build();
    }

    /*
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> authRefreshToken(@Valid @RequestBody TokenRefreshRequest body) {

    }
    */
}
