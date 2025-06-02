package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreateAuthorRequest;
import com.bookstore.backend.dtos.request.UpdateAuthorRequest;
import com.bookstore.backend.entities.Author;
import com.bookstore.backend.mappers.AuthorMapper;
import com.bookstore.backend.models.AuthorModel;
import com.bookstore.backend.repositories.IAuthorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService implements IAuthorService
{
    private final IAuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    @Override
    public List<AuthorModel> getAuthors()
    {
        List<Author> authors = authorRepository.findAll();

        return authorMapper.toModelList(authors);
    }

    @Override
    public List<AuthorModel> getAuthorsSortedByName()
    {
        List<Author> authors = authorRepository.findAllSortedByName();

        return authorMapper.toModelList(authors);
    }

    @Override
    public void createAuthor(CreateAuthorRequest createAuthorRequest)
    {
        Author author = new Author();

        author.setFullName(createAuthorRequest.getFullName());

        authorRepository.save(author);
    }

    @Override
    public void updateAuthor(Integer authorId, UpdateAuthorRequest updateAuthorRequest)
    {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new EntityNotFoundException("Author not found."));

        author.setFullName(updateAuthorRequest.getFullName());

        authorRepository.save(author);
    }
}
