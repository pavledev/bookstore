package com.bookstore.backend.dtos.request;

import lombok.Data;

@Data
public class UserFilterRequest
{
    private String query;
    private Integer perPage;
    private Integer page;
}
