import React from "react";
import { Box } from "@mui/material";

interface TabPanelProps
{
    children?: React.ReactNode;
    index: number;
    value: number;
}

const CustomTabPanel = (props: TabPanelProps) =>
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
};

export default CustomTabPanel;
