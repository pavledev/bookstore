package com.bookstore.backend.models;

import com.bookstore.backend.entities.Book;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemModel
{
    private Integer orderItemId;
    private BookModel book;
    private Integer quantity;
    private Double unitPrice;
}
