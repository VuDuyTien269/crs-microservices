package vn.edu.crs.authservice.config;

import vn.edu.crs.authservice.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Không dùng CSRF
                .csrf(csrf -> csrf.disable())

                // JWT → Stateless
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Phân quyền
                .authorizeHttpRequests(auth -> auth

                        // Login công khai
                        .requestMatchers("/auth/**")
                        .permitAll()

                        // API nội bộ
                        .requestMatchers("/internal/**")
                        .permitAll()

                        // Quản lý API Key → chỉ ADMIN
                        .requestMatchers("/api-keys/**")
                        .hasRole("ADMIN")

                        // Các API còn lại phải đăng nhập
                        .anyRequest()
                        .authenticated()
                )

                // JWT Filter
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}