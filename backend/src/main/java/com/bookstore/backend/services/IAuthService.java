package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.LoginResponse;
import org.springframework.http.ResponseEntity;

public interface IAuthService
{
    LoginResponse login(LoginRequest request);

    ResponseEntity<?> register(RegisterRequest request);
}
