import React from "react";
import { Modal, ModalDialog, Typography, Box, Button, AccordionGroup, Accordion, AccordionSummary, AccordionDetails } from "@mui/joy";


const ViewModal = ({ open, onClose, planDetails }) => (
    <Modal open={open} onClose={onClose}>
        <ModalDialog>
            <Typography level="h4">Plan Details</Typography>
            {planDetails ? (
                <Box>
                    <Typography>ID: {planDetails.plan.id}</Typography>
                    <Typography>Description: {planDetails.plan.description}</Typography>
                    <Typography>Status: {planDetails.plan.status}</Typography>
                    <Typography>
                        Created At: {new Date(planDetails.plan.created_at).toLocaleString()}
                    </Typography>
                    <Typography>
                        Updated At: {new Date(planDetails.plan.updated_at).toLocaleString()}
                    </Typography>
                    <Typography>
                        Latest Task: {planDetails.latestTask.id} (Status: {planDetails.latestTask.status})
                    </Typography>

                    <br />

                    <AccordionGroup>

                        <Accordion>
                            <AccordionSummary>Action Configured</AccordionSummary>
                            <AccordionDetails><pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>                        {JSON.stringify(planDetails.plan.action)}</pre>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary>Hooks Attached</AccordionSummary>
                            <AccordionDetails><pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>                        {JSON.stringify(planDetails.plan.hooks)}</pre>
                            </AccordionDetails>
                        </Accordion>

                    </AccordionGroup>

                </Box>
            ) : (
                <Typography>Loading...</Typography>
            )}
            <Button variant="soft" sx={{ marginTop: 2 }} onClick={onClose}>
                Close
            </Button>
        </ModalDialog>
    </Modal>
);

export default ViewModal;