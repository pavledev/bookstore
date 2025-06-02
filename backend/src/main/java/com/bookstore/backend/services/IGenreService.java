package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreateGenreRequest;
import com.bookstore.backend.dtos.request.UpdateGenreRequest;
import com.bookstore.backend.models.GenreModel;

import java.util.List;

public interface IGenreService
{
    List<GenreModel> getGenres();

    void createGenre(CreateGenreRequest createGenreRequest);

    void updateGenre(Integer genreId, UpdateGenreRequest updateGenreRequest);
}
