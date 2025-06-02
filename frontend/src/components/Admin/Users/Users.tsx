'use client';

import React, { useEffect, useState } from 'react';
import {
    DataGrid,
    GridColDef,
    GridPaginationModel
} from '@mui/x-data-grid';
import {
    Container,
    IconButton,
    TextField,
    Tooltip,
    Box,
    Button, InputAdornment
} from '@mui/material';
import { Edit, Delete, PersonAdd, Search } from '@mui/icons-material';
import useApi from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import UserDialog from "@/components/Admin/UserDialog/UserDialog";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import SnackbarNotifier from "@/components/SnackbarNotifier/SnackbarNotifier";
import Loading from "@/components/Loading/Loading";
import axios from "axios";
import { User } from "@/types/user";
import { AdminCreateUserRequest } from "@/types/adminCreateUserRequest";
import { AdminUpdateProfileRequest } from "@/types/adminUpdateProfileRequest";
import { UpdatePasswordRequest } from "@/types/updatePasswordRequest";
import { Role } from "@/types/role";

const Users = () =>
{
    const api = useApi();
    const { isLoggedIn } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const fetchUsers = async () =>
    {
        try
        {
            setIsLoading(true);

            const response = await api.post('/users/filter', {
                query: searchQuery,
                page: paginationModel.page + 1,
                perPage: paginationModel.pageSize,
            });

            setUsers(response.data.content);
            setTotal(response.data.totalElements);
        }
        catch (error)
        {
            console.error('Greška prilikom učitavanja korisnika:', error);
        }
        finally
        {
            setIsLoading(false);
        }
    };

    useEffect(() =>
    {
        if (isLoggedIn)
        {
            fetchUsers();
        }
    }, [isLoggedIn, paginationModel, searchQuery]);

    const handleAddClick = () =>
    {
        setSelectedUser(null);
        setFormErrors({});
        setUserDialogOpen(true);
    };

    const handleEditClick = (user: User) =>
    {
        setSelectedUser(user);
        setFormErrors({});
        setUserDialogOpen(true);
    };

    const handleDelete = async () =>
    {
        if (!userToDelete)
        {
            return;
        }

        try
        {
            const response = await api.delete(`/users/${userToDelete.userId}`);
            const { message } = response.data;

            showSnackbar(message, 'success');
            setUserToDelete(null);
            fetchUsers();
        }
        catch (error: unknown)
        {
            showSnackbar('Greška prilikom brisanja korisnika', 'error');

            console.error('Greška prilikom brisanja korisnika:', error);
        }
    };

    const handleSaveUser = async (userData: AdminCreateUserRequest | AdminUpdateProfileRequest, isEdit: boolean) =>
    {
        try
        {
            setFormErrors({});

            let response;

            if (isEdit)
            {
                response = await api.patch(`/users/${selectedUser!.userId}/profile`, userData);
            }
            else
            {
                response = await api.post('/users', userData);
            }

            const { message } = response.data;

            showSnackbar(message, 'success');

            setUserDialogOpen(false);
            fetchUsers();
        }
        catch (error: unknown)
        {
            if (axios.isAxiosError(error) && error.response?.data)
            {
                setFormErrors(error.response.data);
            }
            else
            {
                showSnackbar('Greška prilikom čuvanja korisnika', 'error');
            }
        }
    };

    const handleChangePassword = async ({ password, confirmPassword }: UpdatePasswordRequest) =>
    {
        if (!selectedUser)
        {
            return;
        }

        try
        {
            const response = await api.patch(`/users/${selectedUser.userId}/password`, {
                password,
                confirmPassword
            });
            const { message } = response.data;

            showSnackbar(message, 'success');
            setUserDialogOpen(false);
        }
        catch (error: unknown)
        {
            if (axios.isAxiosError(error) && error.response?.data)
            {
                setFormErrors(error.response.data);
            }
            else
            {
                showSnackbar('Greška prilikom promene lozinke', 'error');
            }
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') =>
    {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const columns: GridColDef[] = [
        { field: 'userId', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Korisničko ime', width: 150 },
        {
            field: 'fullName',
            headerName: 'Ime i prezime',
            width: 180,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phoneNumber', headerName: 'Telefon', width: 150 },
        {
            field: 'city',
            headerName: 'Adresa',
            width: 200,
            valueGetter: (value, row) =>
                `${row.streetName || ''} ${row.streetNumber || ''}, ${row.city || ''}`
        },
        {
            field: 'admin',
            headerName: 'Uloga',
            width: 130,
            valueFormatter: (value, row) =>
            {
                const isAdmin = row.roles.some((role: Role) => role.name === 'ROLE_ADMIN');

                return isAdmin ? 'Administrator' : 'Korisnik';
            }
        },
        {
            field: 'actions',
            headerName: 'Akcije',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <>
                    <Tooltip title="Izmeni">
                        <IconButton onClick={() => handleEditClick(params.row)} size="small" color="primary">
                            <Edit fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Obriši">
                        <IconButton onClick={() => setUserToDelete(params.row)} size="small" color="error">
                            <Delete fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </>
            )
        }
    ];

    if (!isLoggedIn)
    {
        return <Loading/>;
    }

    return (
        <Container maxWidth="xl">
            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                <TextField
                    label="Pretraga korisnika"
                    placeholder="Pretraži prema korisnikom imenu, email adresi, imenu ili prezimenu"
                    value={searchQuery}
                    onChange={(e) =>
                    {
                        setSearchQuery(e.target.value);
                        setPaginationModel({ ...paginationModel, page: 0 });
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ width: '40%' }}
                />

                <Button variant="contained" onClick={handleAddClick} startIcon={<PersonAdd/>}>
                    Dodaj korisnika
                </Button>
            </Box>

            <DataGrid
                rows={users}
                rowCount={total}
                columns={columns}
                getRowId={(row) => row.userId}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
                paginationMode="server"
                loading={isLoading}
                checkboxSelection
                disableRowSelectionOnClick
                localeText={{
                    paginationRowsPerPage: 'Redova po stranici:',
                    paginationDisplayedRows: ({ from, to, count, estimated }) =>
                    {
                        if (!estimated)
                        {
                            return `${from}–${to} od ${count !== -1 ? count : `više nego ${to}`}`;
                        }

                        const estimatedLabel = estimated && estimated > to ? `oko ${estimated}` : `više nego ${to}`;

                        return `${from}–${to} od ${count !== -1 ? count : estimatedLabel}`;
                    }
                }}
                sx={{ border: 0 }}
            />

            <UserDialog
                open={userDialogOpen}
                onClose={() => setUserDialogOpen(false)}
                onSave={handleSaveUser}
                onChangePassword={handleChangePassword}
                user={selectedUser}
                errors={formErrors}
            />

            <DeleteConfirmationDialog
                open={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDelete}
                title="Brisanje korisnika"
                description={`Da li ste sigurni da želite da obrišete korisnika "${userToDelete?.username}"?`}
            />

            <SnackbarNotifier
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </Container>
    );
}

export default Users;
