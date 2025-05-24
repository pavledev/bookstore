package com.bookstore.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse
{
    private String accessToken;
    private String tokenType;
}
