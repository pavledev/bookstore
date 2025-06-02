import { Email, LocationOn, Lock, Person, Phone, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Tabs,
    Tab,
    Checkbox,
    FormControlLabel,
    InputAdornment
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import IconButton from "@mui/material/IconButton";
import { AdminCreateUserRequest } from "@/types/adminCreateUserRequest";
import { AdminUpdateProfileRequest } from "@/types/adminUpdateProfileRequest";
import { UpdatePasswordRequest } from "@/types/updatePasswordRequest";
import { Role } from "@/types/role";
import { User } from "@/types/user";

interface UserDialogProps
{
    open: boolean;
    onClose: () => void;
    onSave: (user: AdminCreateUserRequest | AdminUpdateProfileRequest, isEdit: boolean) => void;
    onChangePassword: (data: UpdatePasswordRequest) => void;
    user?: User | null;
    errors?: Record<string, string>;
}

export default function UserDialog(
    {
        open,
        onClose,
        onSave,
        onChangePassword,
        user,
        errors = {}
    }: UserDialogProps)
{
    const [tab, setTab] = useState(0);
    const isEdit = !!user;
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', username: '',
        password: '', confirmPassword: '', phoneNumber: '',
        city: '', streetName: '', streetNumber: '', isAdmin: false
    });

    const [passwordData, setPasswordData] = useState<UpdatePasswordRequest>({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() =>
    {
        if (user)
        {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                phoneNumber: user.phoneNumber,
                city: user.city,
                streetName: user.streetName,
                streetNumber: user.streetNumber,
                isAdmin: user.roles?.some((role: Role) => role.name === 'ROLE_ADMIN') || false,
                password: '',
                confirmPassword: ''
            });
        }
        else
        {
            setFormData({
                firstName: '', lastName: '', email: '', username: '',
                password: '', confirmPassword: '', phoneNumber: '',
                city: '', streetName: '', streetNumber: '', isAdmin: false
            });
        }

        setPasswordData({ password: '', confirmPassword: '' });
        setTab(0);
    }, [user]);

    const handleChange = (field: keyof AdminCreateUserRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handlePasswordChange = (field: keyof UpdatePasswordRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = () =>
    {
        if (isEdit)
        {
            const updatedUser: AdminUpdateProfileRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                username: formData.username,
                phoneNumber: formData.phoneNumber,
                city: formData.city,
                streetName: formData.streetName,
                streetNumber: formData.streetNumber,
                isAdmin: formData.isAdmin
            };
            onSave(updatedUser, isEdit);
        }
        else
        {
            const newUser: AdminCreateUserRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phoneNumber: formData.phoneNumber,
                city: formData.city,
                streetName: formData.streetName,
                streetNumber: formData.streetNumber,
                isAdmin: formData.isAdmin
            };
            onSave(newUser, isEdit);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? 'Izmeni korisnika' : 'Dodaj korisnika'}</DialogTitle>
            <DialogContent>
                {isEdit && (
                    <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
                        <Tab label="Profil"/>
                        <Tab label="Lozinka"/>
                    </Tabs>
                )}

                {(tab === 0 || !isEdit) && (
                    <>
                        {[
                            { label: 'Ime', field: 'firstName', icon: <Person/> },
                            { label: 'Prezime', field: 'lastName', icon: <Person/> },
                            { label: 'Email', field: 'email', icon: <Email/> },
                            { label: 'Korisničko ime', field: 'username', icon: <Person/> },
                            { label: 'Telefon', field: 'phoneNumber', icon: <Phone/> },
                            { label: 'Grad', field: 'city', icon: <LocationOn/> },
                            { label: 'Ulica', field: 'streetName', icon: <LocationOn/> },
                            { label: 'Broj', field: 'streetNumber', icon: <LocationOn/> }
                        ].map(({ label, field, icon }) => (
                            <TextField
                                key={field}
                                fullWidth
                                label={label}
                                margin="normal"
                                value={formData[field as keyof AdminCreateUserRequest] || ''}
                                onChange={handleChange(field as keyof AdminCreateUserRequest)}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
                                    }
                                }}
                                error={!!errors[field]}
                                helperText={errors[field]}
                            />
                        ))}

                        {!isEdit && (
                            <>
                                {['password', 'confirmPassword'].map((field) => (
                                    <TextField
                                        key={field}
                                        fullWidth
                                        type={(field === 'password' ? showPassword : showConfirmPassword) ? 'text' : 'password'}
                                        label={field === 'password' ? 'Lozinka' : 'Potvrda lozinke'}
                                        margin="normal"
                                        value={formData[field as 'password' | 'confirmPassword']}
                                        onChange={handleChange(field as keyof AdminCreateUserRequest)}
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
                                                            onClick={() =>
                                                                field === 'password'
                                                                    ? setShowPassword(prev => !prev)
                                                                    : setShowConfirmPassword(prev => !prev)
                                                            }
                                                        >
                                                            {((field === 'password' ? showPassword : showConfirmPassword)) ?
                                                                <Visibility/> : <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                        error={!!errors[field]}
                                        helperText={errors[field]}
                                    />
                                ))}
                            </>
                        )}

                        <FormControlLabel
                            control={<Checkbox checked={formData.isAdmin} onChange={e => setFormData(prev => ({
                                ...prev,
                                isAdmin: e.target.checked
                            }))}/>}
                            label="Administrator"
                        />
                    </>
                )}

                {tab === 1 && isEdit && (
                    <>
                        {['password', 'confirmPassword'].map((field) => (
                            <TextField
                                key={field}
                                fullWidth
                                type={(field === 'password' ? showPassword : showConfirmPassword) ? 'text' : 'password'}
                                label={field === 'password' ? 'Nova lozinka' : 'Potvrda lozinke'}
                                margin="normal"
                                value={passwordData[field as 'password' | 'confirmPassword']}
                                onChange={handlePasswordChange(field as keyof UpdatePasswordRequest)}
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
                                                    onClick={() =>
                                                        field === 'password'
                                                            ? setShowPassword(prev => !prev)
                                                            : setShowConfirmPassword(prev => !prev)
                                                    }
                                                >
                                                    {((field === 'password' ? showPassword : showConfirmPassword)) ?
                                                        <Visibility/> : <VisibilityOff/>}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                error={!!errors[field]}
                                helperText={errors[field]}
                            />
                        ))}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Otkaži</Button>
                {isEdit && tab === 1 ? (
                    <Button variant="contained" onClick={() => onChangePassword(passwordData)}>Promeni lozinku</Button>
                ) : (
                    <Button variant="contained" onClick={handleSave}>Sačuvaj</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
