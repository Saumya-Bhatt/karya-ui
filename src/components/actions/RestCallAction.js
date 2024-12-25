import React, { useState } from "react";
import { RestApiRequest } from "karya-client/entities/actions.js";
import { Protocol, Method } from "karya-client/entities/constants.js";
import {
    Input,
    Typography,
    Box,
    Textarea,
    Select,
    MenuItem,
    Button,
    Grid,
    IconButton,
} from "@mui/joy";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function RestCallAction() {
    const [baseUrl, setBaseUrl] = useState();
    const [bodyMessage, setBodyMessage] = useState();
    const [protocol, setProtocol] = useState();
    const [method, setMethod] = useState();
    const [headers, setHeaders] = useState([]);
    const [timeout, setTimeout] = useState();

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

    const handleSubmit = () => {
        const headersObject = headers.reduce(
            (acc, { key, value }) => (key ? { ...acc, [key]: value } : acc),
            {}
        );

        const restAction = new RestApiRequest(
            baseUrl,
            new RestApiRequest.JsonBody({ message: bodyMessage }),
            protocol,
            method,
            headersObject,
            timeout
        );

        console.log("RestApiRequest created:", restAction);
        // Perform any further actions with restAction
    };

    const handleClear = () => {
        setBaseUrl("");
        setBodyMessage("");
        setProtocol("");
        setMethod("");
        setHeaders([{ key: "", value: "" }]);
        setTimeout("");
    };

    return (
        <Box>

            {/* Protocol and Method on same line */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Select
                        placeholder="Protocol"
                        value={protocol}
                        onChange={(event, value) => setProtocol(value)}
                        fullWidth
                    >
                        <MenuItem value="HTTP">HTTP</MenuItem>
                        <MenuItem value="HTTPS">HTTPS</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        placeholder="HTTP Method"
                        value={method}
                        onChange={(event, value) => setMethod(value)}
                        fullWidth
                    >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
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
                        onChange={(e) => setTimeout(Number(e.target.value))}
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
                                onChange={(e) =>
                                    handleHeaderChange(index, "key", e.target.value)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Input
                                placeholder="Header Value"
                                value={header.value}
                                onChange={(e) =>
                                    handleHeaderChange(index, "value", e.target.value)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                onClick={() => handleRemoveHeader(index)}
                                color="danger"
                            >
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button
                    onClick={handleAddHeader}
                    startDecorator={<AddCircleOutlineIcon />}
                    variant="soft"
                >
                    Add Header
                </Button>
            </Box>

            {/* Buttons */}
            <Grid container justifyContent="center" spacing={2}>
                <Grid item xs={6}>
                    <Button
                        onClick={handleSubmit}
                        variant="solid"
                        color="primary"
                        sx={{ marginTop: "16px" }}
                        fullWidth={false}
                    >
                        Create RestApiRequest
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        onClick={handleClear}
                        variant="solid"
                        color="danger"
                        sx={{ marginTop: "16px" }}
                        fullWidth={false}
                    >
                        Clear Inputs
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RestCallAction;
