package com.example.backend.security;

import com.example.backend.auth.exceptions.InvalidCredentialsException;
import com.example.backend.auth.exceptions.TokenExpiredException;
import com.example.backend.user.model.User;
import com.example.backend.auth.services.TokenService;
import com.example.backend.user.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

/**
 *@Component - tells Spring about this class and register it as a bean (any Java object with the lifecycle managed by Spring IoC - Controllers, Repositories, Services etc...).
 *
 *OncePerRequestFilter - base class that ensures that the filter logic runs only one time per HTTP request
 */
@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(SecurityFilter.class);

    // @Autowired injects the other beans
    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    // @Override - tells the compiler to override the method with the same signature in the superclass
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        log.debug("Incoming {} → {}",
                request.getMethod(),
                request.getRequestURI());

        String token = this.recoverToken(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            try {

                // If the token is valid, it returns the login (user email)
                var login = tokenService.validateToken(token);

                if (login != null) {

                    // Load the User from the database
                    User user = userRepository.findByEmail(login).orElseThrow(() -> new InvalidCredentialsException());

                    // Builds a list of authorities (use user's actual role if present)
                    var authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole() != null ? "ROLE_" + user.getRole().name() :"ROLE_USER"));

                    // Creates an Authentication object (bundles up who you are, how you proved it, and what are you allowed to do) holding the user and their roles
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);

                    // Attach extra request context to the Authentication object (IP Address, Session ID, more details)
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // SecurityContextHolder - Holder for security inf
                    // Stores the authenticated user so Spring treats the request as "authenticated" and then anywhere in the application we can do SecurityContextHolder.getContext().getAuthentication() to get who is the user
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }

            } catch(com.auth0.jwt.exceptions.TokenExpiredException exception) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setHeader("WWW-Authenticate", "Bearer error=\"invalid_token\", error_description=\"token expired\"");
                return; // Stop the chain
            } catch (Exception exception) {
                log.debug("Authentication Failed, proceeding unauthenticated: {}", exception.getMessage());
            }
        }


        // Whether the authentication has been set or not, continue the filter chain so the next filters (and controllers) are called
        filterChain.doFilter(request, response);
    }

    /**
     * Helper that reads the Cookie from the ACCESS_TOKEN_COOKIE and returns the token stores inside it
     * Helper that reads the Authorization header and strips off the word "Bearer" and any extra white spaces
     *
     * @param request
     * @return raw token or null if cookie / header is missing
     */
    private String recoverToken(HttpServletRequest request) {

        String cookie = readCookie(request, ACCESS_TOKEN_COOKIE);
        if (cookie != null && !cookie.isBlank()) {
            return cookie;
        }

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // Removes the "Bearer "
        }

        return null;
    }

    /**
     *
     * @param request
     * @param name
     * @return token if the access_token cookie is not missing
     */

    private String readCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    // Will take care of turning special characters (ex: %2E) into normal form (ex: ".")
                    return URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                }
            }
        }

        return null;
    }
}
