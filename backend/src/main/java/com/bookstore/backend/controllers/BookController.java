package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.BookFilterRequest;
import com.bookstore.backend.models.BookModel;
import com.bookstore.backend.services.IBookService;
import com.bookstore.backend.utils.SortHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("books")
@RequiredArgsConstructor
public class BookController
{
    private final IBookService bookService;

    @GetMapping
    public Page<BookModel> getBooks(Integer pageNumber, Integer pageSize)
    {
        return bookService.getBooks(PageRequest.of(pageNumber, pageSize));
    }

    @PostMapping("/filter")
    public Page<BookModel> filterBooks(@RequestBody BookFilterRequest filterRequest)
    {
        PageRequest pageRequest = PageRequest.of(
                filterRequest.getPage() != null ? filterRequest.getPage() - 1 : 0,
                filterRequest.getPerPage() != null ? filterRequest.getPerPage() : 20,
                SortHelper.getSort(filterRequest.getSort())
        );

        return bookService.filterBooks(filterRequest, pageRequest);
    }

    @GetMapping("/{idWithSlug}")
    public BookModel getBookById(@PathVariable String idWithSlug)
    {
        Integer id = Integer.parseInt(idWithSlug.split("-")[0]);

        return bookService.getBookById(id);
    }

    @PostMapping("/by-ids")
    public List<BookModel> getBooksByIds(@RequestBody List<Integer> ids)
    {
        return bookService.getBooksByIds(ids);
    }
}
