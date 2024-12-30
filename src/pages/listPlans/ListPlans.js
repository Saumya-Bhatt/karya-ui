import React, { useState, useEffect } from "react";
import { Typography, Box, Button, Table, Stack } from "@mui/joy";
import { Pagination } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PopupStack from "../../components/PopupStack";
import CancelModal from "./modals/CancelModal";
import ViewModal from "./modals/ViewModal";
import UpdateModal from "./modals/UpdateModal";

const ROWS_PER_PAGE = 20;

function ListPlans({ client, user }) {
    const [plans, setPlans] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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

    const fetchPlans = async (page = 0) => {
        try {
            const response = await client.listPlans(user.id, page);
            console.log(response)
            setPlans(response.plans);
            setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE));
        } catch (error) {
            console.error("Failed to fetch plans", error);
        }
    };

    useEffect(() => {
        fetchPlans(currentPage);
    }, [client, user.id, currentPage]);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchPlans(currentPage);
        } catch (error) {
            console.error("Failed to refresh plans", error);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1); // Pagination component uses 1-based indexing
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

    const handleUpdate = async (planId) => {
        try {
            const details = await client.getPlan(planId);
            setSelectedPlanDetails(details);
            setUpdateDialog(true);
        } catch (error) {
            addPopup("Failed to fetch plan details", "warning");
        }
    };

    const handleCancelConfirm = async () => {
        try {
            await client.cancelPlan(selectedPlanId);
            addPopup("Plan cancelled successfully", "success");
            await fetchPlans(currentPage); // Refresh the plans after cancellation
        } catch (error) {
            addPopup("Failed to cancel plan", "warning");
        } finally {
            setShowCancelDialog(false);
        }
    };

    const handleCopyPlanId = (planId) => {
        navigator.clipboard.writeText(planId).then(() => {
            addPopup("Plan ID copied to clipboard!", "success");
        }).catch(() => {
            addPopup("Failed to copy Plan ID", "warning");
        });
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
            <Table stickyHeader sx={{ width: "auto" }} size="md" borderAxis="yBetween" hoverRow>
                <caption>Plans submitted now will be visible within 30 seconds of submition.</caption>
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
                            <td>
                                <ContentCopyIcon
                                    sx={{ cursor: "pointer", fontSize: "1rem", marginLeft: "5px" }}
                                    onClick={() => handleCopyPlanId(plan.id)}
                                />
                                {" "}{plan.id}
                            </td>
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
                                        color="warning" onClick={() => handleUpdate(plan.id)}>Update</Button>
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
            <Pagination
                count={totalPages}
                page={currentPage + 1} // Pagination component uses 1-based indexing
                onChange={handlePageChange}
                sx={{ marginTop: 2 }}
            />
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
                client={client}
                addPopup={addPopup}
            />
        </Box>
    );
}

export default ListPlans;