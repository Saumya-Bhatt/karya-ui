import React, { useState } from "react";
import { Divider, Grid, Card, Typography, Select, Option } from "@mui/joy";
import RestCallAction from "../components/actions/RestCallAction";
import SlackMessageAction from "../components/actions/SlackMessageAction";
import PushKafkaAction from "../components/actions/PushKafkaAction";
import SendEmailAction from "../components/actions/SendEmailAction";
import ChainPlanAction from "../components/actions/ChainPlanAction";

function ScheduleJob() {
    const [selectedCard, setSelectedCard] = useState(1);
    const [selectedAction, setSelectedAction] = useState("RestCall"); // Default selected action set to RestCall

    const handleCardClick = (cardNumber) => {
        setSelectedCard(cardNumber);
    };

    const handleActionChange = (event, newValue) => {
        setSelectedAction(newValue);
    };

    const renderActionComponent = () => {
        switch (selectedAction) {
            case "RestCall":
                return <RestCallAction />;
            case "SlackMessage":
                return <SlackMessageAction />;
            case "PushKafka":
                return <PushKafkaAction />;
            case "SendEmail":
                return <SendEmailAction />;
            case "ChainPlan":
                return <ChainPlanAction />;
            default:
                return null;
        }
    };

    return (
        <div>
            <Typography level="h3" sx={{ marginBottom: "16px" }}>
                Karya Web Client
            </Typography>
            <Typography level="body1" sx={{ marginBottom: "16px" }}>
                A browser based client to schedule jobs on Karya.
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

            {selectedCard === 1 && (
                <>
                    <Grid container alignItems="center">
                        <Typography variant="body1" sx={{ marginRight: "10px" }}>
                            Select an action to configure:
                        </Typography>
                        <Select
                            defaultValue={selectedAction}
                            value={selectedAction}
                            onChange={handleActionChange}
                            sx={{ width: "fit-content" }}
                        >
                            <Option value="RestCall">Make REST call</Option>
                            <Option value="SlackMessage">Send Slack Message</Option>
                            <Option value="PushKafka">Push message to Kafka</Option>
                            <Option value="SendEmail">Send Email from Karya</Option>
                            <Option value="ChainPlan">Chain another Plan</Option>
                        </Select>
                    </Grid>

                    <br />
                    {renderActionComponent()}
                </>
            )}

            {selectedCard === 2 && (
                <Typography level="body1" sx={{ marginTop: "16px" }}>
                    Create and define the plan details you want to schedule.
                </Typography>
            )}
            {selectedCard === 3 && (
                <Typography level="body1" sx={{ marginTop: "16px" }}>
                    Submit the plan to Karya for task scheduling.
                </Typography>
            )}
        </div>
    );
}

export default ScheduleJob;
