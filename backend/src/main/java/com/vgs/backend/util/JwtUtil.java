package com.vgs.backend.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key key;
    private final long expirationMillis = 86_400_000L; // 1 day

    public JwtUtil(@Value("${jwt.secret}") String base64Secret) {
        byte[] secretBytes = Decoders.BASE64.decode(base64Secret);
        this.key = Keys.hmacShaKeyFor(secretBytes);
    }

    public String generateToken(String email, String university) {
        return Jwts.builder()
                   .setSubject(email)
                   .claim("university", university)
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                   .signWith(key)
                   .compact();
    }

    public String validateTokenAndGetEmail(String token) {
        try {
            return Jwts.parserBuilder()
                       .setSigningKey(key)
                       .build()
                       .parseClaimsJws(token)
                       .getBody()
                       .getSubject();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }

    public Claims getAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                       .setSigningKey(key)
                       .build()
                       .parseClaimsJws(token)
                       .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }
}
