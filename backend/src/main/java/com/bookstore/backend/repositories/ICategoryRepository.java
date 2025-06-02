package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICategoryRepository extends JpaRepository<Category, Integer>
{
}
