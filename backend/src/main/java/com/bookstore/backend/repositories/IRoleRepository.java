package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRoleRepository extends JpaRepository<Role, Integer>
{
    Optional<Role> findByName(String name);
}
