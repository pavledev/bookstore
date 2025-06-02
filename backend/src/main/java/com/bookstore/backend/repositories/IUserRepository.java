package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IUserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User>
{
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Page<User> findByIsDeletedFalse(Pageable pageable);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.isDeleted = true WHERE u.userId = :userId")
    void softDeleteById(@Param("userId") Integer userId);
}
