import React, { useState } from "react";
import { Box, Typography, Grid, Card, Divider, Button } from "@mui/joy";
import { SubmitPlanRequest } from 'karya-client/client/requests.js';
import PopupStack from "../../../components/PopupStack";


function SubmitPlan({ client, user, action, draftPlan, setAction, setDraftPlan }) {

    const [popups, setPopups] = useState([]);
    const addPopup = (popupMessage, type) => {
        setPopups((prevPopups) => [...prevPopups, { message: popupMessage, type }]);
    };
    const removePopup = (index) => {
        setPopups((prevPopups) => prevPopups.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!user || user == null) {
            addPopup("Only a user registered with Karya can submit plan", "warning")
            return;
        }
        if (!action || action == null) {
            addPopup("Define an action before submitting a plan", "warning")
            return;
        }
        if (!draftPlan || draftPlan == null) {
            addPopup("Specify a draft before submitting a plan", "warning")
            return;
        }

        try {
            const request = new SubmitPlanRequest(
                user.id,
                draftPlan.description,
                draftPlan.period_time,
                draftPlan.plan_type,
                action,
                draftPlan.hooks,
                draftPlan.max_failure_retry
            )
            console.log("Submitting Plan Request: ", request)
            const plan = await client.submitPlan(request)
            console.log("Plan created successfully:", plan)
            addPopup("Plan submitted to Karya successfully!", "success")
        } catch (error) {
            console.log("Error creating SubmitPlanRequest", error)
            addPopup(`Error submitting plan to Karya: ${error}`, "warning")
        }
    }

    const handleClear = () => {
        setAction(null);
        setDraftPlan(null);
    };

    return (
        <Box>

            {/* Popup Stack */}
            <PopupStack popups={popups} onRemove={removePopup} />

            <Typography level="h3" sx={{ marginTop: "16px" }}>
                Review Plan
            </Typography>

            <br />

            <Grid container justifyContent="space-even" spacing={2}>
                <Grid item>
                    <Card>
                        <Typography level="title-lg">Action:</Typography>
                        <Typography>If you wish to make changes to this, go back to <b>Step 1</b></Typography>
                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(action, null, 2)}
                        </pre>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <Typography level="title-lg">Draft Plan:</Typography>
                        <Typography>If you wish to make changes to this, go back to <b>Step 2</b></Typography>
                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {JSON.stringify(draftPlan, null, 2)}
                        </pre>
                    </Card>
                </Grid>
            </Grid>

            <br />

            <Divider />

            <br />

            <Grid container justifyContent="space-even" spacing={2}>
                <Grid item>
                    <Button onClick={handleSubmit} variant="solid" color="primary">
                        Schedule Plan
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

export default SubmitPlan;
