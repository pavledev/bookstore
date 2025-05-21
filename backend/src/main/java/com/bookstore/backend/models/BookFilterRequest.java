package com.bookstore.backend.models;

import lombok.Data;

import java.util.List;

@Data
public class BookFilterRequest
{
    private Integer categoryId;
    private String query;
    private String sort;
    private Integer perPage;
    private Integer page;
    private List<Integer> genreIds;
    private List<Integer> publisherIds;
    private List<Integer> authorIds;
}
