import React, { useState } from "react";
import { Typography, Box, Input, Textarea, Button, Grid } from "@mui/joy";
import PopupStack from "../PopupStack";
import { EmailRequest } from "karya-client/entities/actions.js";

function SendEmailAction({ setAction, existingAction }) {
    const [recipient, setRecipient] = useState(existingAction == null ? "" : existingAction.recipient);
    const [subject, setSubject] = useState(existingAction == null ? "" : existingAction.subject);
    const [body, setBody] = useState(existingAction == null ? "" : existingAction);
    const [popups, setPopups] = useState([]);

    const addPopup = (message, type) => {
        setPopups((prevPopups) => [...prevPopups, { message, type }]);
    };

    const removePopup = (index) => {
        setPopups((prevPopups) => prevPopups.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!recipient || !subject || !body) {
            addPopup("Recipient, subject, and body cannot be empty.", "warning");
            return;
        }

        try {
            const emailAction = new EmailRequest(recipient, subject, body);
            console.log("EmailRequest created:", emailAction);
            setAction(emailAction)
            addPopup("EmailRequest created successfully!", "success");
        } catch (error) {
            console.error("Error creating EmailRequest:", error);
            addPopup("Failed to create EmailRequest.", "warning");
        }
    };

    const handleClear = () => {
        setRecipient("");
        setSubject("");
        setBody("");
        setAction(null)
    };

    return (
        <Box>
            {/* Popup Stack */}
            <PopupStack popups={popups} onRemove={removePopup} />

            <Typography level="h6" sx={{ marginBottom: "16px" }}>
                Send an Email
            </Typography>

            {/* Recipient Email Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                    <Input
                        placeholder="Recipient Email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Email Subject Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                    <Input
                        placeholder="Email Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Email Body Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                    <Textarea
                        placeholder="Email Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        minRows={6}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Buttons */}
            <Grid container justifyContent="space-even" spacing={2}>
                <Grid item>
                    <Button onClick={handleSubmit} variant="solid" color="primary">
                        Save draft Action
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleClear} variant="solid" color="danger">
                        Clear Inputs
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SendEmailAction;
