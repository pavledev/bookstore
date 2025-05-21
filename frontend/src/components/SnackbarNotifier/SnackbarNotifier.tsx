import { Snackbar, Alert } from '@mui/material';

interface SnackbarNotifierProps
{
    open: boolean;
    message: string;
    severity?: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

export default function SnackbarNotifier({
                                             open,
                                             message,
                                             severity = 'success',
                                             onClose,
                                         }: SnackbarNotifierProps)
{
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
