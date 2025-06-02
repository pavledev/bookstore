package com.bookstore.backend.services;

import com.bookstore.backend.models.CategoryModel;

import java.util.List;

public interface ICategoryService
{
    List<CategoryModel> getCategories();
}
