import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import {modalStyle} from "../../../../styles/ModalStyle";
import StyledSelect from "../../../primitives/StyledSelect";
import {customTheme} from "../../../../styles/CustomTheme";
import {addTaskTrackerIntegration} from "../../../../requests/integrations/TaskTrackerRequests";

function NewTaskTrackerModal({isOpen, setIsOpen, updateIntegrations, types, integrations}) {
    const defaultValue = {
        type: "",
        baseUrl: "",
        apiToken: "",
        login: "",
        password: ""
    }

    const [newIntegration, setNewIntegration] = useState(defaultValue)

    useEffect(() => {
        if (isOpen) {
            setNewIntegration(defaultValue)
        }
    }, [isOpen])


    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectType = (event) => {
        setNewIntegration({
            ...newIntegration,
            type: event.target.value
        })
    }

    const handleAddButtonClick = () => {
        if (integrations.map(integration => { return integration.type }).includes(newIntegration.type)) {
            alert("An integration with the same type already exists")
        } else {
            addTaskTrackerIntegration(newIntegration).then(() => {
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
                Adding new Integration
            </Typography>

            <FormControl sx={{ minWidth: 400, margin: "8px" }} size="small">
                <InputLabel style={{ color: customTheme.palette.text.faded }}>Type</InputLabel>
                <StyledSelect
                    value={newIntegration.type || ''}
                    label="Type"
                    onChange={selectType}
                >
                    {
                        types.map((type) =>
                            <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
                        )
                    }
                </StyledSelect>
            </FormControl>

            <StyledTextField value={newIntegration.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewIntegration({
                                     ...newIntegration,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newIntegration.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewIntegration({
                                     ...newIntegration,
                                     apiToken: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newIntegration.login}
                             size="small"
                             label="Login"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewIntegration({
                                     ...newIntegration,
                                     login: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newIntegration.password}
                             size="small"
                             label="Password"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewIntegration({
                                     ...newIntegration,
                                     password: event.target.value
                                 })
                             }}
            />


            <Button variant="contained"
                    color="error"
                    onClick={handleAddButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Add Integration</Button>
        </Box>
    </Modal>
}

export default NewTaskTrackerModal;