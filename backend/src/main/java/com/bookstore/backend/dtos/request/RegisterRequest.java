package com.bookstore.backend.dtos.request;

import com.bookstore.backend.validators.PasswordMatches;
import com.bookstore.backend.validators.UniqueEmail;
import com.bookstore.backend.validators.UniqueUsername;
import jakarta.validation.constraints.*;
import lombok.Data;

@UniqueEmail
@UniqueUsername
@PasswordMatches
@Data
public class RegisterRequest
{
    @NotBlank(message = "Ime je obavezno")
    @Size(min = 2, message = "Ime mora imati najmanje 2 slova")
    private String firstName;

    @NotBlank(message = "Prezime je obavezno")
    @Size(min = 2, message = "Prezime mora imati najmanje 2 slova")
    private String lastName;

    @NotBlank(message = "Email je obavezan")
    @Email(message = "Format email adrese nije validan")
    private String email;

    @NotBlank(message = "Korisničko ime je obavezno")
    @Size(min = 6, message = "Korisničko ime mora imati najmanje 6 karaktera")
    private String username;

    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 8, message = "Lozinka mora imati najmanje 8 karaktera")
    private String password;

    @NotBlank(message = "Potvrda lozinka je obavezna")
    private String confirmPassword;

    @NotBlank(message = "Broj telefona je obavezan")
    @Pattern(
            regexp = "\\d{3}-\\d{2}-\\d{2}-\\d{3}",
            message = "Broj telefona mora da bude u formatu 000-00-00-000"
    )
    private String phoneNumber;

    @NotBlank(message = "Mesto je obavezno")
    private String city;

    @NotBlank(message = "Ulica je obavezna")
    private String streetName;

    @NotBlank(message = "Broj je obavezan")
    private String streetNumber;
}
