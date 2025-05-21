package com.bookstore.backend.controllers;

import com.bookstore.backend.models.PublisherModel;
import com.bookstore.backend.services.IPublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("publishers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PublisherController
{
    private final IPublisherService publisherService;

    @GetMapping
    public List<PublisherModel> getPublishers()
    {
        return publisherService.getPublishers();
    }
}
