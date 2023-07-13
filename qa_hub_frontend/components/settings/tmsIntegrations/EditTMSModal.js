import {Box, FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import {updateTmsIntegration} from "../../../requests/TMSRequests";
import {modalStyle} from "../../../styles/ModalStyle";

function EditTmsModal({isOpen, setIsOpen, updateTmsList, tmsTypes, tmsIntegrations, tms }) {
    const [currentTms, setCurrentTms] = useState(tms)

    useEffect(() => {
        if (isOpen) {
            setCurrentTms(tms)
        }
    }, [isOpen])


    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectTms = (event) => {
        setCurrentTms({
            ...currentTms,
            tmsType: event.target.value
        })
    }

    const handleUpdateTmsButtonClick = () => {
        if (tmsIntegrations.find(tms => {
            return tms.tmsType === currentTms.tmsType && tms["_id"] !== currentTms["_id"]
        })) {
            alert("A TMS with the same type already exists")
        } else {
            updateTmsIntegration(currentTms).then(() => {
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
                Editing TMS Integration
            </Typography>

            <FormControl sx={{ minWidth: 400, margin: "8px" }} size="small">
                <InputLabel style={{ color: "var(--faded-text-color)" }}>TMS Type</InputLabel>
                <Select
                    value={currentTms.tmsType || ''}
                    label="Tms type"
                    onChange={selectTms}
                >
                    {
                        (tmsTypes).map((tms) =>
                            <MenuItem key={tms.tmsName} value={tms.tmsName}>{tms.tmsName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <StyledTextField value={currentTms.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentTms({
                                     ...currentTms,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentTms.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentTms({
                                     ...currentTms,
                                     apiToken: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentTms.login}
                             size="small"
                             label="Login"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentTms({
                                     ...currentTms,
                                     login: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentTms.password}
                             size="small"
                             label="Password"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentTms({
                                     ...currentTms,
                                     password: event.target.value
                                 })
                             }}
            />


            <Button variant="contained"
                    color="error"
                    onClick={handleUpdateTmsButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Save changes</Button>
        </Box>
    </Modal>
}

export default EditTmsModal;