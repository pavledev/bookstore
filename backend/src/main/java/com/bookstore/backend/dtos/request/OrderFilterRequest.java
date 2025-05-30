package com.bookstore.backend.dtos.request;

import lombok.Data;

@Data
public class OrderFilterRequest
{
    private String query;
    private String sort;
    private Integer perPage;
    private Integer page;
}
