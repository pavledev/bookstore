package com.bookstore.backend.dtos.request;

import lombok.Data;

@Data
public class OrderItemRequest
{
    private Integer bookId;
    private Integer quantity;
    private Double unitPrice;
}
