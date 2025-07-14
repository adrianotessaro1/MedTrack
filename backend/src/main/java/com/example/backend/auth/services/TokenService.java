package com.example.backend.auth.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.example.backend.common.config.JWTProperties;
import com.example.backend.user.entity.User;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@NoArgsConstructor
public class TokenService {

    // Read the property from the application.yml and inject in the secret field
    // This secret will be used for signing and verifying tokens
    private JWTProperties jwtProperties;

    public String generateToken(User user) {
        try {
            // HMAC-SHA256 as the signing algorithm so anyone without the secret will fail verification
            Algorithm algorithm = Algorithm.HMAC256(jwtProperties.getSecretKey());

            // JSON Web Token is a single string of three Base64Url encoded parts HEADER . PAYLOAD . SIGNATURE
            // .withIssuer - require that only tokens with that exact issuer will be accepted ("Was this issued by the service I trust?")
            // .withSubject - what will be retrieved in each request to look up the user (email in this case)
            // .withExpiresAt - After a certain time, the verification will fail with that token
            // .sign(algorithm) - Creates the header {alg: "HS256", typ: "JWT" } and payload, encodes both and computes the signature using the secret and then encodes it
            String token = JWT.create().withIssuer("login-auth-api").withSubject(user.getEmail()).withExpiresAt(this.generateExpirationDate()).sign(algorithm);

            return token;
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error while authenticating");
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtProperties.getSecretKey());

            /**
             * JWT.require(algorithm).withIssuer("login-auth-api") - make sure the signature must match
             * .build().verify(token) - verifies the token and if any checks fail, an exception is thrown
             * .getSubject() - returns the subclaim (user's email) so the security filter can look it up in the database
             */
            return JWT.require(algorithm).withIssuer("login-auth-api").build().verify(token).getSubject();
        }
        catch(TokenExpiredException exception) {
            throw exception;
        }
        catch (JWTVerificationException exception){
            return null;
        }
    }

    private Instant generateExpirationDate(){
        Instant now = Instant.now();
        return now.plus(jwtProperties.getAccessTokenTTl());
    }
}
