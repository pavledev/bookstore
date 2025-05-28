package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface IAuthService
{
    ResponseEntity<?> login(LoginRequest request);

    ResponseEntity<?> register(RegisterRequest request);

    ResponseEntity<?> refresh(String refreshToken);

    ResponseEntity<?> logout(String refreshToken);
}
