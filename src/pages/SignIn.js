import React, { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/joy";
import { CreateUserRequest } from 'karya-client/client/requests'

function SignIn({ client, setUser }) {
    const [username, setUsername] = useState("");

    const handleSignIn = async () => {
        if (username.trim()) {
            let user;
            try {
                user = await client.getUser(username.trim());
            } catch (error) {
                console.log("User does not exist. Creating a new one");
                user = await client.createUser(new CreateUserRequest(username.trim()));
            }

            console.log(user); // This will now log the resolved user object
            setUser(user); // Set the user after it's resolved
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
