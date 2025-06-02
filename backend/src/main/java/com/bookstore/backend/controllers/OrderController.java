package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.OrderFilterRequest;
import com.bookstore.backend.dtos.request.CreateOrderRequest;
import com.bookstore.backend.models.OrderModel;
import com.bookstore.backend.services.IOrderService;
import com.bookstore.backend.utils.SortHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("orders")
@RequiredArgsConstructor
public class OrderController
{
    private final IOrderService orderService;

    @GetMapping
    public Page<OrderModel> getOrders(Integer pageNumber, Integer pageSize)
    {
        return orderService.getOrders(PageRequest.of(pageNumber, pageSize));
    }

    @PostMapping("/filter")
    public Page<OrderModel> filterOrders(@RequestBody OrderFilterRequest filterRequest)
    {
        PageRequest pageRequest = PageRequest.of(
                filterRequest.getPage() != null ? filterRequest.getPage() - 1 : 0,
                filterRequest.getPerPage() != null ? filterRequest.getPerPage() : 20,
                SortHelper.getSort(filterRequest.getSort())
        );

        return orderService.filterOrders(filterRequest, pageRequest);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest createOrderRequest)
    {
        orderService.createOrder(createOrderRequest);

        return ResponseEntity.ok(Map.of("message", "Porudžbina je uspešno kreirana."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id)
    {
        orderService.deleteOrder(id);

        return ResponseEntity.ok(Map.of("message", "Porudžbina je uspešno obrisana."));
    }
}
