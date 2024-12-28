import React, { useState } from "react";
import { Box, Grid, Typography, Input, Button, Select, Option, Divider, Table, Stack } from "@mui/joy";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { OneTime, Recurring } from 'karya-client/entities/plan-types.js'
import dayjs from "dayjs";
import PopupStack from "../PopupStack";
import AttachHookModal from "./AttachHookModal";

function CreatePlan({ setDraftPlan, existingDraftPlan }) {
    const [description, setDescription] = useState(existingDraftPlan == null ? "" : existingDraftPlan.description);
    const [periodTime, setPeriodTime] = useState(existingDraftPlan == null ? "" : existingDraftPlan.period_time);
    const [planType, setPlanType] = useState(existingDraftPlan == null ? new OneTime() : existingDraftPlan.plan_type);
    const [maxFailureRetry, setMaxFailureRetry] = useState(existingDraftPlan == null ? 3 : existingDraftPlan.max_failure_retry)
    const [hooks, setHooks] = useState(existingDraftPlan == null ? [] : existingDraftPlan.hooks)

    const [popups, setPopups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

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
            "period_time": periodTime,
            "plan_type": planType,
            "max_failure_retry": maxFailureRetry,
            "hooks": hooks
        };

        console.log("Plan Draft Saved:", planData);
        setDraftPlan(planData)
        addPopup("Plan Draft Saved successfully!", "success");
    };

    const handleClear = () => {
        setDescription("");
        setPeriodTime("");
        setPlanType(new OneTime())
        setDraftPlan(null)
    };

    return (
        <Box>
            <PopupStack popups={popups} onRemove={removePopup} />

            <Grid container spacing={2} direction="row"
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Grid xs={6}>
                    <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                </Grid>
                <Grid xs={3}>
                    <Input placeholder="Period Time in ISO-8601 Format" value={periodTime} onChange={(e) => setPeriodTime(e.target.value)} fullWidth />
                </Grid>
                <Grid xs={3}>
                    <Input placeholder="Max retry on failure" type="number" value={maxFailureRetry} onChange={(e) => setMaxFailureRetry(e.target.value)} fullWidth />
                </Grid>
            </Grid>

            <br />
            <Select
                value={planType instanceof OneTime ? "one-time" : "recurring"}
                onChange={(e, newValue) => {
                    setPlanType(newValue === "one-time" ? new OneTime() : new Recurring(null));
                }}
                fullWidth
            >
                <Option value="one-time">One-time</Option>
                <Option value="recurring">Recurring</Option>
            </Select>

            <br />
            {planType instanceof OneTime ?
                <Typography level="body-sm">This will schedule a plan to run once after the period time specified.</Typography> : <Typography level="body-sm">This will run periodically according to the period time specified. Set the end datetime below if want to have a bounded recurring action. Ignore if want to keep it unbounded.</Typography>}

            <br />
            {planType instanceof Recurring && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Recurring Date/Time"
                        value={dayjs(planType.end_at)}
                        renderInput={(props) => <Input {...props} />}
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                        onChange={(newValue) => {
                            if (newValue) {
                                setPlanType(new Recurring(dayjs(newValue).valueOf()));
                            }
                        }}
                    />
                </LocalizationProvider>
            )}

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
                                <Button size="sm" variant="soft" color="danger" onClick={() => removeHook(_)}>
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

            <Divider sx={{ marginTop: "15px" }} />

            <br />
            <Stack direction="row" spacing={1}>
                <Button variant="solid" color="primary" onClick={handleSavePlan}>
                    Save draft Plan
                </Button>
                <Button onClick={handleClear} variant="solid" color="danger">
                    Clear Inputs
                </Button>
            </Stack>

            {modalOpen ? <AttachHookModal modalOpen={modalOpen} setModalOpen={setModalOpen} attachHook={attachHook} /> : ""}
        </Box>
    )

}

export default CreatePlan;