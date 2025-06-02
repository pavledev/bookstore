'use client';

import {
    Box,
    Button,
    Card, Container,
    FormControl,
    IconButton, InputAdornment, InputLabel, MenuItem, Pagination, Select, TextField,
    Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Book } from '@/types/book';
import useApi from "@/hooks/useApi";
import SnackbarNotifier from "@/components/SnackbarNotifier/SnackbarNotifier";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import Loading from "@/components/Loading/Loading";
import { Add, Edit, Search, Delete } from "@mui/icons-material";
import axios from "axios";
import { CreateBookRequest } from "@/types/createBookRequest";
import { UpdateBookRequest } from "@/types/updateBookRequest";
import BookDialog from "@/components/Admin/BookDialog/BookDialog";
import { Genre } from "@/types/genre";
import { Category } from "@/types/category";
import { Publisher } from "@/types/publisher";
import { Author } from "@/types/author";

const Books = () =>
{
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [areBooksLoading, setAreBooksLoading] = useState(false);
    const [areCategoriesLoading, setAreCategoriesLoading] = useState(false);
    const [arePublishersLoading, setArePublishersLoading] = useState(false);
    const [areAuthorsLoading, setAreAuthorsLoading] = useState(false);
    const [areGenresLoading, setAreGenresLoading] = useState(false);

    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('title_asc');
    const [perPage, setPerPage] = useState(25);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [bookDialogOpen, setBookDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const api = useApi();

    const fetchBooks = async () =>
    {
        try
        {
            setAreBooksLoading(true);

            const response = await api.post('/books/filter', {
                query,
                sort,
                perPage,
                page
            });

            setBooks(response.data.content);
            setTotalPages(response.data.totalPages || 1);
        }
        catch (error: unknown)
        {
            if (error instanceof Error)
            {
                console.error('Greška:', error.message);
            }
        }
        finally
        {
            setAreBooksLoading(false);
        }
    };

    const fetchCategories = async () =>
    {
        try
        {
            setAreCategoriesLoading(true);

            const response = await api.get('/categories');

            setCategories(response.data);
        }
        catch (error: unknown)
        {
            if (error instanceof Error)
            {
                console.error('Greška:', error.message);
            }
        }
        finally
        {
            setAreCategoriesLoading(false);
        }
    };

    const fetchPublishers = async () =>
    {
        try
        {
            setArePublishersLoading(true);

            const response = await api.get('/publishers');

            setPublishers(response.data);
        }
        catch (error: unknown)
        {
            if (error instanceof Error)
            {
                console.error('Greška:', error.message);
            }
        }
        finally
        {
            setArePublishersLoading(false);
        }
    };

    const fetchAuthors = async () =>
    {
        try
        {
            setAreAuthorsLoading(true);

            const response = await api.get('/authors');

            setAuthors(response.data);
        }
        catch (error: unknown)
        {
            if (error instanceof Error)
            {
                console.error('Greška:', error.message);
            }
        }
        finally
        {
            setAreAuthorsLoading(false);
        }
    };

    const fetchGenres = async () =>
    {
        try
        {
            setAreGenresLoading(true);

            const response = await api.get('/genres');

            setGenres(response.data);
        }
        catch (error: unknown)
        {
            if (error instanceof Error)
            {
                console.error('Greška:', error.message);
            }
        }
        finally
        {
            setAreGenresLoading(false);
        }
    };

    useEffect(() =>
    {
        fetchBooks();
        fetchCategories();
        fetchPublishers();
        fetchAuthors();
        fetchGenres();
    }, [query, sort, perPage, page]);

    const handleAddClick = () =>
    {
        setSelectedBook(null);
        setFormErrors({});
        setBookDialogOpen(true);
    };

    const handleEditClick = (book: Book) =>
    {
        setSelectedBook(book);
        setFormErrors({});
        setBookDialogOpen(true);
    };

    const handleDelete = async () =>
    {
        if (!bookToDelete)
        {
            return;
        }

        try
        {
            const response = await api.delete(`/books/${bookToDelete.bookId}`);
            const { message } = response.data;

            showSnackbar(message, 'success');
            setBookToDelete(null);
            fetchBooks();
        }
        catch (error: unknown)
        {
            showSnackbar('Greška prilikom brisanja korisnika', 'error');

            console.error('Greška prilikom brisanja korisnika:', error);
        }
    };

    const handleSaveBook = async (bookData: CreateBookRequest | UpdateBookRequest, isEdit: boolean) =>
    {
        try
        {
            setFormErrors({});

            let response;

            if (isEdit)
            {
                response = await api.put(`/books/${selectedBook!.bookId}`, bookData);
            }
            else
            {
                response = await api.post('/books', bookData);
            }

            const { message } = response.data;

            showSnackbar(message, 'success');

            setBookDialogOpen(false);
            fetchBooks();
        }
        catch (error: unknown)
        {
            if (axios.isAxiosError(error) && error.response?.data)
            {
                setFormErrors(error.response.data);
            }
            else
            {
                showSnackbar('Greška prilikom čuvanja korisnika', 'error');
            }
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') =>
    {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    if (areCategoriesLoading ||
        arePublishersLoading ||
        areAuthorsLoading ||
        areGenresLoading)
    {
        return <Loading/>;
    }

    return (
        <>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" alignItems="center" mb={3} gap={2} flexWrap="wrap">
                    <Box display="flex" gap={2} flexWrap="wrap" flexGrow={1}>
                        <TextField
                            label="Pretraži"
                            placeholder="Pretraži prema naslovu, autoru, kategoriji ili ISBN-u"
                            value={query}
                            onChange={(e) =>
                            {
                                setPage(1);
                                setQuery(e.target.value);
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search/>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ width: '50%' }}
                        />

                        <FormControl>
                            <InputLabel>Sortiranje</InputLabel>
                            <Select
                                label="Sortiraj"
                                value={sort}
                                onChange={(e) =>
                                {
                                    setPage(1);
                                    setSort(e.target.value);
                                }}
                            >
                                <MenuItem value="title_asc">Po nazivu od A do Š</MenuItem>
                                <MenuItem value="title_desc">Po nazivu od Š do A</MenuItem>
                                <MenuItem value="publicatation_year_asc">Po godini izdavanja (rastuće)</MenuItem>
                                <MenuItem value="publicatation_year_desc">Po godini izdavanja (opadajuće)</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Prikaži</InputLabel>
                            <Select
                                label="Prikaži"
                                value={perPage}
                                onChange={(e) =>
                                {
                                    setPage(1);
                                    setPerPage(Number(e.target.value));
                                }}
                            >
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={75}>75</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant="contained" onClick={handleAddClick} startIcon={<Add/>}>
                        Dodaj knjigu
                    </Button>
                </Box>

                {areBooksLoading ? (
                    <Loading/>
                ) : books.length === 0 ? (
                    <Typography>Nema knjiga.</Typography>
                ) : (
                    <>
                        {books.map((book: Book) => (
                            <Card
                                key={book.bookId}
                                sx={{
                                    mb: 2,
                                    display: 'flex',
                                    py: 2,
                                    px: 2,
                                    alignItems: 'center',
                                    gap: 3
                                }}
                            >
                                <Box display="flex" alignItems="center" flex={1} minWidth={0}>
                                    <Box position="relative" width={72} height={96} ml={2}>
                                        <Image
                                            src={`https://delfi.rs${book.mediumImagePath}`}
                                            alt={book.title}
                                            fill
                                            sizes="72px"
                                            style={{ objectFit: 'contain' }}
                                            priority
                                        />
                                    </Box>

                                    <Box ml={2} sx={{ overflow: 'hidden' }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                                        >
                                            {book.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                                        >
                                            {book.authors.map(a => a.fullName).join(', ')}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    sx={{
                                        width: '350px',
                                        flexShrink: 0,
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight={700}>
                                            Cena: {book.price.toLocaleString("sr-RS")} RSD
                                        </Typography>
                                        <Typography fontWeight={700}>
                                            Snižena cena: {book.discountPrice.toLocaleString("sr-RS")} RSD
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <IconButton onClick={() => handleEditClick(book)} color="primary">
                                            <Edit/>
                                        </IconButton>

                                        <IconButton onClick={() => setBookToDelete(book)} color="error">
                                            <Delete/>
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        ))}

                        <Box display="flex" justifyContent="flex-end" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, newPage) => setPage(newPage)}
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Container>

            <BookDialog
                open={bookDialogOpen}
                onCloseAction={() => setBookDialogOpen(false)}
                onSaveAction={handleSaveBook}
                book={selectedBook}
                errors={formErrors}
                categories={categories}
                publishers={publishers}
                authors={authors}
                genres={genres}
            />

            <DeleteConfirmationDialog
                open={!!bookToDelete}
                onClose={() => setBookToDelete(null)}
                onConfirm={handleDelete}
                title="Brisanje knjige"
                description={`Da li ste sigurni da želite da obrišete knjigu "${bookToDelete?.title}"?`}
            />

            <SnackbarNotifier
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
};

export default Books;
