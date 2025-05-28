'use client';

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {
    Assignment, BrightnessMedium,
    DarkMode,
    ExpandMore,
    LightMode,
    Logout,
    MenuBook,
    Person,
    ShoppingCart
} from '@mui/icons-material';
import { Badge, Divider, ListItemIcon, ListItemText, useColorScheme } from "@mui/material";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const AppHeader = () =>
{
    const [navMenuAnchorEl, setNavMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);

    const { mode, setMode } = useColorScheme();

    const { totalItems } = useCart();

    const router = useRouter();

    const { setAccessToken, isLoggedIn, setIsLoggedIn } = useAuth();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    {
        setNavMenuAnchorEl(event.currentTarget);
    };

    const handleOpenThemeMenu = (event: React.MouseEvent<HTMLElement>) =>
    {
        setThemeMenuAnchorEl(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleCloseNavMenu = () =>
    {
        setNavMenuAnchorEl(null);
    };

    const handleCloseThemeMenu = () =>
    {
        setThemeMenuAnchorEl(null);
    };

    const handleCloseUserMenu = () =>
    {
        setUserMenuAnchorEl(null);
    };

    const handleThemeChange = (value: 'light' | 'dark' | 'system') =>
    {
        setMode(value);
        handleCloseThemeMenu();
    };

    const handleLogout = async () =>
    {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok)
        {
            console.error('Greška prilikom odjave:', await response.text());
        }

        setIsLoggedIn(false);
        setAccessToken('');
        handleCloseUserMenu();
        router.push('/');
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MenuBook sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: 1
                        }}
                    >
                        Knjižara
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={navMenuAnchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(navMenuAnchorEl)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {!isLoggedIn && [
                                <MenuItem key="Prijava" component="a" href="/prijava" onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <Person/>
                                    </ListItemIcon>
                                    <ListItemText primary="Prijava"/>
                                </MenuItem>,
                                <Divider key="divider-1"/>,
                                <MenuItem key="Registracija" component="a" href="/registracija"
                                          onClick={handleCloseNavMenu}>
                                    <ListItemIcon>
                                        <Person/>
                                    </ListItemIcon>
                                    <ListItemText primary="Registracija"/>
                                </MenuItem>,
                                <Divider key="divider-2"/>
                            ]}
                            <MenuItem key="Korpa" component="a" href="/korpa" onClick={handleCloseNavMenu}>
                                <ListItemIcon>
                                    <ShoppingCart/>
                                </ListItemIcon>
                                <ListItemText primary="Korpa"/>
                            </MenuItem>
                            <Divider/>
                            <MenuItem key="Tema" onClick={handleOpenThemeMenu}>
                                <ListItemIcon>
                                    <LightMode/>
                                </ListItemIcon>
                                <ListItemText primary="Tema"/>
                            </MenuItem>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={themeMenuAnchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(themeMenuAnchorEl)}
                                onClose={handleCloseThemeMenu}
                            >
                                <MenuItem key="Sistemska" selected={mode === 'system'}
                                          onClick={() => handleThemeChange('system')}>
                                    <ListItemIcon>
                                        <BrightnessMedium/>
                                    </ListItemIcon>
                                    <ListItemText primary="Sistemska"/>
                                </MenuItem>
                                <Divider/>
                                <MenuItem key="Svetla" selected={mode === 'light'}
                                          onClick={() => handleThemeChange('light')}>
                                    <ListItemIcon>
                                        <LightMode/>
                                    </ListItemIcon>
                                    <ListItemText primary="Svetla"/>
                                </MenuItem>
                                <Divider/>
                                <MenuItem key="Tamna" selected={mode === 'dark'}
                                          onClick={() => handleThemeChange('dark')}>
                                    <ListItemIcon>
                                        <DarkMode/>
                                    </ListItemIcon>
                                    <ListItemText primary="Tamna"/>
                                </MenuItem>
                            </Menu>
                        </Menu>
                    </Box>
                    <MenuBook sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}/>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Knjižara
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {!isLoggedIn && (
                            <>
                                <Button
                                    key="Prijava"
                                    component="a"
                                    href="/prijava"
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white' }}
                                    startIcon={<Person/>}
                                >
                                    Prijava
                                </Button>
                                <Button
                                    key="Registracija"
                                    component="a"
                                    href="/registracija"
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white' }}
                                    startIcon={<Person/>}
                                >
                                    Registracija
                                </Button>
                            </>
                        )}
                        <Button
                            key="Korpa"
                            component="a"
                            href="/korpa"
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white' }}
                            startIcon={
                                <Box position="relative" width="24px" height="24px">
                                    <ShoppingCart/>
                                    {totalItems > 0 && (
                                        <Badge
                                            badgeContent={totalItems}
                                            color="primary"
                                            overlap="circular"
                                            sx={{
                                                position: 'absolute',
                                                top: -3,
                                                right: 1,
                                                '& .MuiBadge-badge': {
                                                    fontSize: '0.7rem',
                                                    height: 18,
                                                    minWidth: 18,
                                                    padding: '0 4px',
                                                },
                                            }}
                                        />
                                    )}
                                </Box>
                            }
                        >
                            Korpa
                        </Button>
                        <Button
                            key="Tema"
                            onClick={handleOpenThemeMenu}
                            sx={{ my: 2, color: 'white' }}
                            startIcon={<LightMode/>}
                            endIcon={<ExpandMore/>}
                        >
                            Tema
                        </Button>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={themeMenuAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(themeMenuAnchorEl)}
                            onClose={handleCloseThemeMenu}
                        >
                            <MenuItem key="Sistemska" selected={mode === 'system'}
                                      onClick={() => handleThemeChange('system')}>
                                <ListItemIcon>
                                    <BrightnessMedium/>
                                </ListItemIcon>
                                <ListItemText primary="Sistemska"/>
                            </MenuItem>
                            <Divider/>
                            <MenuItem key="Svetla" selected={mode === 'light'}
                                      onClick={() => handleThemeChange('light')}>
                                <ListItemIcon>
                                    <LightMode/>
                                </ListItemIcon>
                                <ListItemText primary="Svetla"/>
                            </MenuItem>
                            <Divider/>
                            <MenuItem key="Tamna" selected={mode === 'dark'} onClick={() => handleThemeChange('dark')}>
                                <ListItemIcon>
                                    <DarkMode/>
                                </ListItemIcon>
                                <ListItemText primary="Tamna"/>
                            </MenuItem>
                        </Menu>
                    </Box>
                    {isLoggedIn && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Button
                                key="Profil"
                                onClick={handleOpenUserMenu}
                                sx={{ my: 2, color: 'white' }}
                                startIcon={<Person/>}
                                endIcon={<ExpandMore/>}
                            >
                                Profil
                            </Button>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={userMenuAnchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(userMenuAnchorEl)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem key="Profil" onClick={handleCloseUserMenu}>
                                    <ListItemIcon>
                                        <Person/>
                                    </ListItemIcon>
                                    <ListItemText primary="Profil"/>
                                </MenuItem>
                                <Divider/>
                                <MenuItem key="Narudžbine" onClick={handleCloseUserMenu}>
                                    <ListItemIcon>
                                        <Assignment/>
                                    </ListItemIcon>
                                    <ListItemText primary="Narudžbine"/>
                                </MenuItem>
                                <Divider/>
                                <MenuItem key="Odjava" onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout/>
                                    </ListItemIcon>
                                    <ListItemText primary="Odjava"/>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppHeader;
