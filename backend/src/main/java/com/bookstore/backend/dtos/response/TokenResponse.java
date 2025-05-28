package com.bookstore.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenResponse
{
    private String accessToken;
    private String refreshToken;
}
