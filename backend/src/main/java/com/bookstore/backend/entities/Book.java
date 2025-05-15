package com.bookstore.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "book")
@Data
public class Book
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Integer bookId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToMany
    @JoinTable(
            name = "book_author",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private List<Author> authors;

    @ManyToMany
    @JoinTable(
            name = "book_genre",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "medium_image_path", nullable = false)
    private String mediumImagePath;

    @Column(name = "large_image_path", nullable = false)
    private String largeImagePath;

    @Column(name = "excerpt_path")
    private String excerptPath;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "publication_year")
    private Short publicationYear;

    @Column(name = "import_year")
    private Short importYear;

    @Column(name = "binding")
    private String binding;

    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "script")
    private String script;

    @Column(name = "weight")
    private String weight;

    @Column(name = "unit")
    private String unit;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "bar_code")
    private String barCode;

    @Column(name = "import_country")
    private String importCountry;

    @Column(name = "age_group")
    private String ageGroup;

    @Column(name = "format")
    private String format;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "discount_price", nullable = false)
    private Double discountPrice;
}
