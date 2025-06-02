package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreateGenreRequest;
import com.bookstore.backend.dtos.request.UpdateGenreRequest;
import com.bookstore.backend.entities.Genre;
import com.bookstore.backend.mappers.GenreMapper;
import com.bookstore.backend.models.GenreModel;
import com.bookstore.backend.repositories.IGenreRepository;
import jakarta.persistence.EntityNotFoundException;
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

    @Override
    public void createGenre(CreateGenreRequest createGenreRequest)
    {
        Genre genre = new Genre();

        genre.setName(createGenreRequest.getName());
        genre.setDescription(createGenreRequest.getDescription());

        genreRepository.save(genre);
    }

    @Override
    public void updateGenre(Integer genreId, UpdateGenreRequest updateGenreRequest)
    {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new EntityNotFoundException("Genre not found."));

        genre.setName(updateGenreRequest.getName());
        genre.setDescription(updateGenreRequest.getDescription());

        genreRepository.save(genre);
    }
}
