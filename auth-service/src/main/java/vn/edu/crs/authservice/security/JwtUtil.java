package vn.edu.crs.authservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // =========================
    // TẠO SECRET KEY
    // =========================
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // =========================
    // TẠO JWT
    // =========================
    public String generateToken(
            Long userId,
            String username,
            String role
    ) {

        SecretKey key = getSigningKey();

        Date now = new Date();

        Date expiry =
                new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(
                        key,
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    // =========================
    // LẤY CLAIMS TỪ TOKEN
    // =========================
    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // =========================
    // LẤY USERNAME
    // =========================
    public String extractUsername(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    // =========================
    // LẤY ROLE
    // =========================
    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    // =========================
    // KIỂM TRA TOKEN
    // =========================
    public boolean validateToken(String token) {

        try {

            Claims claims = extractAllClaims(token);

            Date expiration = claims.getExpiration();

            return expiration != null
                    && expiration.after(new Date());

        } catch (Exception e) {

            return false;
        }
    }
}