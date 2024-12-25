import React, { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/joy";

function SignIn({ setUser }) {
    const [username, setUsername] = useState("");

    const handleSignIn = () => {
        if (username.trim()) {
            setUser(username.trim());
        } else {
            alert("Please enter a valid username.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "16px",
            }}
        >
            <Typography level="h2">Create plans as user</Typography>
            <Typography level="body-sm">Or login as an existing user</Typography>
            <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ width: "300px", fontSize: "1rem" }}
            />
            <Button variant="solid" color="primary" onClick={handleSignIn}>
                Sign In
            </Button>
        </Box>
    );
}

export default SignIn;
