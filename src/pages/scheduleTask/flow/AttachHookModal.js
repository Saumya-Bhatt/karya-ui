import React, { useState } from "react";
import { Divider, Grid, Card, Typography, Select, Option, Button, Modal, Input } from "@mui/joy";
import { Hook } from 'karya-client/entities/models'
import { Trigger } from "karya-client/entities/constants";
import DefineAction from "./DefineAction";


function AttachHookModal({ modalOpen, setModalOpen, attachHook }) {
    const [trigger, setTrigger] = useState("ON_FAILURE");
    const [maxRetry, setMaxRetry] = useState(3);
    const [action, setAction] = useState();

    const handleAttachHook = () => {
        const newHook = new Hook(
            trigger,
            action,
            maxRetry
        );
        console.log("Attaching hook: ", newHook)
        attachHook(newHook)
        setModalOpen(false); // Close the modal after adding the hook
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="add-hook-modal-title"
            aria-describedby="add-hook-modal-description"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Card variant="outlined" sx={{ padding: 2, maxWidth: 400 }}>
                <Typography id="add-hook-modal-title" level="h5">
                    Attach Hook
                </Typography>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Select
                            value={trigger}
                            onChange={(event, value) => setTrigger(Trigger[value])}
                            fullWidth
                        >
                            <Option value="ON_FAILURE">On failure</Option>
                            <Option value="ON_COMPLETION">On Completion</Option>
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <Input
                            placeholder="Maximum times to retry is the hook fails"
                            type="number"
                            value={maxRetry}
                            onChange={(e) => setMaxRetry(Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DefineAction setAction={setAction} existingAction={null} />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="solid" color="primary" onClick={handleAttachHook}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    )
}

export default AttachHookModal;