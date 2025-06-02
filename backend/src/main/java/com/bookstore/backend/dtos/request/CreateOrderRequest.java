package com.bookstore.backend.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest
{
    private Double totalAmount;
    private List<CreateOrderItemRequest> orderItems;
}
