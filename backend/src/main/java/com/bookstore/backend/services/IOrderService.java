package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.OrderFilterRequest;
import com.bookstore.backend.dtos.request.CreateOrderRequest;
import com.bookstore.backend.models.OrderModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

public interface IOrderService
{
    Page<OrderModel> getOrders(PageRequest pageRequest);

    Page<OrderModel> filterOrders(OrderFilterRequest filter, PageRequest pageRequest);

    void createOrder(CreateOrderRequest createOrderRequest);

    void deleteOrder(Integer orderId);
}
