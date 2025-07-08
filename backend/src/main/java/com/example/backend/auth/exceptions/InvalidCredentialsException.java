package com.example.backend.auth.exceptions;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException() {
        super("Invalid Credentials (email or password)");
    }
}
