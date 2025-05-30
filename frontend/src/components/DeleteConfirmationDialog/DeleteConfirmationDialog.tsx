import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

interface DeleteConfirmationDialogProps
{
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = (
    {
        open,
        onClose,
        onConfirm,
        title = 'Potvrda brisanja',
        description = 'Da li ste sigurni da želite da obrišete ovu stavku? Ova akcija je nepovratna.'
    }) =>
{
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Otkaži</Button>
                <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
                    Obriši
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
