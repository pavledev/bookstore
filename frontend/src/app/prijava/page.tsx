'use client';

import { Alert, Box, Button, Container, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Login, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import IconButton from "@mui/material/IconButton";

const LoginPage = () =>
{
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { setAccessToken, setIsLoggedIn } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
        });

        const data = await response.json();

        if (response.ok)
        {
            const { accessToken } = data;

            setIsLoggedIn(true);
            setAccessToken(accessToken);
            router.push('/');
        }
        else
        {
            if (data)
            {
                setErrors(data);
            }
            else
            {
                setErrors({ global: 'Neuspešna prijava. Proverite podatke.' });
            }
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Prijava
            </Typography>
            {errors.global && (
                <Box mb={2}>
                    <Alert severity="error">{errors.global}</Alert>
                </Box>
            )}
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
                    type={showPassword ? 'text' : 'password'}
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
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        },
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
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
};

export default LoginPage;