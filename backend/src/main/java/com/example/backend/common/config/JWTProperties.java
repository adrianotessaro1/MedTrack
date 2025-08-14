package com.example.backend.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@Setter @Getter
@ConfigurationProperties(prefix="jwt")
public class JWTProperties {
    private Duration accessTokenTTl;
    private Duration refreshTokenTTL;
    private String secretKey;
    private String issuer;
}
