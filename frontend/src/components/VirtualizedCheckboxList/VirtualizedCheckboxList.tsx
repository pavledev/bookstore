'use client';

import React, { memo, useState, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

interface Item
{
    id: number;
    label: string;
}

interface VirtualizedCheckboxListProps
{
    items: Item[];
    selected: number[];
    onToggle: (id: number) => void;
    height?: number;
}

const ITEM_HEIGHT = 40;

const Row = memo(({ index, style, data }: ListChildComponentProps) =>
{
    const { items, selected, onToggle } = data;
    const item = items[index];

    return (
        <div style={style} key={item.id}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selected.includes(item.id)}
                        onChange={() => onToggle(item.id)}
                    />
                }
                label={item.label}
            />
        </div>
    );
});

Row.displayName = 'VirtualizedCheckboxRow';

const VirtualizedCheckboxList = (
    {
        items,
        selected,
        onToggle,
        height = 300,
    }: VirtualizedCheckboxListProps) =>
{
    const [search, setSearch] = useState('');

    const filteredItems = useMemo(() =>
    {
        const lower = search.toLowerCase();
        return items.filter(item => item.label.toLowerCase().includes(lower));
    }, [search, items]);

    return (
        <div>
            <TextField
                size="small"
                fullWidth
                placeholder="Pretraži..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 1 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <FixedSizeList
                height={height}
                width="100%"
                itemSize={ITEM_HEIGHT}
                itemCount={filteredItems.length}
                itemData={{ items: filteredItems, selected, onToggle }}
            >
                {Row}
            </FixedSizeList>
        </div>
    );
};

export default VirtualizedCheckboxList;