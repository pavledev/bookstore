package com.bookstore.backend.services;

import com.bookstore.backend.models.PublisherModel;

import java.util.List;

public interface IPublisherService
{
    List<PublisherModel> getPublishers();
}
