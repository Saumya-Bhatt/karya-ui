import React, { useState } from "react";
import { Typography, Box, Input, Button, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Grid } from "@mui/joy";
import PopupStack from "../components/PopupStack";

function PlanSummary({ client }) {
    const [planId, setPlanId] = useState("");
    const [summary, setSummary] = useState(null);
    const [popups, setPopups] = useState([]);

    const addPopup = (message, type) => {
        setPopups((prev) => [...prev, { message, type }]);
    };

    const removePopup = (index) => {
        setPopups((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFetchSummary = async () => {
        if (!planId.trim()) {
            addPopup("Please pass a valid PlanId to fetch the summary of", "warning")
            return;
        }

        try {
            const response = await client.getSummary(planId.trim());
            console.log(response)
            setSummary(response);
        } catch (error) {
            console.error("Failed to fetch plan summary", error);
            alert("An error occurred while fetching the plan summary. Please try again.");
        }
    };

    return (
        <Box>
            <PopupStack popups={popups} onRemove={removePopup} />

            <Typography level="h3">Plan Summary</Typography>
            <p>Enter the ID of the plan of which you want a summary of.</p>

            <Input
                sx={{ "--Input-decoratorChildHeight": "45px", width: "50%" }}
                placeholder="Enter Plan Id"
                required
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                endDecorator={
                    <Button
                        variant="solid"
                        color="primary"
                        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        onClick={handleFetchSummary}
                    >
                        Fetch Plan Summary
                    </Button>
                }
            />

            <br />
            {summary && (
                <Grid
                    container
                    spacing={3}
                >
                    {/* First Column: Plan Details */}
                    <Grid item sm={4}>
                        <Typography level="h4">Plan Details</Typography>
                        <Typography level="body-sm">Metadata, actions and hooks configured</Typography>
                        <Box mt={2} sx={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                            <Typography level="body-sm">Plan ID: {summary.plan.id}</Typography>
                            <Typography level="body-sm">Description: {summary.plan.description}</Typography>
                            <Typography level="body-sm">Status: {summary.plan.status}</Typography>
                            <Typography level="body-sm">Period Time: {summary.plan.period_time}</Typography>
                            <Typography level="body-sm">Max Failure Retry: {summary.plan.max_failure_retry}</Typography>
                            <Typography level="body-sm">Created At: {new Date(summary.plan.created_at).toLocaleString()}</Typography>
                            <Typography level="body-sm">Total tasks: {summary.plan.hook.length}</Typography>

                            {/* Accordion for Action and Hook */}
                            <Accordion sx={{ mt: 2 }}>
                                <AccordionSummary>
                                    <Typography>Action</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                        {JSON.stringify(summary.plan.action, null, 2)}
                                    </pre>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ mt: 2 }}>
                                <AccordionSummary>
                                    <Typography>Hooks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{
                                        maxHeight: "200px",
                                        overflowY: "auto"
                                    }}>

                                        {summary.plan.hook.length > 0 ? (summary.plan.hook.map((hook, index) => (
                                            <Card variant="soft" key={index} sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                        {JSON.stringify(hook, null, 2)}
                                                    </pre>
                                                </CardContent>
                                            </Card>
                                        ))) : (<Typography>No tasks available</Typography>)}
                                    </Box>

                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Grid>

                    {/* Second Column: Tasks */}
                    <Grid item sm={4}>
                        <Typography level="h4">Tasks</Typography>
                        <Typography level="body-sm">All the tasks into which the plan was broken down into</Typography>
                        <Box
                            mt={2}
                            sx={{
                                maxHeight: "400px",
                                overflowY: "auto",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                            }}
                        >
                            {summary.tasks.length > 0 ? (
                                summary.tasks.map((task, index) => (
                                    <Card key={index} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                {JSON.stringify(task, null, 2)}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography>No tasks available</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Third Column: Error Logs */}
                    <Grid item sm={4}>
                        <Typography level="h4">Error Logs</Typography>
                        <Typography level="body-sm">Logs of errors that occured during execution of task/hook.</Typography>
                        <Box
                            mt={2}
                            sx={{
                                maxHeight: "400px",
                                overflowY: "auto",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                            }}
                        >
                            {summary.errorLogs.length > 0 ? (
                                summary.errorLogs.map((log, index) => (
                                    <Card key={index} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                {JSON.stringify(log, null, 2)}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography>No error logs available</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}

export default PlanSummary;
