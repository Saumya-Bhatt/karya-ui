import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalDialog,
    Typography,
    Box,
    Button,
    Input,
    Table,
    Stack,
    Divider,
} from "@mui/joy";
import AttachHookModal from "../../scheduleTask/flow/AttachHookModal";
import { UpdatePlanRequest } from "karya-client/client/requests";

const UpdateModal = ({ open, onClose, planDetails, client, addPopup }) => {
    const [periodTime, setPeriodTime] = useState("");
    const [maxFailureRetry, setMaxFailureRetry] = useState(3);
    const [hooks, setHooks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    // Populate form fields with existing planDetails
    useEffect(() => {
        if (planDetails) {
            console.log(planDetails)
            setPeriodTime(planDetails.plan.period_time || "");
            setMaxFailureRetry(planDetails.plan.max_failure_retry || 3);
            setHooks(planDetails.plan.hook || []);
        }
    }, [planDetails]);

    const attachHook = (hook) => {
        setHooks((prevHooks) => [...prevHooks, hook]);
    };

    const removeHook = (index) => {
        setHooks((prevHooks) => prevHooks.filter((_, i) => i !== index));
    };

    const handleUpdatePlan = async () => {
        try {
            const updateRequest = new UpdatePlanRequest(
                planDetails.plan.id,
                periodTime,
                maxFailureRetry,
                hooks,
            );

            await client.updatePlan(updateRequest);
            addPopup("Plan updated successfully!", "success");
            onClose();
        } catch (error) {
            console.error("Failed to update plan:", error);
            addPopup(`Failed to update plan : ${error}`, "warning");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog>
                <Typography level="h5">Update Plan</Typography>
                {planDetails ? (
                    <Box>
                        <Input
                            placeholder="Period Time (ISO-8601 Format)"
                            value={periodTime}
                            onChange={(e) => setPeriodTime(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />
                        <Input
                            placeholder="Max Failure Retry"
                            type="number"
                            value={maxFailureRetry}
                            onChange={(e) => setMaxFailureRetry(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                        />

                        <Table sx={{ width: "auto" }} size="sm" hoverRow>
                            <caption>Hooks Configured</caption>
                            <thead>
                                <tr>
                                    <th>Trigger</th>
                                    <th>Action Type</th>
                                    <th>Max Retries</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hooks.map((hook, index) => (
                                    <tr key={index}>
                                        <td>{hook.trigger}</td>
                                        <td>{hook.action.type}</td>
                                        <td>{hook.max_retry}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="soft"
                                                color="danger"
                                                onClick={() => removeHook(index)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setModalOpen(true)}
                            sx={{ marginTop: 2 }}
                        >
                            Attach Hook
                        </Button>

                        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

                        <Stack direction="row" spacing={2}>
                            <Button variant="solid" color="primary" onClick={handleUpdatePlan}>
                                Update Plan
                            </Button>
                            <Button variant="soft" onClick={onClose}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Typography>Loading...</Typography>
                )}

                {modalOpen && (
                    <AttachHookModal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        attachHook={attachHook}
                    />
                )}
            </ModalDialog>
        </Modal>
    );
};

export default UpdateModal;
