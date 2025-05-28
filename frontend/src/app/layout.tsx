import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import "./globals.css";
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import React from "react";
import { Box } from '@mui/material';
import { CartProvider } from "@/context/CartContext";
import AppHeader from "@/components/AppHeader/AppHeader";
import { AuthProvider } from "@/context/AuthContext";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) =>
{
    return (
        <html lang="en" className={roboto.variable}>
        <body>
        <AppRouterCacheProvider>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <CartProvider>
                        <Box
                            sx={{
                                backgroundColor: 'background.default',
                                color: 'text.primary',
                                minHeight: '100vh'
                            }}
                        >
                            <AppHeader/>
                            {children}
                        </Box>
                    </CartProvider>
                </ThemeProvider>
            </AuthProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
};

export default RootLayout;