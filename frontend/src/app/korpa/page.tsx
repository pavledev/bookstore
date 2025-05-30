'use client';

import {
    Box,
    Button,
    Card,
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
import api from '@/utils/axios';
import { Book } from '@/types/book';
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

interface CartItem extends Book
{
    selectedQuantity: number;
}

export default function CartPage()
{
    const { cart, dispatch } = useCart();
    const [items, setItems] = useState<CartItem[]>([]);

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
        };

        fetchBooks();
    }, [cart]);

    const total = items.reduce(
        (sum, item) => sum + item.discountPrice * item.selectedQuantity,
        0
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
                Vaša korpa
            </Typography>
            <Divider sx={{ mb: 3 }}/>

            {items.length === 0 ? (
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
                                        <Typography variant="subtitle1" fontWeight={600}>{item.title}</Typography>
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

                                    <IconButton onClick={() => dispatch({ type: 'REMOVE', payload: item.bookId })}>
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
                            >
                                Poruči
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}
