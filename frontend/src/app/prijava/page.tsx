"use client";

import { Box, Button, Container, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from "@/components/AppHeader/AppHeader";
import { Lock, Login, Person } from "@mui/icons-material";
import api from "@/utils/axios";

export default function LoginPage()
{
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try
        {
            const response = await api.post('/auth/login', {
                identifier,
                password,
            });
            const { token, tokenType } = response.data;
            localStorage.setItem('token', `${tokenType} ${token}`);
            router.push('/');
        }
        catch (err: any)
        {
            if (err.response?.data)
            {
                setErrors(err.response.data);
            }
            else
            {
                setErrors({ global: 'Neuspešna prijava. Proverite podatke.' });
            }
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Prijava
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Korisničko ime / Email adresa"
                    margin="normal"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.identifier}
                    helperText={errors.identifier}
                />
                <TextField
                    fullWidth
                    label="Lozinka"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.identifier}
                    helperText={errors.identifier}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    startIcon={<Login/>}
                    loading={loading}
                    loadingPosition="start"
                >
                    Prijavi se
                </Button>
            </Box>
        </Container>
    );
}