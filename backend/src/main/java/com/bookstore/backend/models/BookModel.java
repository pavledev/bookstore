package com.bookstore.backend.models;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BookModel
{
    private Integer bookId;
    private CategoryModel category;
    private PublisherModel publisher;

    private String title;
    private String mediumImagePath;
    private String largeImagePath;
    private String excerptPath;
    private Integer quantity;
    private String description;
    private Short publicationYear;
    private Short importYear;
    private String binding;
    private Integer pageCount;
    private String script;
    private String weight;
    private String unit;
    private String isbn;
    private String barCode;
    private String importCountry;
    private String ageGroup;
    private String format;
    private Double price;
    private Double discountPrice;

    private List<AuthorModel> authors;
    private List<GenreModel> genres;
}
