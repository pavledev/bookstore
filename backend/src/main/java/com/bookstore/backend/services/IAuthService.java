package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.TokenResponse;
import org.springframework.http.ResponseEntity;

public interface IAuthService
{
    TokenResponse login(LoginRequest request);

    void register(RegisterRequest request);

    TokenResponse refresh(String refreshToken);

    void logout(String refreshToken);
}
