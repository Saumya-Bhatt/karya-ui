import React from "react";
import { Modal, ModalDialog, Typography, Stack, Button } from "@mui/joy";

const CancelModal = ({ open, onClose, onConfirm }) => (
    <Modal open={open} onClose={onClose}>
        <ModalDialog>
            <Typography level="h5">Confirm Cancellation</Typography>
            <Typography>
                Are you sure you want to cancel this plan? This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Button variant="solid" color="danger" onClick={onConfirm}>
                    Yes, Cancel
                </Button>
                <Button variant="soft" onClick={onClose}>
                    No, Go Back
                </Button>
            </Stack>
        </ModalDialog>
    </Modal>
);

export default CancelModal;