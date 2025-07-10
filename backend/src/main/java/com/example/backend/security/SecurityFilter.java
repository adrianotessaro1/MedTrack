package com.example.backend.security;

import com.example.backend.user.entity.User;
import com.example.backend.auth.services.TokenService;
import com.example.backend.user.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

// @Component - tells Spring about this class and register it as a bean (any Java object with the lifecycle managed by Spring IoC - Controllers, Repositories, Services etc...)
// OncePerRequestFilter - base class that ensures that the filter logic runs only one time per HTTP request
@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(SecurityFilter.class);

    // @Autowired injects the other beans
    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    // @Override - tells the compiler to override the method with the same signature in the superclass
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("Incoming {} {} → Authorization header={}",
                request.getMethod(),
                request.getRequestURI(),
                request.getHeader(HttpHeaders.AUTHORIZATION));
        var token = this.recoverToken(request);
        // If the token is valid, it returns the login(userEmail)
        var login = tokenService.validateToken(token);

        if (login != null) {
            // Load the User from the database
            User user = userRepository.findByEmail(login).orElseThrow(() -> new RuntimeException("User not found"));

            // Builds a list of authorities (every user gets the role: "ROLE_USER")
            var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));

            // Creates an Authentication object (bundles up who you are, how you proved it, and what are you allowed to do) holding the user and their roles
            var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);

            // SecurityContextHolder - Holder for security inf
            // Stores the authenticated user so Spring treats the request as "authenticated" and then anywhere in the application we can do SecurityContextHolder.getContext().getAuthentication() to get who is the user
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        // Whether the authentication has been set or not, continue the filter chain so the next filters (and controllers) are called
        filterChain.doFilter(request, response);
    }

    /**
     * Helper that reads the Authorization header and strips off the word "Bearer" and any extra white spaces
     *
     * @param request
     * @return raw token or null if header is missing
     */
    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7); // Removes the "Bearer "
    }





}
