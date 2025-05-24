package com.bookstore.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "publisher")
@Data
public class Publisher
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "publisher_id")
    private Integer publisherId;

    private String name;
}
