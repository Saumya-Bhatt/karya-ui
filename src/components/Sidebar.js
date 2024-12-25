import React from "react";
import { Box, List, ListItem, ListItemButton, Link, Divider } from "@mui/joy";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const navLinkStyles = ({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "primary.700" : "neutral.900",
        backgroundColor: isActive ? "primary.softBg" : "transparent",
        fontWeight: isActive ? "bold" : "normal",
        borderRadius: "8px",
        padding: "8px 16px",
    });

    return (
        <Box
            sx={{
                width: "250px",
                backgroundColor: "neutral.softBg",
                padding: "16px",
                boxShadow: "sm",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // Space out the content
            }}
        >
            <List>
                <ListItem>
                    <NavLink to="/schedule" style={navLinkStyles}>
                        <ListItemButton>Schedule Job</ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to="/jobs" style={navLinkStyles}>
                        <ListItemButton>List all Jobs</ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem>
                    <NavLink to="/job-summary" style={navLinkStyles}>
                        <ListItemButton>Get Job Summary</ListItemButton>
                    </NavLink>
                </ListItem>

                <Divider sx={{ margin: "16px 0" }} />

                <ListItem>
                    <Link variant="soft" href="https://github.com/Saumya-Bhatt/karya" target="_blank" rel="noopener noreferrer">
                        <ListItemButton>About Karya</ListItemButton>
                    </Link>
                </ListItem>


            </List>
        </Box>
    );
}

export default Sidebar;
