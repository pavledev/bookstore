package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreateAuthorRequest;
import com.bookstore.backend.dtos.request.UpdateAuthorRequest;
import com.bookstore.backend.models.AuthorModel;

import java.util.List;

public interface IAuthorService
{
    List<AuthorModel> getAuthors();

    List<AuthorModel> getAuthorsSortedByName();

    void createAuthor(CreateAuthorRequest createAuthorRequest);

    void updateAuthor(Integer authorId, UpdateAuthorRequest updateAuthorRequest);
}
