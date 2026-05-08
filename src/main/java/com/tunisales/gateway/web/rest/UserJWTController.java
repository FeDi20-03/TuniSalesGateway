package com.tunisales.gateway.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tunisales.gateway.security.jwt.JWTFilter;
import com.tunisales.gateway.security.jwt.TokenProvider;
import com.tunisales.gateway.service.UserService;
import com.tunisales.gateway.web.rest.vm.LoginVM;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;

    private final ReactiveAuthenticationManager authenticationManager;

    private final UserService userService;

    public UserJWTController(TokenProvider tokenProvider, ReactiveAuthenticationManager authenticationManager, UserService userService) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/authenticate")
    public Mono<ResponseEntity<JWTTokenResponse>> authorize(@Valid @RequestBody Mono<LoginVM> loginVM) {
        return loginVM
            .flatMap(login ->
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword()))
            )
            .map(auth -> {
                String accessToken = tokenProvider.createAccessToken(auth);
                String refreshToken = tokenProvider.createRefreshToken(auth);
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + accessToken);
                return new ResponseEntity<>(
                    new JWTTokenResponse(accessToken, refreshToken, tokenProvider.getAccessTokenValidityInSeconds()),
                    httpHeaders,
                    HttpStatus.OK
                );
            });
    }

    /**
     * POST /refresh-token — exchanges a valid refresh token for a new access token.
     *
     * @param request contains the refresh token
     * @return a new access token (the refresh token is not rotated at this stage)
     */
    @PostMapping("/refresh-token")
    public Mono<ResponseEntity<JWTTokenResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        if (!tokenProvider.validateRefreshToken(request.getRefreshToken())) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token"));
        }
        String username = tokenProvider.getSubjectFromRefreshToken(request.getRefreshToken());
        return userService
            .getUserWithAuthoritiesByLogin(username)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found")))
            .map(user -> {
                // Reconstruct authentication from stored user details
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    user.getLogin(),
                    null,
                    user
                        .getAuthorities()
                        .stream()
                        .map(a -> (org.springframework.security.core.GrantedAuthority) () -> String.valueOf(a))
                        .toList()
                );
                String newAccessToken = tokenProvider.createAccessToken(auth);
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + newAccessToken);
                return new ResponseEntity<>(
                    new JWTTokenResponse(newAccessToken, request.getRefreshToken(), tokenProvider.getAccessTokenValidityInSeconds()),
                    httpHeaders,
                    HttpStatus.OK
                );
            });
    }

    // -------------------------------------------------------------------------
    // DTOs
    // -------------------------------------------------------------------------

    /** Response body returned by /authenticate and /refresh-token. */
    static class JWTTokenResponse {

        private final String idToken;
        private final String refreshToken;
        private final long expiresIn;

        JWTTokenResponse(String idToken, String refreshToken, long expiresIn) {
            this.idToken = idToken;
            this.refreshToken = refreshToken;
            this.expiresIn = expiresIn;
        }

        @JsonProperty("id_token")
        public String getIdToken() {
            return idToken;
        }

        @JsonProperty("refresh_token")
        public String getRefreshToken() {
            return refreshToken;
        }

        @JsonProperty("expires_in")
        public long getExpiresIn() {
            return expiresIn;
        }
    }

    /** Request body for the /refresh-token endpoint. */
    static class RefreshRequest {

        @NotBlank
        private String refreshToken;

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
}
