package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.CreateGenreRequest;
import com.bookstore.backend.dtos.request.UpdateGenreRequest;
import com.bookstore.backend.models.GenreModel;
import com.bookstore.backend.services.IGenreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createGenre(@Valid @RequestBody CreateGenreRequest createGenreRequest)
    {
        genreService.createGenre(createGenreRequest);

        return ResponseEntity.ok(Map.of("message", "Žanr je uspešno kreiran."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateGenre(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateGenreRequest updateGenreRequest
    )
    {
        genreService.updateGenre(id, updateGenreRequest);

        return ResponseEntity.ok(Map.of("message", "Žanr je uspešno ažuriran."));
    }
}
