package com.bookstore.backend.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePublisherRequest
{
    @NotBlank(message = "Naziv izdavača je obavezan")
    private String name;
}
