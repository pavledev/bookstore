package com.bookstore.backend.services;

import com.bookstore.backend.entities.Publisher;
import com.bookstore.backend.mappers.PublisherMapper;
import com.bookstore.backend.models.PublisherModel;
import com.bookstore.backend.repositories.IPublisherRepository;
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
}
