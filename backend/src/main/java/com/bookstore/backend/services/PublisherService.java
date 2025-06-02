package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreatePublisherRequest;
import com.bookstore.backend.dtos.request.UpdatePublisherRequest;
import com.bookstore.backend.entities.Publisher;
import com.bookstore.backend.mappers.PublisherMapper;
import com.bookstore.backend.models.PublisherModel;
import com.bookstore.backend.repositories.IPublisherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService implements IPublisherService
{
    private final IPublisherRepository publisherRepository;
    private final PublisherMapper publisherMapper;

    @Override
    public List<PublisherModel> getPublishers()
    {
        List<Publisher> publishers = publisherRepository.findAll();

        return publisherMapper.toModelList(publishers);
    }

    @Override
    public void createPublisher(CreatePublisherRequest createPublisherRequest)
    {
        Publisher publisher = new Publisher();

        publisher.setName(createPublisherRequest.getName());

        publisherRepository.save(publisher);
    }

    @Override
    public void updatePublisher(Integer publisherId, UpdatePublisherRequest updatePublisherRequest)
    {
        Publisher publisher = publisherRepository.findById(publisherId)
                .orElseThrow(() -> new EntityNotFoundException("Publisher not found."));

        publisher.setName(updatePublisherRequest.getName());

        publisherRepository.save(publisher);
    }
}
