import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import StyledTextField from "../../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import {addTmsIntegration} from "../../../../requests/integrations/TMSRequests";
import {modalStyle} from "../../../../styles/ModalStyle";
import StyledSelect from "../../../primitives/StyledSelect";
import {customTheme} from "../../../../styles/CustomTheme";

function NewTmsModal({isOpen, setIsOpen, updateTmsList, tmsTypes, tmsIntegrations}) {
    const defaultTmsValue = {
        tmsType: "",
        baseUrl: "",
        apiUrl: "",
        apiToken: "",
        login: "",
        password: ""
    }

    const [newTms, setNewTms] = useState(defaultTmsValue)


    useEffect(() => {
        if (isOpen) {
            setNewTms(defaultTmsValue)
        }
    }, [isOpen])


    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectTms = (event) => {
        setNewTms({
            ...newTms,
            tmsType: event.target.value
        })
    }

    const handleAddTmsButtonClick = () => {
        if (tmsIntegrations.map(tms => { return tms.tmsType }).includes(newTms.tmsType)) {
            alert("A TMS with the same type already exists")
        } else {
            addTmsIntegration(newTms).then(() => {
                updateTmsList()
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
                Adding new TMS
            </Typography>

            <FormControl sx={{ minWidth: 400, margin: "8px" }} size="small">
                <InputLabel style={{ color: customTheme.palette.text.faded }}>TMS Type</InputLabel>
                <StyledSelect
                    value={newTms.tmsType || ''}
                    label="Tms type"
                    onChange={selectTms}
                >
                    {
                        tmsTypes.map((tms) =>
                            <MenuItem key={tms.tmsName} value={tms.tmsName}>{tms.tmsName}</MenuItem>
                        )
                    }
                </StyledSelect>
            </FormControl>

            <StyledTextField value={newTms.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewTms({
                                     ...newTms,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newTms.apiUrl}
                             size="small"
                             label="Base Api URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewTms({
                                     ...newTms,
                                     apiUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newTms.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewTms({
                                     ...newTms,
                                     apiToken: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newTms.login}
                             size="small"
                             label="Login"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewTms({
                                     ...newTms,
                                     login: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newTms.password}
                             size="small"
                             label="Password"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewTms({
                                     ...newTms,
                                     password: event.target.value
                                 })
                             }}
            />


            <Button variant="contained"
                    color="error"
                    onClick={handleAddTmsButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Add TMS</Button>
        </Box>
    </Modal>
}

export default NewTmsModal;