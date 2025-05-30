package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Book;
import com.bookstore.backend.models.BookModel;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {PublisherMapper.class, AuthorMapper.class, GenreMapper.class})
public interface BookMapper extends IBaseMapper<Book, BookModel>
{
    @Mapping(target = "publisher", ignore = true)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Override
    Book toEntity(BookModel model);
}
