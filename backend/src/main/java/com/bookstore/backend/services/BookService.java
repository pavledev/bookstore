package com.bookstore.backend.services;

import com.bookstore.backend.entities.Book;
import com.bookstore.backend.mappers.BookMapper;
import com.bookstore.backend.dtos.request.BookFilterRequest;
import com.bookstore.backend.models.BookModel;
import com.bookstore.backend.repositories.IBookRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService implements IBookService
{
    private final IBookRepository bookRepository;
    private final BookMapper bookMapper;

    @Override
    public Page<BookModel> getBooks(PageRequest pageRequest)
    {
        Page<Book> bookPage = bookRepository.findAll(pageRequest);

        return bookMapper.toModelPage(bookPage);
    }

    @Override
    public Page<BookModel> filterBooks(BookFilterRequest filter, PageRequest pageRequest)
    {
        Specification<Book> spec = Specification.where(null);

        if (filter.getCategoryId() != null)
        {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("categoryId"), filter.getCategoryId()));
        }

        if (filter.getQuery() != null && !filter.getQuery().isBlank())
        {
            String keyword = "%" + filter.getQuery().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), keyword),
                    cb.like(cb.lower(root.get("isbn")), keyword),
                    cb.like(cb.lower(root.get("barCode")), keyword)
            ));
        }

        if (filter.getGenreIds() != null && !filter.getGenreIds().isEmpty())
        {
            spec = spec.and((root, query, cb) ->
                    root.join("genres").get("genreId").in(filter.getGenreIds()));
        }

        if (filter.getPublisherIds() != null && !filter.getPublisherIds().isEmpty())
        {
            spec = spec.and((root, query, cb) ->
                    root.get("publisher").get("publisherId").in(filter.getPublisherIds()));
        }

        if (filter.getAuthorIds() != null && !filter.getAuthorIds().isEmpty())
        {
            spec = spec.and((root, query, cb) ->
                    root.join("authors").get("authorId").in(filter.getAuthorIds()));
        }

        Page<Book> page = bookRepository.findAll(spec, pageRequest);

        return bookMapper.toModelPage(page);
    }

    @Override
    public BookModel getBookById(Integer id)
    {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book with ID " + id + " not found"));

        return bookMapper.toModel(book);
    }

    @Override
    public List<BookModel> getBooksByIds(List<Integer> ids)
    {
        List<Book> books = bookRepository.findAllById(ids);

        return bookMapper.toModelList(books);
    }
}
