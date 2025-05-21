package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Author;
import com.bookstore.backend.models.AuthorModel;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AuthorMapper extends IBaseMapper<Author, AuthorModel>
{
}
