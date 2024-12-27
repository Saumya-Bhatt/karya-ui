import React, { useState } from "react";
import { Typography, Box, Input, Textarea, Button, Grid } from "@mui/joy";
import PopupStack from "../PopupStack";
import { SlackMessageRequest } from "karya-client/entities/actions.js";

function SlackMessageAction({ setAction, existingAction }) {
    const [channel, setChannel] = useState(existingAction == null ? "" : existingAction.channel);
    const [message, setMessage] = useState(existingAction == null ? "" : existingAction.message);
    const [popups, setPopups] = useState([]);

    const addPopup = (message, type) => {
        setPopups((prevPopups) => [...prevPopups, { message, type }]);
    };

    const removePopup = (index) => {
        setPopups((prevPopups) => prevPopups.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!channel || !message) {
            addPopup("Channel and message cannot be empty.", "warning");
            return;
        }

        try {
            const slackAction = new SlackMessageRequest(channel, message);
            console.log("SlackMessage created:", slackAction);
            setAction(slackAction)
            addPopup("SlackMessage created successfully!", "success");
        } catch (error) {
            console.error("Error creating SlackMessage:", error);
            addPopup("Failed to create SlackMessage.", "warning");
        }
    };

    const handleClear = () => {
        setChannel("");
        setMessage("");
        setAction(null)
    };

    return (
        <Box>
            {/* Popup Stack */}
            <PopupStack popups={popups} onRemove={removePopup} />

            <Typography level="h6" sx={{ marginBottom: "16px" }}>
                Send a Message to Slack
            </Typography>

            {/* Slack Channel Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                    <Input
                        placeholder="Slack Channel"
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Slack Message Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                    <Textarea
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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

export default SlackMessageAction;
