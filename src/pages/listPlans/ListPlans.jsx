import React, { useState, useEffect, useCallback } from "react";
import { Typography, Box, Button, Table, Stack } from "@mui/joy";
import { Pagination } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PopupStack from "../../components/PopupStack";
import CancelModal from "./modals/CancelModal";
import ViewModal from "./modals/ViewModal";
import UpdateModal from "./modals/UpdateModal";

const SERVER_PAGE_SIZE = 20; // Number of items per page from backend
const CLIENT_PAGE_SIZE = 5; // Number of items to display per page on frontend

function ListPlans({ client, user }) {
  const [plans, setPlans] = useState([]);
  const [serverPage, setServerPage] = useState(0);
  const [clientPage, setClientPage] = useState(0);
  const [totalPlans, setTotalPlans] = useState(0);
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

  const fetchPlans = useCallback(
    async (page = 0) => {
      try {
        const response = await client.listPlans(user.id, page);
        setPlans(response.plans);
        setTotalPlans(response.total);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      }
    },
    [client, user.id]
  );

  // Initial data fetch
  useEffect(() => {
    fetchPlans(serverPage);
  }, [client, user.id, serverPage, fetchPlans]); // Only fetch on initial load

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPlans(serverPage);
    } catch (error) {
      console.error("Failed to refresh plans", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = (event, value) => {
    const newClientPage = value - 1;
    const requiredServerPage = Math.floor(
      (newClientPage * CLIENT_PAGE_SIZE) / SERVER_PAGE_SIZE
    );

    setClientPage(newClientPage);

    // If we need data from a different server page, fetch it
    if (requiredServerPage !== serverPage) {
      setServerPage(requiredServerPage);
      fetchPlans(requiredServerPage);
    }
  };

  // Get the current page of data to display
  const getCurrentPageData = () => {
    const serverPageOffset = (clientPage * CLIENT_PAGE_SIZE) % SERVER_PAGE_SIZE;
    const sortedPlans = [...plans].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return sortedPlans.slice(
      serverPageOffset,
      serverPageOffset + CLIENT_PAGE_SIZE
    );
  };

  // Calculate total number of client-side pages
  const totalClientPages = Math.ceil(totalPlans / CLIENT_PAGE_SIZE);

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
      await fetchPlans(serverPage);
    } catch (error) {
      addPopup("Failed to cancel plan", "warning");
    } finally {
      setShowCancelDialog(false);
    }
  };

  const handleCopyPlanId = (planId) => {
    navigator.clipboard
      .writeText(planId)
      .then(() => {
        addPopup("Plan ID copied to clipboard!", "success");
      })
      .catch(() => {
        addPopup("Failed to copy Plan ID", "warning");
      });
  };

  return (
    <Box>
      <PopupStack popups={popups} onRemove={removePopup} />
      <Typography level="h3">List all Plans</Typography>
      <p>
        This is the page to list all plans that the current user has submitted
        to Karya.
      </p>

      <Button
        variant="solid"
        color="primary"
        onClick={handleRefresh}
        disabled={refreshing}
      >
        {refreshing ? "Refreshing..." : "Refresh Plans"}
      </Button>
      <Table
        stickyHeader
        sx={{ width: "auto" }}
        size="md"
        borderAxis="yBetween"
        hoverRow
      >
        <caption>
          Plans submitted now will be visible within 30 seconds of submission.
        </caption>
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
          {getCurrentPageData().map((plan) => (
            <tr key={plan.id}>
              <td>
                <ContentCopyIcon
                  sx={{
                    cursor: "pointer",
                    fontSize: "1rem",
                    marginLeft: "5px",
                  }}
                  onClick={() => handleCopyPlanId(plan.id)}
                />{" "}
                {plan.id}
              </td>
              <td>{plan.description}</td>
              <td>{plan.status}</td>
              <td>{plan.period_time}</td>
              <td>{new Date(plan.created_at).toLocaleString()}</td>
              <td>{new Date(plan.updated_at).toLocaleString()}</td>
              <td>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="primary"
                    onClick={() => handleView(plan.id)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="warning"
                    onClick={() => handleUpdate(plan.id)}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    onClick={() =>
                      setSelectedPlanId(plan.id) || setShowCancelDialog(true)
                    }
                  >
                    Cancel
                  </Button>
                </Stack>
              </td>
            </tr>
          ))}
          {/* Add empty rows to maintain fixed height */}
          {getCurrentPageData().length < CLIENT_PAGE_SIZE &&
            Array.from({
              length: CLIENT_PAGE_SIZE - getCurrentPageData().length,
            }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td colSpan={7}>&nbsp;</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Pagination
        count={totalClientPages}
        page={clientPage + 1}
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
