package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RefreshTokenRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.TokenResponse;
import com.bookstore.backend.services.IAuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController
{
    private final IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request)
    {
        TokenResponse tokenResponse = authService.login(request);

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request)
    {
        authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request)
    {
        TokenResponse response = authService.refresh(request.getRefreshToken());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request)
    {
        authService.logout(request.getRefreshToken());

        return ResponseEntity.ok(Map.of("message", "Logged out."));
    }
}
