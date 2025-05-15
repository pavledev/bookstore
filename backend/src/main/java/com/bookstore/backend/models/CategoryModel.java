package com.bookstore.backend.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryModel
{
    private Integer categoryId;
    private String name;
    private String description;
}
