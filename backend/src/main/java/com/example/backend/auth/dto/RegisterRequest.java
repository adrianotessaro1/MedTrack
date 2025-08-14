package com.example.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max=200) String name,
        @NotBlank @Email @Size(max=200) String email,
        @NotBlank @Size(min=8, max=60) String password) {
}
