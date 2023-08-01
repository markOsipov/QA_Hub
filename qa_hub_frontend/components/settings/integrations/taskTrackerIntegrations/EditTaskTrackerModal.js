import {Box, FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import {modalStyle} from "../../../../styles/ModalStyle";
import StyledSelect from "../../../primitives/StyledSelect";
import {customTheme} from "../../../../styles/CustomTheme";
import {updateTaskTrackerIntegration} from "../../../../requests/integrations/TaskTrackerRequests";

function EditTaskTrackerModal({isOpen, setIsOpen, updateIntegrations, types, integrations, integration }) {
    const [currentIntegration, setCurrentIntegration] = useState(integration)

    useEffect(() => {
        if (isOpen) {
            setCurrentIntegration(integration)
        }
    }, [isOpen])


    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectType = (event) => {
        setCurrentIntegration({
            ...currentIntegration,
            type: event.target.value
        })
    }

    const handleUpdateButtonClick = () => {
        if (integrations.find(integration => {
            return integration.type === currentIntegration.type && integration["_id"] !== currentIntegration["_id"]
        })) {
            alert("An Integration with the same type already exists")
        } else {
            updateTaskTrackerIntegration(currentIntegration).then(() => {
                updateIntegrations()
                setIsOpen(false)
            })
        }
    }


    return <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "10px"}}>
                Editing CICD Integration
            </Typography>

            <FormControl sx={{ minWidth: 400, margin: "8px" }} size="small">
                <InputLabel style={{ color: customTheme.palette.text.faded }}>Type</InputLabel>
                <StyledSelect
                    value={currentIntegration.type || ''}
                    label="Type"
                    onChange={selectType}
                >
                    {
                        (types).map((type) =>
                            <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                        )
                    }
                </StyledSelect>
            </FormControl>

            <StyledTextField value={currentIntegration.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentIntegration({
                                     ...currentIntegration,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentIntegration.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentIntegration({
                                     ...currentIntegration,
                                     apiToken: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentIntegration.login}
                             size="small"
                             label="Login"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentIntegration({
                                     ...currentIntegration,
                                     login: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentIntegration.password}
                             size="small"
                             label="Password"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentIntegration({
                                     ...currentIntegration,
                                     password: event.target.value
                                 })
                             }}
            />


            <Button variant="contained"
                    color="error"
                    onClick={handleUpdateButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Save changes</Button>
        </Box>
    </Modal>
}

export default EditTaskTrackerModal;