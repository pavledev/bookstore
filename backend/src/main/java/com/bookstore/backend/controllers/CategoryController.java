package com.bookstore.backend.controllers;

import com.bookstore.backend.models.CategoryModel;
import com.bookstore.backend.services.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("categories")
@RequiredArgsConstructor
public class CategoryController
{
    private final ICategoryService categoryService;

    @GetMapping
    public List<CategoryModel> getCategories()
    {
        return categoryService.getCategories();
    }
}
