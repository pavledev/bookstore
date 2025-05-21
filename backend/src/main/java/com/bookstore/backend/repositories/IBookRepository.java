package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IBookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book>
{
}
