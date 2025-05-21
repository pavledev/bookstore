package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IGenreRepository extends JpaRepository<Genre, Integer>
{
}
