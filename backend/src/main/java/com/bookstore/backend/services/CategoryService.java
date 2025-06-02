package com.bookstore.backend.services;

import com.bookstore.backend.entities.Category;
import com.bookstore.backend.mappers.CategoryMapper;
import com.bookstore.backend.models.CategoryModel;
import com.bookstore.backend.repositories.ICategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService
{
    private final ICategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryModel> getCategories()
    {
        List<Category> categories = categoryRepository.findAll();

        return categoryMapper.toModelList(categories);
    }
}
