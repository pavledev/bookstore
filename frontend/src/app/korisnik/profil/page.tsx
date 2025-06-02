'use client';

import { Box, Button, Container, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
    Edit,
    Email,
    LocationOn,
    Lock,
    Person,
    Phone,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading/Loading";
import SnackbarNotifier from "@/components/SnackbarNotifier/SnackbarNotifier";

const ProfilePage = () =>
{
    const api = useApi();
    const { isLoggedIn } = useAuth();

    const [userId, setUserId] = useState<number | null>(null);
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
    const [isInitalLoading, setIsInitialLoading] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    useEffect(() =>
    {
        const fetchProfileData = async () =>
        {
            try
            {
                const response = await api.get('/users/me');

                setUserId(response.data.userId);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setUsername(response.data.username);
                setPhoneNumber(response.data.phoneNumber);
                setCity(response.data.city);
                setStreetName(response.data.streetName);
                setStreetNumber(response.data.streetNumber);
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
                setIsInitialLoading(false);
            }
        };

        if (isLoggedIn)
        {
            fetchProfileData();
        }
    }, [isLoggedIn]);

    const handleSubmitProfile = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setIsProfileLoading(true);
        setErrors({});

        try
        {
            const response = await api.patch('/users/profile', {
                userId,
                firstName,
                lastName,
                email,
                username,
                phoneNumber,
                city,
                streetName,
                streetNumber
            });
            const { message } = response.data;

            showSnackbar(message, 'success');
        }
        catch (err: unknown)
        {
            if (axios.isAxiosError(err) && err.response?.data)
            {
                setErrors(err.response.data);
            }
            else
            {
                console.error('Greška prilikom ažuriranja profila:', err);

                showSnackbar('Došlo je do greške. Pokušajte ponovo.', 'error');
            }
        }
        finally
        {
            setIsProfileLoading(false);
        }
    };

    const handleSubmitPasswordChange = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setIsPasswordLoading(true);
        setErrors({});

        try
        {
            const response = await api.patch('/users/password', {
                userId,
                password,
                confirmPassword
            });
            const { message } = response.data;

            showSnackbar(message, 'success');
        }
        catch (err: unknown)
        {
            if (axios.isAxiosError(err) && err.response?.data)
            {
                setErrors(err.response.data);
            }
            else
            {
                console.error('Greška prilikom ažuriranja lozinke:', err);

                showSnackbar('Došlo je do greške. Pokušajte ponovo.', 'error');
            }
        }
        finally
        {
            setIsPasswordLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') =>
    {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    if (isInitalLoading)
    {
        return <Loading/>;
    }

    return (
        <>
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Moj profil
                </Typography>

                <Box component="form" onSubmit={handleSubmitProfile}>
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
                        startIcon={<Edit/>}
                        loading={isProfileLoading}
                        loadingPosition="start"
                    >
                        Sačuvaj izmene
                    </Button>
                </Box>

                <Box mt={3} py={6}>
                    <Box>
                        <Typography variant="h4" gutterBottom textAlign="center">
                            Promena lozinke
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmitPasswordChange}>
                        <TextField
                            fullWidth
                            label="Noval lozinka"
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
                                                    showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                                                }
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <TextField
                            fullWidth
                            label="Potvrda nove lozinke"
                            type={showConfirmPassword ? 'text' : 'password'}
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
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showConfirmPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                                                }
                                                onClick={handleClickShowConfirmPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            startIcon={<Edit/>}
                            loading={isPasswordLoading}
                            loadingPosition="start"
                        >
                            Sačuvaj lozinku
                        </Button>
                    </Box>
                </Box>
            </Container>

            <SnackbarNotifier
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </>
    );
};

export default ProfilePage;
