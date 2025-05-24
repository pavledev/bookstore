'use client'

import {
    Box,
    Button, Card,
    Container,
    Divider,
    Grid,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tabs,
    Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/axios";
import { Book } from "@/types/book";
import AppHeader from "@/components/AppHeader/AppHeader";
import { MenuBook } from "@mui/icons-material";
import Loading from "@/components/Loading/Loading";
import { useCart } from '@/context/CartContext';
import SnackbarNotifier from '@/components/SnackbarNotifier/SnackbarNotifier';

const BookDetailsPage = () =>
{
    const [tab, setTab] = useState(0);
    const [book, setBook] = useState<Book | null>(null);
    const { bookIdSlug } = useParams();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { dispatch } = useCart();

    useEffect(() =>
    {
        const fetchBook = async () =>
        {
            try
            {
                const response = await api.get(`/books/${bookIdSlug}`);
                setBook(response.data);
            }
            catch (error)
            {
                console.error("Failed to fetch book details", error);
            }
        };

        if (bookIdSlug)
        {
            fetchBook();
        }
    }, [bookIdSlug]);

    const handleAddToCart = () =>
    {
        if (book == null)
        {
            return;
        }

        dispatch({ type: 'ADD', payload: book.bookId });
        setSnackbarOpen(true);
    };

    if (!book)
    {
        return <Loading/>;
    }

    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box position="relative">
                            <Image
                                src={"https://delfi.rs" + book.largeImagePath}
                                alt=".NET 8 alati i veštine"
                                width={400}
                                height={500}
                                style={{ borderRadius: 8, width: "100%", height: "auto" }}
                            />

                            {book.excerptPath && (
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<MenuBook/>}
                                        component="a"
                                        href={`https://delfi.rs${book.excerptPath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Pročitaj odlomak
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                            {book.genres.map(genre => genre.name).join(', ')}
                        </Typography>

                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            {book.title}
                        </Typography>

                        <Box mb={1}>
                            {book.authors.map((author) => (
                                <Typography key={author.authorId} variant="body1" fontWeight={500}>
                                    {author.fullName}
                                </Typography>
                            ))}
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {book.publisherName}
                        </Typography>

                        <Box mt={3}>
                            <Tabs
                                value={tab}
                                onChange={(e, newValue) => setTab(newValue)}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab label="Opis"/>
                                <Tab label="Deklaracija"/>
                            </Tabs>
                            <Divider/>
                            <Box mt={2}>
                                {tab === 0 && (
                                    <Typography
                                        component="div"
                                        dangerouslySetInnerHTML={{ __html: book.description }}
                                    />
                                )}
                                {tab === 1 && (
                                    <Table>
                                        <TableBody>
                                            {book.publicationYear && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Godina izdanja:</TableCell>
                                                    <TableCell>{book.publicationYear}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.importYear && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Godina uvoza:</TableCell>
                                                    <TableCell>{book.importYear}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.binding && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Povez:</TableCell>
                                                    <TableCell>{book.binding}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.pageCount && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Broj strana:</TableCell>
                                                    <TableCell>{book.pageCount}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.script && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Pismo:</TableCell>
                                                    <TableCell>{book.script}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.weight && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Težina (kg):</TableCell>
                                                    <TableCell>{book.weight}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.unit && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Jedinica mere:</TableCell>
                                                    <TableCell>{book.unit}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.isbn && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">ISBN:</TableCell>
                                                    <TableCell>{book.isbn}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.barCode && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Bar-kod:</TableCell>
                                                    <TableCell>{book.barCode}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.importCountry && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Zemlja uvoza:</TableCell>
                                                    <TableCell>{book.importCountry}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.importCountry && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Zemlja uvoza:</TableCell>
                                                    <TableCell>{book.importCountry}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.ageGroup && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Uzrast:</TableCell>
                                                    <TableCell>{book.ageGroup}</TableCell>
                                                </TableRow>
                                            )}
                                            {book.format && (
                                                <TableRow>
                                                    <TableCell component="th" scope="row">Format:</TableCell>
                                                    <TableCell>{book.format}</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
                            <Typography variant="h5">
                                Cena: {book.price} RSD
                            </Typography>
                            <Typography variant="h5" color="primary" fontWeight={700}>
                                Snižena cena: {book.discountPrice} RSD
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<ShoppingCartIcon/>}
                                sx={{ marginTop: 3 }}
                                onClick={handleAddToCart}>
                                Dodaj u korpu
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            <SnackbarNotifier
                open={snackbarOpen}
                message="Knjiga je dodata u korpu!"
                severity="success"
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
};

export default BookDetailsPage;
