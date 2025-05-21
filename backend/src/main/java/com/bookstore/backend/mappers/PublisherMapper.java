package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Publisher;
import com.bookstore.backend.models.PublisherModel;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PublisherMapper extends IBaseMapper<Publisher, PublisherModel>
{
}
