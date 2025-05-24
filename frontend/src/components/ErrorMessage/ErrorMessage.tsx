import { Box, Typography } from '@mui/material';
import React from 'react';

interface ErrorMessageProps
{
    message?: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) =>
{
    if (!message)
    {
        return null;
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="fixed"
            top="45%"
            left="50%"
        >
            <Typography variant="h5" gutterBottom>
                Došlo je do greške!
            </Typography>
            <Typography color="error">{message}</Typography>
        </Box>
    );
};

export default ErrorMessage;
