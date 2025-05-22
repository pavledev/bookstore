package com.bookstore.backend.services;

import com.bookstore.backend.models.BookFilterRequest;
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
}
