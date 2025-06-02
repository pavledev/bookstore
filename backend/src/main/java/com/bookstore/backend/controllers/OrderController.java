package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.OrderFilterRequest;
import com.bookstore.backend.dtos.request.CreateOrderRequest;
import com.bookstore.backend.models.OrderModel;
import com.bookstore.backend.services.IOrderService;
import com.bookstore.backend.utils.SortHelper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("orders")
@RequiredArgsConstructor
@Tag(name = "orders", description = "Upravljanje narudžbinama")
public class OrderController
{
    private final IOrderService orderService;

    @GetMapping
    @Operation(
            summary = "Dobavi sve narudžbine",
            description = "Vraća sve narudžbine iz sistema u vidu stranica, uz podršku za paginaciju."
    )
    public Page<OrderModel> getOrders(Integer pageNumber, Integer pageSize)
    {
        return orderService.getOrders(PageRequest.of(pageNumber, pageSize));
    }

    @PostMapping("/filter")
    @Operation(
            summary = "Filtriraj narudžbine",
            description = "Filtrira narudžbine prema zadatim kriterijumima."
    )
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
    @Operation(
            summary = "Kreiraj narudžbinu",
            description = "Dodaje novu narudžbinu u sistem."
    )
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest createOrderRequest)
    {
        orderService.createOrder(createOrderRequest);

        return ResponseEntity.ok(Map.of("message", "Narudžbina je uspešno kreirana."));
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Obriši narudžbinu",
            description = "Briše narudžbinu po ID-u."
    )
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id)
    {
        orderService.deleteOrder(id);

        return ResponseEntity.ok(Map.of("message", "Narudžbina je uspešno obrisana."));
    }
}
