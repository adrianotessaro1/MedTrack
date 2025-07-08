package com.example.backend.auth.exceptions;

// Thrown when an operation conflicts with an existing resource (ex: same email)
public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }
}
