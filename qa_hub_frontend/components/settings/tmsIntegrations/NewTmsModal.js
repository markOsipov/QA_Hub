import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {createProject, loadPlatforms, loadProjects} from "../../../requests/ProjectRequests";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import projectState from "../../../state/ProjectState";
import {addTmsIntegration, getTmsTypes} from "../../../requests/TMSRequests";

function NewTmsModal({isOpen, setIsOpen, updateTmsList, tmsTypes, tmsIntegrations}) {
    const defaultTmsValue = {
        tmsType: "",
        baseUrl: "",
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "min-content",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        padding: "10px 25px"
    };

    return <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "10px"}}>
                Adding new TMS
            </Typography>

            <FormControl sx={{ minWidth: 300, margin: "8px" }} size="small">
                <InputLabel style={{ color: "var(--faded-text-color)" }}>TMS Type</InputLabel>
                <Select
                    value={newTms.tmsType || ''}
                    label="Tms type"
                    onChange={selectTms}
                >
                    {
                        tmsTypes.map((tms) =>
                            <MenuItem key={tms.tmsName} value={tms.tmsName}>{tms.tmsName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <StyledTextField value={newTms.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewTms({
                                     ...newTms,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newTms.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
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
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
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
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
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