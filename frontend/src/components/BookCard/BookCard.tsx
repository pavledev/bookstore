'use client';

import {
    Box, Button, Card, CardContent, CardMedia, Link, Typography,
    useTheme
} from '@mui/material';
import { Author } from "@/types/author";
import { ShoppingCart } from "@mui/icons-material";
import * as React from "react";
import { useCart } from '@/context/CartContext';
import { useState } from "react";
import SnackbarNotifier from "@/components/SnackbarNotifier/SnackbarNotifier";

interface BookCardProps
{
    bookId: number;
    title: string;
    mediumImagePath: string;
    authors: Author[];
    price: number;
    discountPrice: number;
    href: string;
}

const BookCard = (bookCardProps: BookCardProps) =>
{
    const theme = useTheme();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { dispatch } = useCart();

    const calculateDiscountPercentage = (originalPrice: number, discountPrice: number): number =>
    {
        if (originalPrice <= 0)
        {
            throw new Error("Original price must be greater than zero.");
        }
        if (discountPrice < 0)
        {
            throw new Error("Discount price cannot be negative.");
        }

        const discount = originalPrice - discountPrice;
        const discountPercentage = (discount / originalPrice) * 100;

        return Math.round(discountPercentage * 100) / 100;
    };

    const handleAddToCart = () =>
    {
        dispatch({ type: 'ADD', payload: bookCardProps.bookId });
        setSnackbarOpen(true);
    };

    return (
        <>
            <Card sx={{ position: 'relative', width: 250, borderRadius: 2, cursor: 'pointer' }}>
                <Link href={bookCardProps.href}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 40,
                            right: 20,
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            borderRadius: 1,
                            px: 1,
                            py: 0.25,
                        }}
                    >
                        {calculateDiscountPercentage(bookCardProps.price, bookCardProps.discountPrice) + "%"}
                    </Box>

                    <Box sx={{ minHeight: 215, maxHeight: 272, maxWidth: 172, margin: 'auto', mt: 3 }}>
                        <CardMedia
                            component="img"
                            image={"https://delfi.rs" + bookCardProps.mediumImagePath}
                            alt={bookCardProps.title}
                            sx={{ maxHeight: 215, objectFit: 'contain' }}
                        />
                    </Box>
                </Link>

                <CardContent sx={{ p: 2 }}>

                    <Link href={bookCardProps.href} underline="none" color="inherit">
                        <Typography variant="subtitle2" sx={{
                            fontWeight: 'bold',
                            height: '40px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: 16,
                            lineHeight: '20px'
                        }}>
                            {bookCardProps.title}
                        </Typography>
                    </Link>

                    <Box mt={1} sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {bookCardProps.authors.map((author: Author) => (
                            <Typography
                                key={author.authorId}
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                            >
                                {author.fullName}
                            </Typography>
                        ))}
                    </Box>

                    <Box mt={1}>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                            {bookCardProps.discountPrice.toLocaleString()} RSD
                        </Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                            {bookCardProps.price.toLocaleString()} RSD
                        </Typography>
                    </Box>

                    <Box mt={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ShoppingCart/>}
                            onClick={handleAddToCart}>
                            Dodaj u korpu
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <SnackbarNotifier
                open={snackbarOpen}
                message="Knjiga je dodata u korpu!"
                severity="success"
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
};

export default BookCard;