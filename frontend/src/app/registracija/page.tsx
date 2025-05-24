'use client'

import { Box, Button, Container, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Email, LocationOn, Lock, Person, PersonAdd, Phone } from "@mui/icons-material";
import api from "@/utils/axios";
import axios from "axios";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function RegisterPage()
{
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState('');

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
            await api.post('/auth/register', {
                firstName,
                lastName,
                email,
                username,
                password,
                confirmPassword,
                phoneNumber,
                city,
                streetName,
                streetNumber
            });

            router.push('/prijava');
        }
        catch (err: unknown)
        {
            if (axios.isAxiosError(err) && err.response?.data)
            {
                setErrors(err.response.data);
            }
            else
            {
                setErrors({ global: 'Greška prilikom registracije.' });
            }
        }
        finally
        {
            setLoading(false);
        }
    };

    if (errors.global)
    {
        return <ErrorMessage message={errors.global}/>;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Registracija
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Ime"
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    fullWidth
                    label="Prezime"
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    fullWidth
                    label="Korisničko ime"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.username}
                    helperText={errors.username}
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
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <TextField
                    fullWidth
                    label="Potvrda lozinke"
                    type="password"
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />
                <TextField
                    fullWidth
                    label="Broj telefona"
                    margin="normal"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                />
                <TextField
                    fullWidth
                    label="Mesto"
                    margin="normal"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOn/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.city}
                    helperText={errors.city}
                />
                <TextField
                    fullWidth
                    label="Ulica"
                    margin="normal"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOn/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.streetName}
                    helperText={errors.streetName}
                />
                <TextField
                    fullWidth
                    label="Broj"
                    margin="normal"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOn/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    error={!!errors.streetNumber}
                    helperText={errors.streetNumber}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    startIcon={<PersonAdd/>}
                    loading={loading}
                    loadingPosition="start"
                >
                    Registruj se
                </Button>
            </Box>
        </Container>
    );
}
