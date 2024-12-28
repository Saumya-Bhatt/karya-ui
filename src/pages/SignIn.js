import React, { useState } from "react";
import { Box, Button, Input, Typography } from "@mui/joy";
import { CreateUserRequest } from 'karya-client/client/requests'
import PopupStack from "../components/PopupStack";


function SignIn({ client, setUser }) {
    const [username, setUsername] = useState("");
    const [popups, setPopups] = useState([]);

    const addPopup = (message, type) => {
        setPopups((prev) => [...prev, { message, type }]);
    };

    const removePopup = (index) => {
        setPopups((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSignIn = async () => {
        if (username.trim()) {
            let user;
            try {
                user = await client.getUser(username.trim());
            } catch (error) {
                console.log("User does not exist. Creating a new one");
                try {
                    user = await client.createUser(new CreateUserRequest(username.trim()));
                } catch (error) {
                    addPopup("Unable to connect to client: ", error)
                    return
                }

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
            <PopupStack popups={popups} onRemove={removePopup} />
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
