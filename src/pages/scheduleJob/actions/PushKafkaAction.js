import React, { useState } from "react";
import { Typography, Box, Input, Textarea, Button, Grid } from "@mui/joy";
import PopupStack from "../../../components/PopupStack";
import { KafkaProducerRequest } from "karya-client/entities/actions.js";

function PushKafkaAction({ setAction, existingAction }) {
    const [topic, setTopic] = useState(existingAction == null ? "" : existingAction.topic);
    const [message, setMessage] = useState(existingAction == null ? "" : existingAction.message);
    const [producerKey, setProducerKey] = useState(existingAction == null ? "" : existingAction.key)
    const [popups, setPopups] = useState([]);

    const addPopup = (popupMessage, type) => {
        setPopups((prevPopups) => [...prevPopups, { message: popupMessage, type }]);
    };

    const removePopup = (index) => {
        setPopups((prevPopups) => prevPopups.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!topic || !message) {
            addPopup("Kafka topic and message cannot be empty.", "warning");
            return;
        }

        try {
            const kafkaAction = new KafkaProducerRequest(topic, message, producerKey);
            console.log("KafkaProducerRequest created:", kafkaAction);
            setAction(kafkaAction)

            addPopup("KafkaProducerRequest created successfully!", "success");
        } catch (error) {
            console.error("Error creating KafkaProducerRequest:", error);
            addPopup("Failed to create KafkaProducerRequest.", "warning");
        }
    };

    const handleClear = () => {
        setTopic("");
        setMessage("");
        setAction(null)
    };

    return (
        <Box>
            {/* Popup Stack */}
            <PopupStack popups={popups} onRemove={removePopup} />

            <Typography level="h6" sx={{ marginBottom: "16px" }}>
                Push a message to Kafka
            </Typography>

            {/* Kafka Topic Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12} sm={6}>
                    <Input
                        placeholder="Kafka Topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid xs={12} sm={6}>
                    <Input
                        placeholder="Producer Key (Optional)"
                        value={producerKey}
                        onChange={(e) => setProducerKey(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Kafka Message Input */}
            <Grid container spacing={2} sx={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                    <Textarea
                        placeholder="Kafka Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        minRows={4}
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

export default PushKafkaAction;
