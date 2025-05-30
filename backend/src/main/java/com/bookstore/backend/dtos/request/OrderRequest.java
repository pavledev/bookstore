package com.bookstore.backend.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest
{
    private Double totalAmount;
    private List<OrderItemRequest> orderItems;
}
