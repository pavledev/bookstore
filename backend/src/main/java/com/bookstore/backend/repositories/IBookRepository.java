package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IBookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book>
{
    @Modifying
    @Query("UPDATE Book b SET b.isDeleted = true WHERE b.bookId = :bookId")
    void softDeleteById(@Param("bookId") Integer bookId);
}
