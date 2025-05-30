package com.bookstore.backend.controllers;

import com.bookstore.backend.models.AuthorModel;
import com.bookstore.backend.services.IAuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
