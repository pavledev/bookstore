package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.TokenResponse;
import com.bookstore.backend.entities.Role;
import com.bookstore.backend.entities.User;
import com.bookstore.backend.repositories.IRoleRepository;
import com.bookstore.backend.repositories.IUserRepository;
import com.bookstore.backend.security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService
{
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final IRefreshTokenService refreshTokenService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    public ResponseEntity<?> login(@Valid LoginRequest request)
    {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        refreshTokenService.createRefreshToken(user, refreshToken);

        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken));
    }

    @Override
    public ResponseEntity<?> register(@Valid RegisterRequest request)
    {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCity(request.getCity());
        user.setStreetName(request.getStreetName());
        user.setStreetNumber(request.getStreetNumber());
        user.setRoles(Set.of(userRole));

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<?> refresh(String refreshToken)
    {
        if (refreshToken == null || !refreshTokenService.isValid(refreshToken))
        {
            return ResponseEntity.status(401).build();
        }

        String username = jwtUtil.getUsernameFromToken(refreshToken);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        User user = userRepository.findByUsername(username).orElseThrow();
        refreshTokenService.revokeToken(refreshToken);

        String newAccessToken = jwtUtil.generateToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
        refreshTokenService.createRefreshToken(user, newRefreshToken);

        return ResponseEntity.ok(new TokenResponse(newAccessToken, newRefreshToken));
    }

    @Override
    public ResponseEntity<?> logout(String refreshToken)
    {
        if (refreshToken != null)
        {
            refreshTokenService.revokeToken(refreshToken);
        }

        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
