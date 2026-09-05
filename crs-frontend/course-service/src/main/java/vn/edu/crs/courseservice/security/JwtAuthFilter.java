package vn.edu.crs.courseservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Không có Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            // =========================
            // 1. Lấy token
            // =========================
            String token = authHeader.substring(7);

            // =========================
            // 2. Tạo key
            // =========================
            SecretKey key = Keys.hmacShaKeyFor(
                    jwtSecret.getBytes(StandardCharsets.UTF_8)
            );

            // =========================
            // 3. Giải mã và kiểm tra JWT
            // =========================
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // =========================
            // 4. Lấy username
            // =========================
            String username = claims.getSubject();

            // =========================
            // 5. Lấy role
            // =========================
            String role = claims.get("role", String.class);

            System.out.println("===== JWT DEBUG =====");
            System.out.println("Username: " + username);
            System.out.println("Role: " + role);
            System.out.println("=====================");

            // =========================
            // 6. Tạo quyền
            // =========================
            List<SimpleGrantedAuthority> authorities;

            if (role != null && !role.isBlank()) {

                // Nếu JWT đã có ROLE_ADMIN
                if (role.startsWith("ROLE_")) {

                    authorities = List.of(
                            new SimpleGrantedAuthority(role)
                    );

                } else {

                    // Nếu JWT chỉ có ADMIN
                    authorities = List.of(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            )
                    );

                }

            } else {

                authorities = List.of();
            }

            // =========================
            // 7. Tạo Authentication
            // =========================
            if (username != null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception e) {

            System.out.println("JWT INVALID: " + e.getMessage());

            SecurityContextHolder.clearContext();
        }

        // =========================
        // 8. Cho request đi tiếp
        // =========================
        filterChain.doFilter(request, response);
    }
}