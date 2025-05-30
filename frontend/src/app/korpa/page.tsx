'use client';

import {
    Box,
    Button,
    Card, CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCart } from '@/context/CartContext';
import { Book } from '@/types/book';
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import useApi from "@/hooks/useApi";
import SnackbarNotifier from "@/components/SnackbarNotifier/SnackbarNotifier";
import { useRouter } from "next/navigation";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog/DeleteConfirmationDialog";

interface CartItem extends Book
{
    selectedQuantity: number;
}

const CartPage = () =>
{
    const { cart, dispatch } = useCart();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const router = useRouter();

    const api = useApi();

    useEffect(() =>
    {
        const fetchBooks = async () =>
        {
            if (cart.length === 0)
            {
                setItems([]);

                return;
            }

            const ids = cart.map(item => item.bookId);

            try
            {
                const response = await api.post<Book[]>('/books/by-ids', ids);
                const merged: CartItem[] = cart.map(entry =>
                {
                    const book = response.data.find(b => b.bookId === entry.bookId);

                    return book ? { ...book, selectedQuantity: entry.selectedQuantity } : null;
                }).filter(Boolean) as CartItem[];

                setItems(merged);
            }
            catch (err)
            {
                console.error('Greška prilikom učitavanja knjiga iz korpe.', err);
            }
            finally
            {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [cart]);

    const total = items.reduce(
        (sum, item) => sum + item.discountPrice * item.selectedQuantity,
        0
    );

    const handlePlaceOrder = async () =>
    {
        const orderRequest = {
            totalAmount: total,
            orderItems: items.map(item => ({
                bookId: item.bookId,
                quantity: item.selectedQuantity,
                unitPrice: item.discountPrice,
            }))
        };

        try
        {
            const response = await api.post('/orders', orderRequest);
            const { message } = response.data;

            setSnackbarMessage(message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            dispatch({ type: 'CLEAR' });
        }
        catch (error)
        {
            console.error('Greška prilikom slanja narudžbine:', error);

            setSnackbarMessage('Došlo je do greške. Pokušajte ponovo.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () =>
    {
        setSnackbarOpen(false);

        if (snackbarSeverity === 'success')
        {
            router.push('/');
        }
    };

    const openDeleteDialog = (bookId: number) =>
    {
        setSelectedBookId(bookId);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () =>
    {
        setDialogOpen(false);
        setSelectedBookId(null);
    };

    const confirmDelete = async () =>
    {
        if (!selectedBookId)
        {
            return;
        }

        setSnackbarMessage('Knjiga je uspešno obrisana');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        dispatch({ type: 'REMOVE', payload: selectedBookId })

        closeDeleteDialog();
    };

    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Vaša korpa
                </Typography>
                <Divider sx={{ mb: 3 }}/>

                {
                    loading ? (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <CircularProgress/>
                        </Box>
                    ) : items.length === 0 ? (
                        <Typography>Korpa je prazna.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 9 }}>
                                {items.map(item => (
                                    <Card
                                        key={item.bookId}
                                        sx={{
                                            mb: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            py: 2
                                        }}
                                    >
                                        <Box display="flex" alignItems="center">
                                            <Image
                                                src={"https://delfi.rs" + item.mediumImagePath}
                                                alt={item.title}
                                                width={72}
                                                height={96}
                                                style={{ objectFit: 'contain', marginLeft: 16 }}
                                                priority={true}
                                            />
                                            <Box ml={2}>
                                                <Typography variant="subtitle1"
                                                            fontWeight={600}>{item.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.authors.map(a => a.fullName).join(', ')}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box display="flex" alignItems="center" pr={2} gap={2}>
                                            <Typography fontWeight={700}>
                                                {item.discountPrice.toLocaleString("sr-RS")} RSD
                                            </Typography>

                                            <QuantitySelector
                                                value={item.selectedQuantity}
                                                min={1}
                                                max={item.quantity}
                                                onChange={(newQuantity) =>
                                                    dispatch({
                                                        type: 'UPDATE_QUANTITY',
                                                        payload: { bookId: item.bookId, selectedQuantity: newQuantity },
                                                    })
                                                }
                                            />

                                            <IconButton
                                                onClick={() => openDeleteDialog(item.bookId)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Box>
                                    </Card>
                                ))}
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Ukupno:
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700}>
                                        {total.toLocaleString("sr-RS")} RSD
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={handlePlaceOrder}
                                    >
                                        Poruči
                                    </Button>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
            </Container>

            <DeleteConfirmationDialog
                open={dialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                title={"Brisanje knjige"}
                description="Da li ste sigurni da želite da obrišete ovu knjigu? Ova akcija je nepovratna."
            />

            <SnackbarNotifier
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default CartPage;
