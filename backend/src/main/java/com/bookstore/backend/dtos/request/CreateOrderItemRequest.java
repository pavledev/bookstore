package com.bookstore.backend.dtos.request;

import lombok.Data;

@Data
public class CreateOrderItemRequest
{
    private Integer bookId;
    private Integer quantity;
    private Double unitPrice;
}
