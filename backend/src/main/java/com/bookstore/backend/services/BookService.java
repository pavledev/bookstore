package com.bookstore.backend.services;

import com.bookstore.backend.dtos.request.CreateBookRequest;
import com.bookstore.backend.dtos.request.UpdateBookRequest;
import com.bookstore.backend.entities.*;
import com.bookstore.backend.mappers.BookMapper;
import com.bookstore.backend.dtos.request.BookFilterRequest;
import com.bookstore.backend.models.AuthorModel;
import com.bookstore.backend.models.BookModel;
import com.bookstore.backend.models.GenreModel;
import com.bookstore.backend.repositories.IBookRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService implements IBookService
{
    private final IBookRepository bookRepository;
    private final BookMapper bookMapper;

    @Override
    public Page<BookModel> getBooks(PageRequest pageRequest)
    {
        Page<Book> bookPage = bookRepository.findAll(pageRequest);

        return bookMapper.toModelPage(bookPage);
    }

    @Override
    public Page<BookModel> filterBooks(BookFilterRequest filter, PageRequest pageRequest)
    {
        Specification<Book> spec = Specification.where(null);

        if (filter.getCategoryId() != null)
        {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("categoryId"), filter.getCategoryId()));
        }

        if (filter.getQuery() != null && !filter.getQuery().isBlank())
        {
            String keyword = "%" + filter.getQuery().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), keyword),
                    cb.like(cb.lower(root.get("isbn")), keyword),
                    cb.like(cb.lower(root.get("barCode")), keyword)
            ));
        }

        if (filter.getGenreIds() != null && !filter.getGenreIds().isEmpty())
        {
            spec = spec.and((root, query, cb) ->
                    root.join("genres").get("genreId").in(filter.getGenreIds()));
        }

        if (filter.getPublisherIds() != null && !filter.getPublisherIds().isEmpty())
        {
            spec = spec.and((root, query, cb) ->
                    root.get("publisher").get("publisherId").in(filter.getPublisherIds()));
        }

        if (filter.getAuthorIds() != null && !filter.getAuthorIds().isEmpty())
        {
            spec = spec.and((root, query, cb) ->
                    root.join("authors").get("authorId").in(filter.getAuthorIds()));
        }

        Page<Book> page = bookRepository.findAll(spec, pageRequest);

        return bookMapper.toModelPage(page);
    }

    @Override
    public BookModel getBookById(Integer id)
    {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Book with ID " + id + " not found"));

        return bookMapper.toModel(book);
    }

    @Override
    public List<BookModel> getBooksByIds(List<Integer> ids)
    {
        List<Book> books = bookRepository.findAllById(ids);

        return bookMapper.toModelList(books);
    }

    @Override
    public void createBook(CreateBookRequest createBookRequest)
    {
        Book book = new Book();
        Category category = new Category();
        Publisher publisher = new Publisher();

        category.setCategoryId(createBookRequest.getCategory().getCategoryId());
        category.setName(createBookRequest.getCategory().getName());

        publisher.setPublisherId(createBookRequest.getPublisher().getPublisherId());
        publisher.setName(createBookRequest.getPublisher().getName());

        book.setCategory(category);
        book.setPublisher(publisher);
        book.setTitle(createBookRequest.getTitle());
        book.setMediumImagePath(createBookRequest.getMediumImagePath());
        book.setLargeImagePath(createBookRequest.getLargeImagePath());
        book.setExcerptPath(createBookRequest.getExcerptPath());
        book.setQuantity(createBookRequest.getQuantity());
        book.setDescription(createBookRequest.getDescription());
        book.setPublicationYear(createBookRequest.getPublicationYear());
        book.setImportYear(createBookRequest.getImportYear());
        book.setBinding(createBookRequest.getBinding());
        book.setPageCount(createBookRequest.getPageCount());
        book.setScript(createBookRequest.getScript());
        book.setWeight(createBookRequest.getWeight());
        book.setUnit(createBookRequest.getUnit());
        book.setIsbn(createBookRequest.getIsbn());
        book.setBarCode(createBookRequest.getBarCode());
        book.setImportCountry(createBookRequest.getImportCountry());
        book.setAgeGroup(createBookRequest.getAgeGroup());
        book.setFormat(createBookRequest.getFormat());
        book.setPrice(createBookRequest.getPrice());
        book.setDiscountPrice(createBookRequest.getDiscountPrice());

        List<Author> authors = new ArrayList<>();

        for (AuthorModel authorModel : createBookRequest.getAuthors())
        {
            Author author = new Author();

            author.setAuthorId(authorModel.getAuthorId());
            author.setFullName(authorModel.getFullName());
            authors.add(author);
        }

        book.setAuthors(authors);

        List<Genre> genres = new ArrayList<>();

        for (GenreModel genreModel : createBookRequest.getGenres())
        {
            Genre genre = new Genre();

            genre.setGenreId(genreModel.getGenreId());
            genre.setName(genreModel.getName());
            genres.add(genre);
        }

        book.setGenres(genres);

        bookRepository.save(book);
    }

    @Override
    public void updateBook(Integer bookId, UpdateBookRequest updateBookRequest)
    {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found."));
        Category category = new Category();
        Publisher publisher = new Publisher();

        category.setCategoryId(updateBookRequest.getCategory().getCategoryId());
        category.setName(updateBookRequest.getCategory().getName());

        publisher.setPublisherId(updateBookRequest.getPublisher().getPublisherId());
        publisher.setName(updateBookRequest.getPublisher().getName());

        book.setCategory(category);
        book.setPublisher(publisher);
        book.setTitle(updateBookRequest.getTitle());
        book.setMediumImagePath(updateBookRequest.getMediumImagePath());
        book.setLargeImagePath(updateBookRequest.getLargeImagePath());
        book.setExcerptPath(updateBookRequest.getExcerptPath());
        book.setQuantity(updateBookRequest.getQuantity());
        book.setDescription(updateBookRequest.getDescription());
        book.setPublicationYear(updateBookRequest.getPublicationYear());
        book.setImportYear(updateBookRequest.getImportYear());
        book.setBinding(updateBookRequest.getBinding());
        book.setPageCount(updateBookRequest.getPageCount());
        book.setScript(updateBookRequest.getScript());
        book.setWeight(updateBookRequest.getWeight());
        book.setUnit(updateBookRequest.getUnit());
        book.setIsbn(updateBookRequest.getIsbn());
        book.setBarCode(updateBookRequest.getBarCode());
        book.setImportCountry(updateBookRequest.getImportCountry());
        book.setAgeGroup(updateBookRequest.getAgeGroup());
        book.setFormat(updateBookRequest.getFormat());
        book.setPrice(updateBookRequest.getPrice());
        book.setDiscountPrice(updateBookRequest.getDiscountPrice());

        List<Author> authors = new ArrayList<>();

        for (AuthorModel authorModel : updateBookRequest.getAuthors())
        {
            Author author = new Author();

            author.setAuthorId(authorModel.getAuthorId());
            author.setFullName(authorModel.getFullName());
            authors.add(author);
        }

        book.setAuthors(authors);

        List<Genre> genres = new ArrayList<>();

        for (GenreModel genreModel : updateBookRequest.getGenres())
        {
            Genre genre = new Genre();

            genre.setGenreId(genreModel.getGenreId());
            genre.setName(genreModel.getName());
            genres.add(genre);
        }

        book.setGenres(genres);

        bookRepository.save(book);
    }

    @Override
    @Transactional
    public void deleteBook(Integer userId)
    {
        bookRepository.softDeleteById(userId);
    }
}
