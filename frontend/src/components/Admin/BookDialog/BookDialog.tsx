'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Tabs, Tab, Box, Autocomplete, Typography
} from '@mui/material';
import Image from 'next/image';
import { Book } from '@/types/book';
import { CreateBookRequest } from '@/types/createBookRequest';
import { UpdateBookRequest } from '@/types/updateBookRequest';
import { Category } from '@/types/category';
import { Publisher } from '@/types/publisher';
import { Author } from '@/types/author';
import { Genre } from '@/types/genre';

interface BookDialogProps
{
    open: boolean;
    onCloseAction: () => void;
    onSaveAction: (book: CreateBookRequest | UpdateBookRequest, isEdit: boolean) => void;
    book?: Book | null;
    errors?: Record<string, string>;
    categories: Category[];
    publishers: Publisher[];
    authors: Author[];
    genres: Genre[];
}

const defaultData: CreateBookRequest = {
    category: null,
    publisher: null,
    title: '',
    mediumImagePath: '',
    largeImagePath: '',
    excerptPath: '',
    quantity: 1,
    description: '',
    publicationYear: '',
    importYear: '',
    binding: '',
    pageCount: 0,
    script: '',
    weight: '',
    unit: '',
    isbn: '',
    barCode: '',
    importCountry: '',
    ageGroup: '',
    format: '',
    price: 0,
    discountPrice: 0,
    authors: [],
    genres: []
};

export default function BookDialog(
    {
        open, onCloseAction, onSaveAction, book, errors = {},
        categories, publishers, authors, genres
    }: BookDialogProps)
{
    const isEdit = !!book;
    const [tab, setTab] = useState(0);
    const [formData, setFormData] = useState<CreateBookRequest>(defaultData);

    useEffect(() =>
    {
        if (book)
        {
            setFormData({
                category: book.category,
                publisher: book.publisher,
                title: book.title,
                mediumImagePath: `https://delfi.rs${book.mediumImagePath}`,
                largeImagePath: `https://delfi.rs${book.largeImagePath}`,
                excerptPath: book.excerptPath,
                quantity: book.quantity,
                description: book.description,
                publicationYear: book.publicationYear,
                importYear: book.importYear,
                binding: book.binding,
                pageCount: book.pageCount,
                script: book.script,
                weight: book.weight,
                unit: book.unit,
                isbn: book.isbn,
                barCode: book.barCode,
                importCountry: book.importCountry,
                ageGroup: book.ageGroup,
                format: book.format,
                price: book.price,
                discountPrice: book.discountPrice,
                authors: book.authors,
                genres: book.genres
            });

        }
        else
        {
            setFormData(defaultData);
        }
        setTab(0);
    }, [book]);

    const handleChange = (field: keyof CreateBookRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: typeof prev[field] === 'number' ? Number(value) : value
        }));
    };

    const handleSave = () =>
    {
        onSaveAction({ ...formData }, isEdit);
    };

    const renderImagePreview = (url: string, label: string) =>
        url ? (
            <Box my={1}>
                <Typography variant="subtitle2">{label}</Typography>
                <Box sx={{ width: 200, height: 300, borderRadius: 1, overflow: 'hidden', border: '1px solid #ccc' }}>
                    <Image src={url} alt={label} width={200} height={300} style={{ objectFit: 'cover' }}/>
                </Box>
            </Box>
        ) : null;

    return (
        <Dialog open={open} onClose={onCloseAction} maxWidth="md" fullWidth>
            <DialogTitle>{isEdit ? 'Izmeni knjigu' : 'Dodaj knjigu'}</DialogTitle>
            <DialogContent>
                <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
                    <Tab label="Osnovni podaci"/>
                    <Tab label="Slike"/>
                    <Tab label="Deklaracija"/>
                </Tabs>

                <Box mt={2}>
                    {tab === 0 && (
                        <>
                            <Autocomplete
                                fullWidth
                                options={categories}
                                getOptionLabel={(option) => option.name}
                                value={formData.category}
                                onChange={(_, value) => setFormData(prev => ({ ...prev, category: value! }))}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Kategorija"
                                        margin="normal"
                                        error={!!errors.category}
                                        helperText={errors.category}
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
                            />

                            <Autocomplete
                                fullWidth
                                options={publishers}
                                getOptionLabel={(option) => option.name}
                                value={formData.publisher}
                                onChange={(_, value) => setFormData(prev => ({ ...prev, publisher: value! }))}
                                renderInput={(params) => <TextField {...params} label="Izdavač" margin="normal"/>}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.publisherId}>
                                        {option.name}
                                    </li>
                                )}
                                isOptionEqualToValue={(option, value) => option.publisherId === value.publisherId}
                            />

                            <TextField fullWidth label="Naslov" margin="normal" value={formData.title}
                                       onChange={handleChange('title')} error={!!errors.title}
                                       helperText={errors.title}/>
                            <TextField fullWidth label="URL odlomka (PDF)" margin="normal"
                                       value={formData.excerptPath} onChange={handleChange('excerptPath')}/>
                            <TextField fullWidth type="number" label="Količina" margin="normal"
                                       value={formData.quantity ?? ''} onChange={handleChange('quantity')}/>
                            <TextField fullWidth multiline label="Opis" margin="normal" value={formData.description}
                                       onChange={handleChange('description')}/>
                            <TextField fullWidth type="number" label="Cena" margin="normal" value={formData.price ?? ''}
                                       onChange={handleChange('price')}/>
                            <TextField fullWidth type="number" label="Cena sa popustom" margin="normal"
                                       value={formData.discountPrice ?? ''} onChange={handleChange('discountPrice')}/>

                            <Autocomplete
                                multiple
                                options={authors}
                                getOptionLabel={(option) => option.fullName}
                                value={formData.authors}
                                onChange={(_, value) => setFormData(prev => ({ ...prev, authors: value }))}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Autori"
                                        margin="normal"
                                        error={!!errors.authors}
                                        helperText={errors.authors}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.authorId}>
                                        {option.fullName}
                                    </li>
                                )}
                                isOptionEqualToValue={(option, value) => option.authorId === value.authorId}
                            />

                            <Autocomplete
                                multiple
                                options={genres}
                                getOptionLabel={(option) => option.name}
                                value={formData.genres}
                                onChange={(_, value) => setFormData(prev => ({ ...prev, genres: value }))}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Žanrovi"
                                        margin="normal"
                                        error={!!errors.genres}
                                        helperText={errors.genres}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.genreId}>
                                        {option.name}
                                    </li>
                                )}
                                isOptionEqualToValue={(option, value) => option.genreId === value.genreId}
                            />
                        </>
                    )}

                    {tab === 1 && (
                        <>
                            <TextField
                                fullWidth
                                label="URL slike (srednja)" margin="normal"
                                value={formData.mediumImagePath}
                                onChange={handleChange('mediumImagePath')}
                                error={!!errors.mediumImagePath}
                                helperText={errors.mediumImagePath}
                            />

                            {renderImagePreview(formData.mediumImagePath, 'Srednja slika')}

                            <TextField
                                fullWidth
                                label="URL slike (velika)"
                                margin="normal"
                                value={formData.largeImagePath}
                                onChange={handleChange('largeImagePath')}
                                error={!!errors.largeImagePath}
                                helperText={errors.largeImagePath}
                            />

                            {renderImagePreview(formData.largeImagePath, 'Velika slika')}
                        </>
                    )}

                    {tab === 2 && (
                        <>
                            <TextField
                                fullWidth
                                type="number"
                                label="Godina izdanja"
                                margin="normal"
                                value={formData.publicationYear ?? ''}
                                onChange={handleChange('publicationYear')}
                            />

                            <TextField
                                fullWidth
                                type="number"
                                label="Godina uvoza"
                                margin="normal"
                                value={formData.importYear ?? ''}
                                onChange={handleChange('importYear')}
                            />

                            <TextField
                                fullWidth
                                label="Povez"
                                margin="normal"
                                value={formData.binding ?? ''}
                                onChange={handleChange('binding')}
                            />

                            <TextField
                                fullWidth
                                type="number"
                                label="Broj strana"
                                margin="normal"
                                value={formData.pageCount ?? ''}
                                onChange={handleChange('pageCount')}
                            />

                            <TextField
                                fullWidth
                                label="Pismo"
                                margin="normal"
                                value={formData.script ?? ''}
                                onChange={handleChange('script')}
                            />

                            <TextField
                                fullWidth
                                label="Težina"
                                margin="normal"
                                value={formData.weight ?? ''}
                                onChange={handleChange('weight')}
                            />

                            <TextField
                                fullWidth
                                label="Jedinica mere"
                                margin="normal"
                                value={formData.unit ?? ''}
                                onChange={handleChange('unit')}
                            />

                            <TextField
                                fullWidth
                                label="ISBN"
                                margin="normal"
                                value={formData.isbn ?? ''}
                                onChange={handleChange('isbn')}
                            />

                            <TextField
                                fullWidth
                                label="Barkod"
                                margin="normal"
                                value={formData.barCode ?? ''}
                                onChange={handleChange('barCode')}
                            />

                            <TextField
                                fullWidth
                                label="Zemlja uvoza"
                                margin="normal"
                                value={formData.importCountry ?? ''}
                                onChange={handleChange('importCountry')}
                            />

                            <TextField
                                fullWidth
                                label="Uzrast"
                                margin="normal"
                                value={formData.ageGroup ?? ''}
                                onChange={handleChange('ageGroup')}
                            />

                            <TextField
                                fullWidth
                                label="Format"
                                margin="normal"
                                value={formData.format ?? ''}
                                onChange={handleChange('format')}
                            />
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCloseAction}>Otkaži</Button>
                <Button variant="contained" onClick={handleSave}>Sačuvaj</Button>
            </DialogActions>
        </Dialog>
    );
}
