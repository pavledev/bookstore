'use client';

import { Tabs, Tab, Box } from '@mui/material';
import React, { useState } from 'react';
import CustomTabPanel from "@/components/CustomTabPanel/CustomTabPanel";
import Users from "@/components/Admin/Users/Users";
import Books from "@/components/Admin/Books/Books";
import { Groups, LibraryBooks } from '@mui/icons-material';

const AdminPage = () =>
{
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) =>
    {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Korisnici" icon={<Groups/>} iconPosition="start"/>
                    <Tab label="Knjige" icon={<LibraryBooks/>} iconPosition="start"/>
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Users/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Books/>
            </CustomTabPanel>
        </>
    );
};

export default AdminPage;
