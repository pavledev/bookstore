package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.LoginResponse;
import com.bookstore.backend.entities.Role;
import com.bookstore.backend.entities.User;
import com.bookstore.backend.repositories.IRoleRepository;
import com.bookstore.backend.repositories.IUserRepository;
import com.bookstore.backend.security.JwtUtil;
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

    @Override
    public LoginResponse login(@Valid LoginRequest request)
    {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        String token = jwtUtil.generateToken((UserDetails) authentication.getPrincipal());

        return new LoginResponse(token, "Bearer");
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
}
