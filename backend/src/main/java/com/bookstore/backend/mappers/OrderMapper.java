package com.bookstore.backend.mappers;

import com.bookstore.backend.entities.Order;
import com.bookstore.backend.models.OrderModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper extends IBaseMapper<Order, OrderModel>
{
}
