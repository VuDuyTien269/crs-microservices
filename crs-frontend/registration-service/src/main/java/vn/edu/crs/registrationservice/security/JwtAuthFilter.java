package vn.edu.crs.registrationservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String SECRET =
            "CRS_AUTH_SERVICE_SECRET_KEY_2026_VU_DUY_TIEN_AUTHENTICATION";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=== JWT FILTER ===");
        System.out.println("Request: " + request.getMethod()
                + " " + request.getRequestURI());
        System.out.println("Authorization: "
                + (authHeader != null ? "CO_CREDENTIAL" : "NULL"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("NO JWT");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String username = claims.getSubject();

            Object roleObject = claims.get("role");

            String role = roleObject != null
                    ? roleObject.toString()
                    : "USER";

            System.out.println("JWT VALID");
            System.out.println("Username: " + username);
            System.out.println("Role: " + role);

            if (username != null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println("AUTHENTICATION SET");
                System.out.println(
                        "Authorities: "
                                + authentication.getAuthorities()
                );
            }

        } catch (Exception e) {

            System.out.println("JWT INVALID");
            System.out.println("Error: " + e.getMessage());

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}