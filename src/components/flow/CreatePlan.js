import React, { useState } from "react";
import { Box, Grid, Typography, Input, Button, Select, Option, Divider, Table } from "@mui/joy";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PopupStack from "../PopupStack";
import AttachHookModal from "./AttachHookModal";

function CreatePlan({ setDraftPlan, existingDraftPlan }) {
    const [description, setDescription] = useState(existingDraftPlan == null ? "" : existingDraftPlan.description);
    const [periodTime, setPeriodTime] = useState(existingDraftPlan == null ? "" : existingDraftPlan.periodTime);
    const [planType, setPlanType] = useState(existingDraftPlan == null ? "karya.core.entities.PlanType.OneTime" : existingDraftPlan.planType);
    const [recurringDateTime, setRecurringDateTime] = useState(existingDraftPlan == null ? null : existingDraftPlan.recurringDateTime);
    const [popups, setPopups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [hooks, setHooks] = useState([])

    const addPopup = (message, type) => {
        setPopups((prevPopups) => [...prevPopups, { message, type }]);
    };
    const removePopup = (index) => {
        setPopups((prevPopups) => prevPopups.filter((_, i) => i !== index));
    };

    const attachHook = (hook) => {
        setHooks((prevHooks) => [...prevHooks, hook])
    }
    const removeHook = (index) => {
        setHooks((prevHooks) => prevHooks.filter((_, i) => i !== index))
    }

    const handleSavePlan = () => {
        if (!description || !periodTime || !planType) {
            addPopup("Please fill out all required fields.", "warning");
            return;
        }

        const planData = {
            "description": description,
            "periodTime": periodTime,
            "planType": planType,
            "recurringDateTime": planType === "karya.core.entities.PlanType.Recurring" ? recurringDateTime : null,
            "hooks": hooks
        };

        console.log("Plan Data Saved:", planData);
        setDraftPlan(planData)
        addPopup("Plan Data Saved successfully!", "success");
    };

    const handleClear = () => {
        setDescription("");
        setPeriodTime("");
        setPlanType("karya.core.entities.PlanType.OneTime")
        setRecurringDateTime(null)
        setDraftPlan(null)
    };

    return (
        <Box>
            <PopupStack popups={popups} onRemove={removePopup} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Input placeholder="Period Time in ISO-8601 Format" value={periodTime} onChange={(e) => setPeriodTime(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <Select value={planType} onChange={(e, newValue) => setPlanType(newValue)} fullWidth>
                        <Option value="karya.core.entities.PlanType.OneTime">One-time</Option>
                        <Option value="karya.core.entities.PlanType.Recurring">Recurring</Option>
                    </Select>

                    <br />
                    {planType === "one-time" ?
                        <Typography level="body-sm">This will schedule a plan to run once after the period time specified.</Typography> : <Typography level="body-sm">This will run periodically according to the period time specified. Set the end datetime below if want to have a bounded recurring action. Ignore if want to keep it unbounded.</Typography>}

                </Grid>
                {planType === "karya.core.entities.PlanType.Recurring" && (
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Recurring Date/Time"
                                value={recurringDateTime}
                                renderInput={(props) => <Input {...props} />}
                                views={['year', 'month', 'day', 'hours', 'minutes']}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setRecurringDateTime(newValue); // Get DayJS Object
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                )}


                <Grid item xs={12}>
                    <Table
                        sx={{ width: "auto" }}
                        size="sm"
                        color="primary"
                        hoverRow
                    >
                        <caption>Hooks Configured</caption>
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Trigger</th>
                                <th style={{ width: '45%' }}>Action Type</th>
                                <th style={{ width: '10%' }}>Max Retries</th>
                                <th style={{ width: '20%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {hooks.map((hook, _) => (
                                <tr key={_}>
                                    <td>{hook.trigger}</td>
                                    <td>{hook.action.type}</td>
                                    <td>{hook.max_retry}</td>
                                    <td>
                                        <Button size="sm" variant="soft" color="danger" onClick={removeHook}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <br />
                    <Button variant="outlined" color="primary" onClick={() => setModalOpen(true)}>
                        Attach Hook
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid container justifyContent="space-even" spacing={2}></Grid>
                <Grid item>
                    <Button variant="solid" color="primary" onClick={handleSavePlan}>
                        Save draft Plan
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleClear} variant="solid" color="danger">
                        Clear Inputs
                    </Button>
                </Grid>
            </Grid>

            {modalOpen ? <AttachHookModal modalOpen={modalOpen} setModalOpen={setModalOpen} attachHook={attachHook} /> : ""}
        </Box>
    )

}

export default CreatePlan;