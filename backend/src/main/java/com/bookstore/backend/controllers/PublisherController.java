package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.CreatePublisherRequest;
import com.bookstore.backend.dtos.request.UpdatePublisherRequest;
import com.bookstore.backend.models.PublisherModel;
import com.bookstore.backend.services.IPublisherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("publishers")
@RequiredArgsConstructor
@Tag(name = "publishers", description = "Upravljanje izdavačima")
public class PublisherController
{
    private final IPublisherService publisherService;

    @GetMapping
    @Operation(
            summary = "Dobavi sve izdavače",
            description = "Vraća listu svih izdavača knjiga."
    )
    public List<PublisherModel> getPublishers()
    {
        return publisherService.getPublishers();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Kreiraj izdavača",
            description = "Dodaje novog izdavača. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> createPublisher(@Valid @RequestBody CreatePublisherRequest createPublisherRequest)
    {
        publisherService.createPublisher(createPublisherRequest);

        return ResponseEntity.ok(Map.of("message", "Izdavač je uspešno kreiran."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Ažuriraj izdavača",
            description = "Ažurira izdavača po ID-u. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> updatePublisher(
            @PathVariable Integer id,
            @Valid @RequestBody UpdatePublisherRequest updatePublisherRequest
    )
    {
        publisherService.updatePublisher(id, updatePublisherRequest);

        return ResponseEntity.ok(Map.of("message", "Izdavač je uspešno ažuriran."));
    }
}
