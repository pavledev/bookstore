package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.OrderItem;
import com.bookstore.backend.models.OrderItemModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface OrderItemMapper extends IBaseMapper<OrderItem, OrderItemModel>
{
}
