package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPublisherRepository extends JpaRepository<Publisher, Integer>
{
}
