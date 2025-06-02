package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.CreateAuthorRequest;
import com.bookstore.backend.dtos.request.UpdateAuthorRequest;
import com.bookstore.backend.models.AuthorModel;
import com.bookstore.backend.services.IAuthorService;
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
public class AuthorController
{
    private final IAuthorService authorService;

    @GetMapping
    public List<AuthorModel> getAuthors()
    {
        return authorService.getAuthorsSortedByName();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAuthor(@Valid @RequestBody CreateAuthorRequest createAuthorRequest)
    {
        authorService.createAuthor(createAuthorRequest);

        return ResponseEntity.ok(Map.of("message", "Autor je uspešno kreiran."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAuthor(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateAuthorRequest updateAuthorRequest
    )
    {
        authorService.updateAuthor(id, updateAuthorRequest);

        return ResponseEntity.ok(Map.of("message", "Autor je uspešno ažuriran."));
    }
}
