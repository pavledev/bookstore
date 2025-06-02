package com.bookstore.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateAuthorRequest
{
    @NotBlank(message = "Ime i prezime autora su obavezni")
    private String fullName;
}
