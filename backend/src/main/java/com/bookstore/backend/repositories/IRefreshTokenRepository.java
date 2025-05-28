package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.RefreshToken;
import com.bookstore.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRefreshTokenRepository extends JpaRepository<RefreshToken, Integer>
{
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
