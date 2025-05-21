package com.bookstore.backend.services;

import com.bookstore.backend.models.AuthorModel;

import java.util.List;

public interface IAuthorService
{
    List<AuthorModel> getAuthors();
    List<AuthorModel> getAuthorsSortedByName();
}
