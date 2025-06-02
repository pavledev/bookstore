package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.User;
import com.bookstore.backend.models.UserModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper extends IBaseMapper<User, UserModel>
{
}
