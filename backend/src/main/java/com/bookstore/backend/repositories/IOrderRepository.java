package com.bookstore.backend.repositories;

import com.bookstore.backend.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IOrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order>
{
    Page<Order> findByIsDeletedFalse(Pageable pageable);

    @Modifying
    @Query("UPDATE Order o SET o.isDeleted = true WHERE o.orderId = :orderId")
    void softDeleteById(@Param("orderId") Integer orderId);
}
