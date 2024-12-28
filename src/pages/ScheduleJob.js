import React, { useState } from "react";
import { Divider, Grid, Card, Typography, Box } from "@mui/joy";
import DefineAction from "../components/flow/DefineAction";
import CreatePlan from "../components/flow/CreatePlan";
import SubmitPlan from "../components/flow/SubmitPlan";

function ScheduleJob({ user }) {
    const [selectedCard, setSelectedCard] = useState(1);

    const [action, setAction] = useState(null)
    const [draftPlan, setDraftPlan] = useState(null)

    const handleCardClick = (cardNumber) => {
        setSelectedCard(cardNumber);
    };

    return (
        <Box>
            <Typography level="h3" sx={{ marginBottom: "16px" }}>
                Karya Web Client
            </Typography>
            <Typography level="body1" sx={{ marginBottom: "16px" }}>
                A browser-based client to schedule jobs on Karya.
            </Typography>

            <br />

            <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4}>
                    <Card
                        variant="outlined"
                        onClick={() => handleCardClick(1)}
                        sx={{ cursor: "pointer", backgroundColor: selectedCard === 1 ? "primary.softBg" : "transparent" }}
                    >
                        <Typography level="title-lg">Step1: Define an Action</Typography>
                        <Typography level="body-md">This will specify what action to take once a task is to execute.</Typography>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card
                        variant="outlined"
                        onClick={() => handleCardClick(2)}
                        sx={{ cursor: "pointer", backgroundColor: selectedCard === 2 ? "primary.softBg" : "transparent" }}
                    >
                        <Typography level="title-lg">Step 2: Create the plan</Typography>
                        <Typography level="body-md">Define the details of the plan you want to schedule.</Typography>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card
                        variant="outlined"
                        onClick={() => handleCardClick(3)}
                        sx={{ cursor: "pointer", backgroundColor: selectedCard === 3 ? "primary.softBg" : "transparent" }}
                    >
                        <Typography level="title-lg">Step 3: Submit the plan</Typography>
                        <Typography level="body-md">Submit the plan to Karya. It will break the plan into tasks and schedule accordingly.</Typography>
                    </Card>
                </Grid>
            </Grid>

            <br />

            <Divider />

            <br />

            {selectedCard === 1 && <DefineAction setAction={setAction} existingAction={action} />}
            {selectedCard === 2 && <CreatePlan setDraftPlan={setDraftPlan} existingDraftPlan={draftPlan} />}
            {selectedCard === 3 && <SubmitPlan user={user} action={action} draftPlan={draftPlan} setAction={setAction} setDraftPlan={setDraftPlan} />}
        </Box>
    );
}

export default ScheduleJob;
