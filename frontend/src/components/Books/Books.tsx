'use client'

import React, { useEffect, useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Box, Container, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, TextField, Typography,
    InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from "@/utils/axios";
import VirtualizedCheckboxList from "@/components/VirtualizedCheckboxList/VirtualizedCheckboxList";
import { Genre } from "@/types/genre";
import { Publisher } from "@/types/publisher";
import { Author } from "@/types/author";
import BookCard from "@/components/BookCard/BookCard";
import { Book } from "@/types/book";
import { Search } from "@mui/icons-material";
import { slugify } from "@/utils/slugify";
import Loading from "@/components/Loading/Loading";

interface BooksProps
{
    categoryId: number;
}

const Books = ({ categoryId }: BooksProps) =>
{
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('title_asc');
    const [perPage, setPerPage] = useState(25);
    const [page, setPage] = useState(1);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedPublishers, setSelectedPublishers] = useState<number[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);

    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [areFiltersLoading, setAreFiltersLoading] = useState(false);
    const [areBooksLoading, setAreBooksLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [genres, setGenres] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [authors, setAuthors] = useState([]);

    useEffect(() =>
    {
        const fetchFilters = async () =>
        {
            try
            {
                setAreFiltersLoading(true);
                setError(null);

                const [genresResponse, publishersResponse, authorsResponse] = await Promise.all([
                    api.get('/genres'),
                    api.get('/publishers'),
                    api.get('/authors'),
                ]);

                setGenres(genresResponse.data);
                setPublishers(publishersResponse.data);
                setAuthors(authorsResponse.data);
            }
            catch (err)
            {
                console.error('Greška prilikom učitavanja filtera:', err);
            }
            finally
            {
                setAreFiltersLoading(false);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() =>
    {
        const fetchBooks = async () =>
        {
            try
            {
                setAreBooksLoading(true);
                setError(null);

                const response = await api.post('/books/filter', {
                    categoryId,
                    query,
                    sort,
                    perPage,
                    page,
                    genreIds: selectedGenres,
                    publisherIds: selectedPublishers,
                    authorIds: selectedAuthors,
                });

                setBooks(response.data.content);
                setTotalPages(response.data.totalPages || 1);
            }
            catch (err: unknown)
            {
                if (err instanceof Error)
                {
                    console.error('Greška:', err.message);

                    setError('Došlo je do greške prilikom učitavanja knjiga.');
                }
            }
            finally
            {
                setAreBooksLoading(false);
            }
        };

        fetchBooks();
    }, [categoryId, query, sort, perPage, page, selectedGenres, selectedPublishers, selectedAuthors]);

    const handleCheckboxChange = (id: number, setSelected: React.Dispatch<React.SetStateAction<number[]>>) =>
    {
        setPage(1);
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    if (areFiltersLoading || areBooksLoading)
    {
        return <Loading/>;
    }

    return (
        <Container maxWidth="xl">
            <Grid container spacing={3} py={4}>
                <Grid size={3}>
                    <Box>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Kategorije</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VirtualizedCheckboxList
                                    items={genres.map((genre: Genre) => ({
                                        id: genre.genreId,
                                        label: genre.name
                                    }))}
                                    selected={selectedGenres}
                                    onToggle={(id) => handleCheckboxChange(id, setSelectedGenres)}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Izdavači</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VirtualizedCheckboxList
                                    items={publishers.map((publisher: Publisher) => ({
                                        id: publisher.publisherId,
                                        label: publisher.name
                                    }))}
                                    selected={selectedPublishers}
                                    onToggle={(id) => handleCheckboxChange(id, setSelectedPublishers)}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Autori</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VirtualizedCheckboxList
                                    items={authors.map((author: Author) => ({
                                        id: author.authorId,
                                        label: author.fullName
                                    }))}
                                    selected={selectedAuthors}
                                    onToggle={(id) => handleCheckboxChange(id, setSelectedAuthors)}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>

                <Grid size={9}>
                    <Box display="flex" gap={2} mb={3}>
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
                            sx={{ width: '40%' }}
                        />

                        <FormControl>
                            <InputLabel>Sortiraj</InputLabel>
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

                    <Grid container spacing={2}>
                        {books.map((book: Book) => (
                            <BookCard
                                key={book.bookId}
                                bookId={book.bookId}
                                title={book.title}
                                mediumImagePath={book.mediumImagePath}
                                authors={book.authors}
                                price={book.price}
                                discountPrice={book.discountPrice}
                                href={`/knjige/${book.bookId}-${slugify(book.title)}`}
                            />
                        ))}
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(e, newPage) => setPage(newPage)}
                            color="primary"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Books;