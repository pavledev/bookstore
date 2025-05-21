package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Genre;
import com.bookstore.backend.models.GenreModel;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface GenreMapper extends IBaseMapper<Genre, GenreModel>
{
}
