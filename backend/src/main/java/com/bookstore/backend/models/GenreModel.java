package com.bookstore.backend.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GenreModel
{
    private Integer genreId;
    private String name;
    private String description;
}
