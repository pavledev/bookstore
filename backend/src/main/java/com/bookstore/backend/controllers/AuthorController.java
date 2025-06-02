package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.CreateAuthorRequest;
import com.bookstore.backend.dtos.request.UpdateAuthorRequest;
import com.bookstore.backend.models.AuthorModel;
import com.bookstore.backend.services.IAuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("authors")
@RequiredArgsConstructor
@Tag(name = "authors", description = "Upravljanje autorima")
public class AuthorController
{
    private final IAuthorService authorService;

    @GetMapping
    @Operation(
            summary = "Dobavi autore",
            description = "Vraća listu svih autora sortiranih po imenu."
    )
    public List<AuthorModel> getAuthors()
    {
        return authorService.getAuthorsSortedByName();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Kreiraj autora",
            description = "Dodaje novog autora u sistem. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> createAuthor(@Valid @RequestBody CreateAuthorRequest createAuthorRequest)
    {
        authorService.createAuthor(createAuthorRequest);

        return ResponseEntity.ok(Map.of("message", "Autor je uspešno kreiran."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Ažuriraj autora",
            description = "Ažurira podatke postojećeg autora na osnovu ID-a. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> updateAuthor(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateAuthorRequest updateAuthorRequest
    )
    {
        authorService.updateAuthor(id, updateAuthorRequest);

        return ResponseEntity.ok(Map.of("message", "Autor je uspešno ažuriran."));
    }
}
