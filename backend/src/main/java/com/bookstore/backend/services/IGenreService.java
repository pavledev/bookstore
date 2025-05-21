package com.bookstore.backend.services;

import com.bookstore.backend.models.GenreModel;

import java.util.List;

public interface IGenreService
{
    List<GenreModel> getGenres();
}
