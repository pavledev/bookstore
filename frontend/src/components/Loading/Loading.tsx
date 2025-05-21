import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () =>
{
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="fixed"
            top="45%"
            left="50%"
        >
            <CircularProgress size="4rem"/>
            <Typography mt={2} fontWeight={500}>
                Učitavanje...
            </Typography>
        </Box>
    );
};

export default Loading;
