import React from "react";
import { Modal, ModalDialog, Typography, Box, Button, AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Card, CardContent } from "@mui/joy";


const ViewModal = ({ open, onClose, planDetails }) => (
    <Modal open={open} onClose={onClose}>
        <ModalDialog>
            <Typography level="h4">Plan Details</Typography>
            {planDetails ? (
                <Box>
                    <Typography level="body-sm">ID: {planDetails.plan.id}</Typography>
                    <Typography level="body-sm">Description: {planDetails.plan.description}</Typography>
                    <Typography level="body-sm">Status: {planDetails.plan.status}</Typography>
                    <Typography level="body-sm">
                        Created At: {new Date(planDetails.plan.created_at).toLocaleString()}
                    </Typography>
                    <Typography level="body-sm">
                        Updated At: {new Date(planDetails.plan.updated_at).toLocaleString()}
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
                            <AccordionDetails>
                                <Box sx={{
                                    maxHeight: "200px",
                                    overflowY: "auto"
                                }}>

                                    {planDetails.plan.hook.length > 0 ? (planDetails.plan.hook.map((hook, index) => (
                                        <Card variant="soft" key={index} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                                    {JSON.stringify(hook, null, 2)}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    ))) : (<Typography>No tasks available</Typography>)}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary>Latest Task Details</AccordionSummary>
                            <AccordionDetails>
                                <Typography>Last Executed At: {new Date(planDetails.latestTask.executed_at).toLocaleString()}</Typography>
                                <Typography>
                                    Latest Task: {planDetails.latestTask.id} (Status: {planDetails.latestTask.status})
                                </Typography>
                                <Typography>Next Excution At: {planDetails.latestTask.next_execution_at}</Typography>
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