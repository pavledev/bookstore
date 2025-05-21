package com.bookstore.backend.services;

import com.bookstore.backend.models.BookFilterRequest;
import com.bookstore.backend.models.BookModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface IBookService
{
    Page<BookModel> getBooks(PageRequest pageRequest);

    Page<BookModel> filterBooks(BookFilterRequest filter, PageRequest pageRequest);

    BookModel getBookById(Integer id);
}
