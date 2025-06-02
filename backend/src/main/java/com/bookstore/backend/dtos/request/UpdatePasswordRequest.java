package com.bookstore.backend.dtos.request;

import com.bookstore.backend.validators.PasswordMatches;
import jakarta.validation.constraints.*;
import lombok.Data;

@PasswordMatches
@Data
public class UpdatePasswordRequest
{
    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 8, message = "Lozinka mora imati najmanje 8 karaktera")
    private String password;

    @NotBlank(message = "Potvrda lozinka je obavezna")
    private String confirmPassword;
}
