package com.example.backend.auth.dto;

public record TokenRefreshResponse (String accessToken, String refreshToken) {
}