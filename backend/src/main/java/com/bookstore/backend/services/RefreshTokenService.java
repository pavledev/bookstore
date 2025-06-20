package com.bookstore.backend.services;

import com.bookstore.backend.entities.RefreshToken;
import com.bookstore.backend.entities.User;
import com.bookstore.backend.repositories.IRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService
{
    private final IRefreshTokenRepository refreshTokenRepository;

    @Value("${security.jwt.refresh-expiration-time}")
    private long refreshTokenDurationMs;

    public void createRefreshToken(User user, String rawToken)
    {
        RefreshToken token = new RefreshToken();

        token.setToken(rawToken);
        token.setUser(user);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plus(Duration.ofMillis(refreshTokenDurationMs)));

        refreshTokenRepository.save(token);
    }

    public boolean isValid(String token)
    {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> !rt.isRevoked())
                .filter(rt -> rt.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    public void revokeToken(String token)
    {
        refreshTokenRepository.findByToken(token).ifPresent(rt ->
        {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    public void deleteTokensForUser(User user)
    {
        refreshTokenRepository.deleteByUser(user);
    }
}
