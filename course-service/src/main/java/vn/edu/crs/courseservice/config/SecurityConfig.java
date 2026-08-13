package vn.edu.crs.courseservice.config;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import vn.edu.crs.courseservice.security.JwtAuthFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // API nội bộ
                        .requestMatchers("/internal/**")
                        .permitAll()

                        // GET courses cho phép xem
                        .requestMatchers(
                                HttpMethod.GET,
                                "/courses/**"
                        )
                        .permitAll()

                        // ADMIN mới được tạo
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // ADMIN mới được sửa
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // ADMIN mới được xóa
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses/**"
                        )
                        .hasRole("ADMIN")

                        // Các API còn lại phải đăng nhập
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}