package com.example.backend.common.exception;

import com.example.backend.auth.exceptions.InvalidCredentialsException;
import com.example.backend.auth.exceptions.ResourceConflictException;
import com.example.backend.auth.exceptions.TokenExpiredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * @RestControllerAdvice tells Spring:
 * “Scan all controllers, and whenever one throws an exception
 *  matching one of my @ExceptionHandler methods, invoke it.”
 */
@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * DTO record (immutable) for error code and message
     * Example: {"code": "USER_NOT_FOUND", "message": "User not found: adriano@gmail.com"}
     */
    public record ErrorDTO (String code, String message) {}

    /**
     * If the user throws an UserNotFoundException, call this method instead of letting it go as a 500
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorDTO> handleInvalidCredentials(InvalidCredentialsException exception) {
        ErrorDTO body = new ErrorDTO("INVALID_CREDENTIALS", exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ErrorDTO> handleResourceConflictException(ResourceConflictException exception) {
        ErrorDTO body = new ErrorDTO("RESOURCE_CONFLICT", exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorDTO> handleTokenExpiredException(TokenExpiredException exception) {
        ErrorDTO body = new ErrorDTO("TOKEN_EXPIRED", "Your session has expired. Please log in again");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    /**
     * Catch-all for exceptions not handled above
     * Important in order to prevent stack traces from leaking to the user
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleAllUncaughtExceptions (Exception exception) {
        ErrorDTO body = new ErrorDTO("INTERNAL_ERROR", "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
