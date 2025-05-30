package com.bookstore.backend.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderModel
{
    private Integer orderId;
    private Integer userId;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemModel> orderItems;
}
