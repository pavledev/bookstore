package com.bookstore.backend.services;

import com.bookstore.backend.entities.Genre;
import com.bookstore.backend.mappers.GenreMapper;
import com.bookstore.backend.models.GenreModel;
import com.bookstore.backend.repositories.IGenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService implements IGenreService
{
    private final IGenreRepository genreRepository;
    private final GenreMapper genreMapper;

    @Override
    public List<GenreModel> getGenres()
    {
        List<Genre> genres = genreRepository.findAll();

        return genreMapper.toModelList(genres);
    }
}
