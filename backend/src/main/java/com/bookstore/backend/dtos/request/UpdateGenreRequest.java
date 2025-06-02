package com.bookstore.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateGenreRequest
{
    @NotBlank(message = "Naziv žanra je obavezan")
    private String name;

    @NotBlank(message = "Opis žanra je obavezan")
    private String description;
}
