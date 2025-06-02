package com.bookstore.backend.controllers;

import com.bookstore.backend.models.CategoryModel;
import com.bookstore.backend.services.ICategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("categories")
@RequiredArgsConstructor
@Tag(name = "categories", description = "Upravljanje kategorijama")
public class CategoryController
{
    private final ICategoryService categoryService;

    @GetMapping
    @Operation(
            summary = "Dobavi sve kategorije",
            description = "Vraća listu svih kategorija knjiga."
    )
    public List<CategoryModel> getCategories()
    {
        return categoryService.getCategories();
    }
}
