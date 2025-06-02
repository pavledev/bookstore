package com.bookstore.backend.controllers;

import com.bookstore.backend.dtos.request.BookFilterRequest;
import com.bookstore.backend.dtos.request.CreateBookRequest;
import com.bookstore.backend.dtos.request.UpdateBookRequest;
import com.bookstore.backend.models.BookModel;
import com.bookstore.backend.services.IBookService;
import com.bookstore.backend.utils.SortHelper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("books")
@RequiredArgsConstructor
@Tag(name = "books", description = "Upravljanje knjigama")
public class BookController
{
    private final IBookService bookService;

    @GetMapping
    @Operation(
            summary = "Dobavi sve knjige",
            description = "Vraća straniciranu listu knjiga."
    )
    public Page<BookModel> getBooks(Integer pageNumber, Integer pageSize)
    {
        return bookService.getBooks(PageRequest.of(pageNumber, pageSize));
    }

    @PostMapping("/filter")
    @Operation(
            summary = "Filtriraj knjige",
            description = "Filtrira knjige prema zadatim kriterijumima (kategorija, autor, cena, itd)."
    )
    public Page<BookModel> filterBooks(@RequestBody BookFilterRequest filterRequest)
    {
        PageRequest pageRequest = PageRequest.of(
                filterRequest.getPage() != null ? filterRequest.getPage() - 1 : 0,
                filterRequest.getPerPage() != null ? filterRequest.getPerPage() : 20,
                SortHelper.getSort(filterRequest.getSort())
        );

        return bookService.filterBooks(filterRequest, pageRequest);
    }

    @GetMapping("/{idWithSlug}")
    @Operation(
            summary = "Dobavi knjigu po ID-u",
            description = "Vraća detalje knjige na osnovu ID-a iz URL-a u formatu 'id-naslov' (npr. 123-naslov-knjige)."
    )
    public BookModel getBookById(@PathVariable String idWithSlug)
    {
        Integer id = Integer.parseInt(idWithSlug.split("-")[0]);

        return bookService.getBookById(id);
    }

    @PostMapping("/by-ids")
    @Operation(
            summary = "Dobavi više knjiga po ID-jevima",
            description = "Vraća listu knjiga čiji su ID-jevi prosleđeni."
    )
    public List<BookModel> getBooksByIds(@RequestBody List<Integer> ids)
    {
        return bookService.getBooksByIds(ids);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Kreiraj knjigu",
            description = "Kreira novu knjigu. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> createBookByAdmin(@Valid @RequestBody CreateBookRequest createBookRequest)
    {
        bookService.createBook(createBookRequest);

        return ResponseEntity.ok(Map.of("message", "Knjiga je uspešno kreirana."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Ažuriraj knjigu",
            description = "Ažurira postojeću knjigu na osnovu ID-a. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> updateBook(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateBookRequest updateBookRequest
    )
    {
        bookService.updateBook(id, updateBookRequest);

        return ResponseEntity.ok(Map.of("message", "Knjiga je uspešno ažurirana."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Obriši knjigu",
            description = "Briše knjigu iz sistema. Samo admin korisnici imaju pristup."
    )
    public ResponseEntity<?> deleteBook(@PathVariable Integer id)
    {
        bookService.deleteBook(id);

        return ResponseEntity.ok(Map.of("message", "Knjiga je uspešno obrisana."));
    }
}
