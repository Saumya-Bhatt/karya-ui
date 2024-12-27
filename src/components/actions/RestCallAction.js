import React, { useState } from "react";
import { Typography, Box, Input, Textarea, Select, Button, Grid, IconButton, Option } from "@mui/joy";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PopupStack from "../PopupStack";
import { RestApiRequest } from "karya-client/entities/actions.js";
import { Protocol, Method } from "karya-client/entities/constants.js";

function RestCallAction({ setAction, existingAction }) {
    const [baseUrl, setBaseUrl] = useState(existingAction == null ? "" : existingAction.base_url);
    const [bodyMessage, setBodyMessage] = useState(existingAction == null ? "" : existingAction.body);
    const [protocol, setProtocol] = useState(existingAction == null ? "" : existingAction.protocol);
    const [method, setMethod] = useState(existingAction == null ? "" : existingAction.method);
    const [headers, setHeaders] = useState(existingAction == null ? [{ key: "", value: "" }] : existingAction.headers);
    const [timeout, setApiTimeout] = useState(existingAction == null ? "" : existingAction.timeout);
    const [popups, setPopups] = useState([]);

    const handleAddHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const handleRemoveHeader = (index) => {
        const updatedHeaders = headers.filter((_, i) => i !== index);
        setHeaders(updatedHeaders);
    };

    const handleHeaderChange = (index, field, value) => {
        const updatedHeaders = headers.map((header, i) =>
            i === index ? { ...header, [field]: value } : header
        );
        setHeaders(updatedHeaders);
    };

    const addPopup = (message, type) => {
        setPopups((prevPopups) => [...prevPopups, { message, type }]);
    };

    const removePopup = (index) => {
        setPopups((prevPopups) => prevPopups.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!baseUrl || !protocol || !method) {
            addPopup("Base URL, Protocol, and Method cannot be empty.", "warning");
            return;
        }

        const headersObject = headers.reduce(
            (acc, { key, value }) => (key ? { ...acc, [key]: value } : acc),
            {}
        );

        try {
            const restAction = new RestApiRequest(
                baseUrl, // Base URL
                new RestApiRequest.JsonBody({ message: bodyMessage }), // JSON Body
                Protocol[protocol], // Protocol (HTTP/HTTPS)
                Method[method], // Method (GET/POST/PUT/DELETE)
                headersObject, // Headers
                parseInt(timeout, 10) || 0 // Timeout in milliseconds
            );

            console.log("RestApiRequest created:", restAction);
            setAction(restAction)
            addPopup("RestApiRequest created successfully!", "success");
        } catch (error) {
            console.error("Error creating RestApiRequest:", error);
            addPopup("Failed to create RestApiRequest.", "warning");
        }
    };

    const handleClear = () => {
        setBaseUrl("");
        setBodyMessage("");
        setProtocol("");
        setMethod("");
        setHeaders([{ key: "", value: "" }]);
        setApiTimeout("");
        setAction(null)
    };

    return (
        <Box>
            <PopupStack popups={popups} onRemove={removePopup} />

            {/* Protocol and Method on same line */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Select placeholder="Protocol" onChange={(event, value) => setProtocol(value)} fullWidth>
                        <Option value="HTTP">HTTP</Option>
                        <Option value="HTTPS">HTTPS</Option>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select placeholder="Method" onChange={(event, value) => setMethod(value)} fullWidth>
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </Grid>
            </Grid>

            {/* Base URL */}
            <Grid container spacing={2} sx={{ marginTop: "16px" }}>
                <Grid item xs={12}>
                    <Input
                        placeholder="Base URL"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* JSON Body as Textarea */}
            <Grid container spacing={2} sx={{ marginTop: "16px" }}>
                <Grid item xs={12}>
                    <Textarea
                        placeholder="JSON Body Message"
                        value={bodyMessage}
                        onChange={(e) => setBodyMessage(e.target.value)}
                        minRows={6}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Timeout */}
            <Grid container spacing={2} sx={{ marginTop: "16px" }}>
                <Grid item xs={12}>
                    <Input
                        placeholder="Timeout (ms)"
                        type="number"
                        value={timeout}
                        onChange={(e) => setApiTimeout(Number(e.target.value))}
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Headers */}
            <Box sx={{ marginBottom: "16px", marginTop: "16px" }}>
                <Typography level="body2" sx={{ marginBottom: "8px" }}>
                    HTTP Headers
                </Typography>
                {headers.map((header, index) => (
                    <Grid container spacing={2} key={index} sx={{ marginBottom: "8px" }}>
                        <Grid item xs={5}>
                            <Input
                                placeholder="Header Key"
                                value={header.key}
                                onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Input
                                placeholder="Header Value"
                                value={header.value}
                                onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={() => handleRemoveHeader(index)} color="danger">
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button onClick={handleAddHeader} startDecorator={<AddCircleOutlineIcon />} variant="soft">
                    Add Header
                </Button>
            </Box>

            {/* Buttons */}
            <Grid container justifyContent="space-even" spacing={2}>
                <Grid item>
                    <Button onClick={handleSubmit} variant="solid" color="primary" sx={{ marginTop: "16px" }}>
                        Save draft Action
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleClear} variant="solid" color="danger" sx={{ marginTop: "16px" }}>
                        Clear Inputs
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RestCallAction;
