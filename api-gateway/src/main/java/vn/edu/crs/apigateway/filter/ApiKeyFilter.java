package vn.edu.crs.apigateway.filter;

import vn.edu.crs.apigateway.cache.ApiKeyValidationCache;
import vn.edu.crs.apigateway.client.AuthServiceClient;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;

import org.springframework.core.Ordered;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;

import org.springframework.stereotype.Component;

import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class ApiKeyFilter implements GlobalFilter, Ordered {

    private final AuthServiceClient authServiceClient;

    private final ApiKeyValidationCache cache;

    private static final String PARTNER_PATH =
            "/api/public/courses";

    private static final String REQUIRED_SCOPE =
            "courses:read";

    public ApiKeyFilter(
            AuthServiceClient authServiceClient,
            ApiKeyValidationCache cache
    ) {
        this.authServiceClient = authServiceClient;
        this.cache = cache;
    }

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain
    ) {

        ServerHttpRequest request =
                exchange.getRequest();

        String path =
                request.getURI().getPath();

        // =========================
        // KHÔNG PHẢI ROUTE ĐỐI TÁC
        // =========================

        if (!path.startsWith(PARTNER_PATH)) {

            return chain.filter(exchange);
        }

        // =========================
        // LẤY API KEY
        // =========================

        String apiKey =
                request.getHeaders()
                        .getFirst("X-API-KEY");

        if (apiKey == null ||
                apiKey.isBlank()) {

            return reject(exchange);
        }

        // =========================
        // TẠO CACHE KEY
        // =========================

        String cacheKey =
                apiKey + ":" + REQUIRED_SCOPE;

        // =========================
        // KIỂM TRA CACHE
        // =========================

        Boolean cached =
                cache.get(cacheKey);

        if (cached != null) {

            return cached
                    ? chain.filter(exchange)
                    : reject(exchange);
        }

        // =========================
        // GỌI AUTH SERVICE
        // =========================

        return authServiceClient
                .isValidForScope(
                        apiKey,
                        REQUIRED_SCOPE
                )
                .flatMap(valid -> {

                    // Lưu kết quả vào cache
                    cache.put(
                            cacheKey,
                            valid
                    );

                    return valid
                            ? chain.filter(exchange)
                            : reject(exchange);
                });
    }

    // =========================
    // TỪ CHỐI REQUEST
    // =========================

    private Mono<Void> reject(
            ServerWebExchange exchange
    ) {

        exchange
                .getResponse()
                .setStatusCode(
                        HttpStatus.FORBIDDEN
                );

        return exchange
                .getResponse()
                .setComplete();
    }

    // =========================
    // FILTER ORDER
    // =========================

    @Override
    public int getOrder() {

        return -2;
    }
}