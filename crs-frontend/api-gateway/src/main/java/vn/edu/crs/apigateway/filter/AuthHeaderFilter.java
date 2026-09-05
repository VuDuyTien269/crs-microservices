package vn.edu.crs.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthHeaderFilter implements GlobalFilter, Ordered {

    // Các API không cần Authorization
    private static final List<String> OPEN_PATHS = List.of(
            "/api/auth/login",
            "/api/public/courses"
    );

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        String path = request.getURI().getPath();

        // Kiểm tra API có được phép truy cập không cần token
        boolean isOpen = OPEN_PATHS.stream()
                .anyMatch(path::startsWith);

        // GET /api/courses/** không cần token
        boolean isPublicCourseRead =
                path.startsWith("/api/courses")
                        && request.getMethod() != null
                        && request.getMethod().name().equals("GET");

        // Nếu là API public -> cho đi tiếp
        if (isOpen || isPublicCourseRead) {
            return chain.filter(exchange);
        }

        // Lấy Authorization header
        String authorization =
                request.getHeaders().getFirst("Authorization");

        // Không có Authorization -> 401
        if (authorization == null || authorization.isBlank()) {

            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);

            return exchange.getResponse().setComplete();
        }

        // Có Authorization -> cho đi tiếp
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}