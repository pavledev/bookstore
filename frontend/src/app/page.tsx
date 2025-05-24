'use client'

import AppHeader from '@/components/AppHeader/AppHeader';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import Books from "@/components/Books/Books";

interface TabPanelProps
{
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps)
{
    const { children, value, index, ...other } = props;

    return (
        <div
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const HomePage = () =>
{
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) =>
    {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Domaće knjige"/>
                    <Tab label="Strane knjige"/>
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Books categoryId={1}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Books categoryId={2}/>
            </CustomTabPanel>
        </>
    );
};

export default HomePage;