import React from "react";
import { Box, Typography, Button } from "@mui/joy";

function Navbar({ user, onSignOut }) {
    const { name, version } = require("../../package.json"); // Importing package.json content

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                backgroundColor: "primary.700", // Different color for Navbar
                color: "white", // Ensure text color is white
                boxShadow: "sm",
            }}
        >
            <Box>
                <Typography level="h4" sx={{ color: "white" }}>{name} v{version}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Typography level="body1">
                    Scheduling jobs as user: <span style={{ fontWeight: "bold", color: "primary.200", fontStyle: "italic" }}>{user}</span>
                </Typography>
                <Button variant="soft" color="primary" onClick={onSignOut}>
                    Sign Out
                </Button>
            </Box>
        </Box>
    );
}

export default Navbar;
