package vn.edu.crs.authservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // =========================
        // LẤY HEADER AUTHORIZATION
        // =========================

        String authHeader =
                request.getHeader("Authorization");

        // Không có Authorization
        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // =========================
        // LẤY JWT
        // =========================

        String token =
                authHeader.substring(7);

        // =========================
        // KIỂM TRA JWT
        // =========================

        if (!jwtUtil.validateToken(token)) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            // =========================
            // LẤY USERNAME + ROLE
            // =========================

            String username =
                    jwtUtil.extractUsername(token);

            String role =
                    jwtUtil.extractRole(token);

            // =========================
            // TẠO QUYỀN
            // =========================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + role
                    );

            // =========================
            // TẠO AUTHENTICATION
            // =========================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(authority)
                    );

            // =========================
            // ĐƯA VÀO SECURITY CONTEXT
            // =========================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (Exception e) {

            SecurityContextHolder.clearContext();
        }

        // =========================
        // CHO REQUEST ĐI TIẾP
        // =========================

        filterChain.doFilter(request, response);
    }
}