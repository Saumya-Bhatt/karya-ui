import React, { useState, useEffect } from "react";
import { Typography, Box, Button, Table, Stack } from "@mui/joy";
import PopupStack from "../../components/PopupStack";
import CancelModal from "./modals/CancelModal";
import ViewModal from "./modals/ViewModal";
import UpdateModal from "./modals/UpdateModal";

function ListJobs({ client, user }) {
    const [plans, setPlans] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [popups, setPopups] = useState([]);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showUpdateDialog, setUpdateDialog] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

    const addPopup = (message, type) => {
        setPopups((prev) => [...prev, { message, type }]);
    };

    const removePopup = (index) => {
        setPopups((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plans = await client.listPlans(user.id);
                setPlans(plans);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };

        fetchPlans();
    }, [client, user.id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const plans = await client.listPlans(user.id);
            setPlans(plans);
        } catch (error) {
            console.error("Failed to refresh plans", error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleView = async (planId) => {
        try {
            const details = await client.getPlan(planId);
            setSelectedPlanDetails(details);
            setShowViewDialog(true);
        } catch (error) {
            addPopup("Failed to fetch plan details", "warning");
        }
    };

    const handleCancelConfirm = async () => {
        try {
            await client.cancelPlan(selectedPlanId);
            addPopup("Plan cancelled successfully", "success");
            setPlans((prev) => prev.filter((plan) => plan.id !== selectedPlanId));
        } catch (error) {
            addPopup("Failed to cancel plan", "warning");
        } finally {
            setShowCancelDialog(false);
        }
    };

    return (
        <Box>
            <PopupStack popups={popups} onRemove={removePopup} />
            <Typography level="h3">List all Plans</Typography>
            <p>This is the page to list all plans that the current user has submitted to Karya.</p>

            <Button
                variant="solid"
                color="primary"
                onClick={handleRefresh}
                disabled={refreshing}
            >
                {refreshing ? "Refreshing..." : "Refresh Plans"}
            </Button>
            <Table sx={{ width: "auto" }} size="md" hoverRow>
                <thead>
                    <tr>
                        <th>Plan ID</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Period Time</th>
                        <th>Submitted At</th>
                        <th>Updated At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {plans.map((plan) => (
                        <tr key={plan.id}>
                            <td>{plan.id}</td>
                            <td>{plan.description}</td>
                            <td>{plan.status}</td>
                            <td>{plan.period_time}</td>
                            <td>{new Date(plan.created_at).toLocaleString()}</td>
                            <td>{new Date(plan.updated_at).toLocaleString()}</td>
                            <td>
                                <Stack direction="row" spacing={1}>
                                    <Button size="sm"
                                        variant="soft"
                                        color="primary" onClick={() => handleView(plan.id)}>View</Button>
                                    <Button size="sm"
                                        variant="soft"
                                        color="warning" onClick={() => setSelectedPlanId(plan.id) || setUpdateDialog(true)}>Update</Button>
                                    <Button size="sm"
                                        variant="soft"
                                        color="danger" onClick={() => setSelectedPlanId(plan.id) || setShowCancelDialog(true)}>
                                        Cancel
                                    </Button>
                                </Stack>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <CancelModal
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelConfirm}
            />
            <ViewModal
                open={showViewDialog}
                onClose={() => setShowViewDialog(false)}
                planDetails={selectedPlanDetails}
            />
            <UpdateModal
                open={showUpdateDialog}
                onClose={() => setUpdateDialog(false)}
                planDetails={selectedPlanDetails}
            />
        </Box>
    );
}

export default ListJobs;