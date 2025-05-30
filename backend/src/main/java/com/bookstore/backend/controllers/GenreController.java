package com.bookstore.backend.controllers;

import com.bookstore.backend.models.GenreModel;
import com.bookstore.backend.services.IGenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("genres")
@RequiredArgsConstructor
public class GenreController
{
    private final IGenreService genreService;

    @GetMapping
    public List<GenreModel> getBooks()
    {
        return genreService.getGenres();
    }
}
