package com.bookstore.backend.utils;

import org.springframework.data.domain.Sort;

public class SortHelper
{
    public static Sort getSort(String sortKey)
    {
        if (sortKey == null) return Sort.unsorted();

        return switch (sortKey)
        {
            case "title_asc" -> Sort.by(Sort.Direction.ASC, "title");
            case "title_desc" -> Sort.by(Sort.Direction.DESC, "title");
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "created_asc" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "created_desc" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.unsorted();
        };
    }
}
