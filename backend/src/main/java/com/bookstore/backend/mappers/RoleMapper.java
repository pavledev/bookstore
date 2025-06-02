package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Role;
import com.bookstore.backend.models.RoleModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper extends IBaseMapper<Role, RoleModel>
{
}
