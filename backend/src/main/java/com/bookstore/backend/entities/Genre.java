package com.bookstore.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "genre")
@Data
public class Genre
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "genre_id")
    private Integer genreId;

    private String name;

    private String description;

    @ManyToMany(mappedBy = "genres")
    private List<Book> books;
}
