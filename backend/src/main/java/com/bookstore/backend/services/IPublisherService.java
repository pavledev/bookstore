package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreatePublisherRequest;
import com.bookstore.backend.dtos.request.UpdatePublisherRequest;
import com.bookstore.backend.models.PublisherModel;

import java.util.List;

public interface IPublisherService
{
    List<PublisherModel> getPublishers();

    void createPublisher(CreatePublisherRequest createPublisherRequest);

    void updatePublisher(Integer publisherId, UpdatePublisherRequest updatePublisherRequest);
}
