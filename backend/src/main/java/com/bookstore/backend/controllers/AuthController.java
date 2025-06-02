package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.LoginRequest;
import com.bookstore.backend.dtos.request.RefreshTokenRequest;
import com.bookstore.backend.dtos.request.RegisterRequest;
import com.bookstore.backend.dtos.response.TokenResponse;
import com.bookstore.backend.services.IAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "auth", description = "Autentifikacija i upravljanje tokenima")
public class AuthController
{
    private final IAuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "Prijava korisnika",
            description = "Autentifikuje korisnika na osnovu korisničkog imena/email adrese i lozinke i vraća access i refresh token."
    )
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request)
    {
        TokenResponse tokenResponse = authService.login(request);

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/register")
    @Operation(
            summary = "Registracija korisnika",
            description = "Registruje novog korisnika sa prosleđenim korisničkim podacima."
    )
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request)
    {
        authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Osvežavanje access tokena",
            description = "Generiše novi access token koristeći važeći refresh token."
    )
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request)
    {
        TokenResponse response = authService.refresh(request.getRefreshToken());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Odjava korisnika",
            description = "Briše refresh token iz baze i poništava korisničku sesiju."
    )
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request)
    {
        authService.logout(request.getRefreshToken());

        return ResponseEntity.ok(Map.of("message", "Logged out."));
    }
}
