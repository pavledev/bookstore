package com.bookstore.backend.dtos.request;

import lombok.Data;

@Data
public class RefreshTokenRequest
{
    private String refreshToken;
}
