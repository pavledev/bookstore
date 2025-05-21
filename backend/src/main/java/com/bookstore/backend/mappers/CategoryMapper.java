package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Category;
import com.bookstore.backend.models.CategoryModel;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoryMapper extends IBaseMapper<Category, CategoryModel>
{
}
