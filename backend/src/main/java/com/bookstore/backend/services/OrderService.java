package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.OrderFilterRequest;
import com.bookstore.backend.dtos.request.CreateOrderRequest;
import com.bookstore.backend.entities.Book;
import com.bookstore.backend.entities.Order;
import com.bookstore.backend.entities.OrderItem;
import com.bookstore.backend.entities.User;
import com.bookstore.backend.mappers.OrderMapper;
import com.bookstore.backend.models.OrderModel;
import com.bookstore.backend.repositories.IBookRepository;
import com.bookstore.backend.repositories.IOrderRepository;
import com.bookstore.backend.repositories.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService
{
    private final IOrderRepository orderRepository;
    private final IUserRepository userRepository;
    private final IBookRepository bookRepository;
    private final OrderMapper orderMapper;

    @Override
    public Page<OrderModel> getOrders(PageRequest pageRequest)
    {
        Page<Order> orderPage = orderRepository.findByIsDeletedFalse(pageRequest);

        return orderMapper.toModelPage(orderPage);
    }

    @Override
    public Page<OrderModel> filterOrders(OrderFilterRequest filter, PageRequest pageRequest)
    {
        Specification<Order> spec = Specification.where(null);

        if (filter.getQuery() != null && !filter.getQuery().isBlank())
        {
            String keyword = "%" + filter.getQuery().toLowerCase() + "%";

            spec = spec.and((root, query, cb) ->
            {
                Join<Object, Object> orderItems = root.join("orderItems", JoinType.INNER);
                Join<Object, Object> book = orderItems.join("book", JoinType.INNER);

                return cb.or(
                        cb.like(cb.lower(book.get("title")), keyword),
                        cb.like(cb.lower(book.get("isbn")), keyword),
                        cb.like(cb.lower(book.get("barCode")), keyword)
                );
            });
        }

        spec = spec.and((root, query, cb) -> cb.isFalse(root.get("isDeleted")));

        Page<Order> page = orderRepository.findAll(spec, pageRequest);

        return orderMapper.toModelPage(page);
    }

    @Override
    public void createOrder(CreateOrderRequest createOrderRequest)
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Order order = new Order();

        order.setUserId(user.getUserId());
        order.setTotalAmount(createOrderRequest.getTotalAmount());
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = createOrderRequest.getOrderItems().stream().map(itemModel ->
        {
            Book book = bookRepository.findById(itemModel.getBookId())
                    .orElseThrow(() -> new EntityNotFoundException("Book not found"));

            /*book.setQuantity(book.getQuantity() - itemModel.getQuantity());

            bookRepository.save(book);*/

            OrderItem item = new OrderItem();

            item.setBook(book);
            item.setQuantity(itemModel.getQuantity());
            item.setUnitPrice(itemModel.getUnitPrice());
            item.setOrder(order);

            return item;
        }).toList();

        order.setOrderItems(items);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Integer orderId)
    {
        orderRepository.softDeleteById(orderId);
    }
}
