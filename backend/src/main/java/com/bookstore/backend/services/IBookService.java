package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.AdminCreateUserRequest;
import com.bookstore.backend.dtos.request.BookFilterRequest;
import com.bookstore.backend.dtos.request.CreateBookRequest;
import com.bookstore.backend.dtos.request.UpdateBookRequest;
import com.bookstore.backend.models.BookModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface IBookService
{
    Page<BookModel> getBooks(PageRequest pageRequest);

    Page<BookModel> filterBooks(BookFilterRequest filter, PageRequest pageRequest);

    BookModel getBookById(Integer id);

    List<BookModel> getBooksByIds(List<Integer> ids);

    void createBook(CreateBookRequest createBookRequest);

    void updateBook(Integer bookId, UpdateBookRequest updateBookRequest);

    void deleteBook(Integer bookId);
}
