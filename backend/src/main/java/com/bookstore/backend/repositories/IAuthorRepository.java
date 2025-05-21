package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IAuthorRepository extends JpaRepository<Author, Integer>
{
    @Query("SELECT a FROM Author a ORDER BY a.fullName ASC")
    List<Author> findAllSortedByName();
}
