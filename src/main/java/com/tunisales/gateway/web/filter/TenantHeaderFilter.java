package com.tunisales.gateway.web.filter;

import com.tunisales.gateway.security.jwt.TokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

/**
 * Reactive WebFilter (Spring Cloud Gateway) that reads the {@code tenantId}
 * claim from the JWT and propagates it as the {@code X-Tenant-Id} request
 * header to all downstream microservices.
 *
 * <p>The filter is registered at {@code REACTOR_CONTEXT} order in
 * {@link com.tunisales.gateway.config.SecurityConfiguration} so that it
 * executes after the JWT has been validated by {@link com.tunisales.gateway.security.jwt.JWTFilter}
 * but before the route is forwarded.</p>
 */
@Component
public class TenantHeaderFilter implements WebFilter {

    public static final String TENANT_HEADER = "X-Tenant-Id";

    private final Logger log = LoggerFactory.getLogger(TenantHeaderFilter.class);

    private final TokenProvider tokenProvider;

    public TenantHeaderFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String jwt = resolveToken(exchange.getRequest());
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String tenantId = tokenProvider.getTenantId(jwt);
            if (StringUtils.hasText(tenantId)) {
                log.debug("Propagating X-Tenant-Id={} to downstream service", tenantId);
                ServerHttpRequest mutated = exchange.getRequest().mutate().header(TENANT_HEADER, tenantId).build();
                return chain.filter(exchange.mutate().request(mutated).build());
            }
        }
        return chain.filter(exchange);
    }

    private String resolveToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
