package com.bookstore.backend.services;

import com.bookstore.backend.entities.RefreshToken;
import com.bookstore.backend.entities.User;

public interface IRefreshTokenService
{
    void createRefreshToken(User user, String rawToken);

    boolean isValid(String token);

    void revokeToken(String token);

    void deleteTokensForUser(User user);
}
