package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.TokenResponse;
import com.bookstore.backend.entities.User;
import com.bookstore.backend.exceptions.InvalidTokenException;
import com.bookstore.backend.repositories.IUserRepository;
import com.bookstore.backend.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService
{
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private final IUserRepository userRepository;
    private final IUserService userService;
    private final IRefreshTokenService refreshTokenService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    public TokenResponse login(@Valid LoginRequest loginRequest)
    {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getIdentifier(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        refreshTokenService.createRefreshToken(user, refreshToken);

        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public void register(@Valid RegisterRequest registerRequest)
    {
        userService.createUser(registerRequest);
    }

    @Override
    public TokenResponse refresh(String refreshToken)
    {
        if (refreshToken == null || !refreshTokenService.isValid(refreshToken))
        {
            throw new InvalidTokenException("Refresh token is invalid or missing");
        }

        String username = jwtUtil.getUsernameFromToken(refreshToken);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        User user = userRepository.findByUsername(username).orElseThrow();
        refreshTokenService.revokeToken(refreshToken);

        String newAccessToken = jwtUtil.generateToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
        refreshTokenService.createRefreshToken(user, newRefreshToken);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    @Override
    public void logout(String refreshToken)
    {
        if (refreshToken != null)
        {
            refreshTokenService.revokeToken(refreshToken);
        }
    }
}
