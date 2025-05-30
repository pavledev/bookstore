'use client';

import React, { useEffect, useState } from 'react';
import {
    Box, Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    Grid, IconButton, InputAdornment, InputLabel,
    MenuItem, Pagination,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import useApi from '@/hooks/useApi';
import Image from 'next/image';
import { useAuth } from "@/context/AuthContext";
import { cookies } from "next/headers";
import { Search } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import SnackbarNotifier from "@/components/SnackbarNotifier/SnackbarNotifier";

interface Author
{
    fullName: string;
}

interface Book
{
    bookId: number;
    title: string;
    mediumImagePath: string;
    authors: Author[];
}

interface OrderItem
{
    book: Book;
    quantity: number;
    unitPrice: number;
}

interface Order
{
    orderId: number;
    totalAmount: number;
    createdAt: string;
    orderItems: OrderItem[];
}

export default function OrdersPage()
{
    const api = useApi();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useAuth();

    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('created_desc');
    const [perPage, setPerPage] = useState(25);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() =>
    {
        const fetchOrders = async () =>
        {
            try
            {
                const response = await api.post('/orders/filter', {
                    query,
                    sort,
                    perPage,
                    page
                });

                setOrders(response.data.content);
                setTotalPages(response.data.totalPages || 1);
            }
            catch (err)
            {
                console.error('Greška prilikom učitavanja porudžbina:', err);
            }
            finally
            {
                setLoading(false);
            }
        };

        if (isLoggedIn)
        {
            fetchOrders();
        }
    }, [isLoggedIn, query, sort, perPage, page]);

    const openDeleteDialog = (orderId: number) =>
    {
        setSelectedOrderId(orderId);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () =>
    {
        setDialogOpen(false);
        setSelectedOrderId(null);
    };

    const confirmDelete = async () =>
    {
        if (!selectedOrderId)
        {
            return;
        }

        try
        {
            const response = await api.delete(`/orders/${selectedOrderId}`);
            const { message } = response.data;

            setSnackbarMessage(message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setOrders(prev => prev.filter(order => order.orderId !== selectedOrderId));
        }
        catch (err)
        {
            console.error('Greška prilikom brisanja porudžbine:', err);

            setSnackbarMessage('Došlo je do greške. Pokušajte ponovo.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        finally
        {
            closeDeleteDialog();
        }
    };

    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Moje porudžbine
                </Typography>
                <Divider sx={{ mb: 3 }}/>

                <Box display="flex" alignItems="center" mb={3} gap={2} flexWrap="wrap">
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
                        <InputLabel id="sort-label">Sortiranje</InputLabel>
                        <Select
                            label="Sortiraj"
                            value={sort}
                            onChange={(e) =>
                            {
                                setPage(1);
                                setSort(e.target.value);
                            }}
                        >
                            <MenuItem value="created_desc">Najnovije</MenuItem>
                            <MenuItem value="created_asc">Najstarije</MenuItem>
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

                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress/>
                    </Box>
                ) : orders.length === 0 ? (
                    <Typography>Nemate nijednu porudžbinu.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {orders.map((order) => (
                            <Grid size={{ xs: 12 }} key={order.orderId}>
                                <Card>
                                    <CardContent>

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Porudžbina #{order.orderId}
                                            </Typography>

                                            <IconButton
                                                onClick={() => openDeleteDialog(order.orderId)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            Datum: {new Date(order.createdAt).toLocaleString('sr-RS')}
                                        </Typography>

                                        <Divider sx={{ mb: 1 }}/>

                                        {order.orderItems.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                my={1}
                                            >
                                                <Box display="flex" alignItems="center">
                                                    <Image
                                                        src={`https://delfi.rs${item.book.mediumImagePath}`}
                                                        alt={item.book.title}
                                                        width={48}
                                                        height={64}
                                                        style={{ objectFit: 'contain', marginRight: 16 }}
                                                    />
                                                    <Box>
                                                        <Typography fontWeight={600}>{item.book.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.book.authors.map((a) => a.fullName).join(', ')}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box textAlign="right">
                                                    <Typography>
                                                        {item.quantity} × {item.unitPrice.toLocaleString('sr-RS')} RSD
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}

                                        <Divider sx={{ my: 1 }}/>
                                        <Typography fontWeight={700}>
                                            Ukupno: {order.totalAmount.toLocaleString('sr-RS')} RSD
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                        <Box display="flex" justifyContent="flex-end" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, newPage) => setPage(newPage)}
                                color="primary"
                            />
                        </Box>
                    </Grid>
                )}
            </Container>

            <DeleteConfirmationDialog
                open={dialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                title={`Brisanje porudžbine #${selectedOrderId}`}
                description="Da li ste sigurni da želite da obrišete ovu porudžbinu? Ova akcija je nepovratna."
            />

            <SnackbarNotifier
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
}
