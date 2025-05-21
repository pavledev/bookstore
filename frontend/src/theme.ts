'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
    typography: {
        fontFamily: 'var(--font-roboto)',
        button: {
            textTransform: 'none'
        }
    }
});

export default theme;
