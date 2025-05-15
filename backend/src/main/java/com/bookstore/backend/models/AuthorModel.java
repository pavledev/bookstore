package com.bookstore.backend.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorModel
{
    private Integer authorId;
    private String fullName;
}
