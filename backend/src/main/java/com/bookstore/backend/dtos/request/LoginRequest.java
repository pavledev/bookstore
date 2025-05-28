package com.bookstore.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest
{
    @NotBlank(message = "Korisničko ime ili email adresa je obavezna")
    private String identifier;

    @NotBlank(message = "Lozinka je obevezna")
    private String password;
}
