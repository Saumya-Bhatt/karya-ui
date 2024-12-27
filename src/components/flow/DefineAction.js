import React, { useState } from "react";
import { Select, Option, Typography } from "@mui/joy";
import RestCallAction from "../actions/RestCallAction";
import SlackMessageAction from "../actions/SlackMessageAction";
import PushKafkaAction from "../actions/PushKafkaAction";
import SendEmailAction from "../actions/SendEmailAction";

function DefineAction({ setAction, existingAction }) {
    const [selectedAction, setSelectedAction] = useState(existingAction == null ? "karya.core.entities.Action.KafkaProducerRequest" : existingAction.type);

    const renderActionComponent = () => {
        switch (selectedAction) {
            case "karya.core.entities.Action.RestApiRequest":
                return <RestCallAction setAction={setAction} existingAction={existingAction} />;
            case "karya.core.entities.Action.SlackMessageRequest":
                return <SlackMessageAction setAction={setAction} existingAction={existingAction} />;
            case "karya.core.entities.Action.KafkaProducerRequest":
                return <PushKafkaAction setAction={setAction} existingAction={existingAction} />;
            case "karya.core.entities.Action.EmailRequest":
                return <SendEmailAction setAction={setAction} existingAction={existingAction} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Typography variant="body1" sx={{ marginRight: "10px" }}>
                Select an action to configure:
            </Typography>
            <Select
                defaultValue={selectedAction}
                value={selectedAction}
                onChange={(event, value) => setSelectedAction(value)}
                sx={{ width: "fit-content" }}
            >
                <Option value="karya.core.entities.Action.RestApiRequest">Make REST call</Option>
                <Option value="karya.core.entities.Action.SlackMessageRequest">Send Slack Message</Option>
                <Option value="karya.core.entities.Action.KafkaProducerRequest">Push message to Kafka</Option>
                <Option value="karya.core.entities.Action.EmailRequest">Send Email from Karya</Option>
            </Select>
            <br />
            {renderActionComponent()}
        </>
    )

}

export default DefineAction