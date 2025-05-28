import { Box, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

interface QuantitySelectorProps
{
    value: number;
    min?: number;
    max?: number;
    onChange: (newValue: number) => void;
}

export default function QuantitySelector({
                                             value,
                                             min = 1,
                                             max = 99,
                                             onChange,
                                         }: QuantitySelectorProps)
{
    const handleDecrement = () =>
    {
        if (value > min) onChange(value - 1);
    };

    const handleIncrement = () =>
    {
        if (value < max) onChange(value + 1);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #889392"
            borderRadius={1}
            px={1.5}
            py={0.5}
            width="fit-content"
        >
            <IconButton size="small" onClick={handleDecrement} disabled={value <= min}>
                <RemoveIcon fontSize="small" color="primary"/>
            </IconButton>

            <Typography mx={2} fontSize="1.2rem">
                {value}
            </Typography>

            <IconButton size="small" onClick={handleIncrement} disabled={value >= max}>
                <AddIcon fontSize="small" color="primary"/>
            </IconButton>
        </Box>
    );
}
