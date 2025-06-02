package com.bookstore.backend.dtos.request;

import com.bookstore.backend.models.AuthorModel;
import com.bookstore.backend.models.CategoryModel;
import com.bookstore.backend.models.GenreModel;
import com.bookstore.backend.models.PublisherModel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class UpdateBookRequest
{
    @NotNull(message = "Kategorija je obavezna")
    @Valid
    private CategoryModel category;

    private PublisherModel publisher;

    @NotBlank(message = "Naslov je obavezan")
    private String title;

    @NotBlank(message = "Putanja do srednje slike je obavezna")
    private String mediumImagePath;

    @NotBlank(message = "Putanja do velike slike je obavezna")
    private String largeImagePath;

    private String excerptPath;

    @NotNull(message = "Količina je obavezna")
    @Min(value = 0, message = "Količina mora biti veća ili jednaka nuli")
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

    @NotNull(message = "Cena je obavezna")
    private Double price;

    @NotNull(message = "Snižena cena je obavezna")
    private Double discountPrice;

    @NotEmpty(message = "Autori su obavezni")
    @Valid
    private List<AuthorModel> authors;

    @NotEmpty(message = "Žanrovi su obavezni")
    @Valid
    private List<GenreModel> genres;
}
