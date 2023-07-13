import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import {addCicdIntegration} from "../../../requests/CICDRequests";
import {modalStyle} from "../../../styles/ModalStyle";

function NewCicdModal({isOpen, setIsOpen, updateCicdList, cicdTypes, cicdIntegrations}) {
    const defaultCicdValue = {
        cicdType: "",
        baseUrl: "",
        apiToken: "",
        login: "",
        password: ""
    }

    const [newCicd, setNewCicd] = useState(defaultCicdValue)


    useEffect(() => {
        if (isOpen) {
            setNewCicd(defaultCicdValue)
        }
    }, [isOpen])


    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectCicd = (event) => {
        setNewCicd({
            ...newCicd,
            cicdType: event.target.value
        })
    }

    const handleAddCicdButtonClick = () => {
        if (cicdIntegrations.map(cicd => { return cicd.cicdType }).includes(newCicd.cicdType)) {
            alert("A CICD with the same type already exists")
        } else {
            addCicdIntegration(newCicd).then(() => {
                updateCicdList()
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
                Adding new CICD
            </Typography>

            <FormControl sx={{ minWidth: 400, margin: "8px" }} size="small">
                <InputLabel style={{ color: "var(--faded-text-color)" }}>CICD Type</InputLabel>
                <Select
                    value={newCicd.cicdType || ''}
                    label="Cicd type"
                    onChange={selectCicd}
                >
                    {
                        cicdTypes.map((cicd) =>
                            <MenuItem key={cicd.cicdName} value={cicd.cicdName}>{cicd.cicdName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <StyledTextField value={newCicd.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewCicd({
                                     ...newCicd,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newCicd.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewCicd({
                                     ...newCicd,
                                     apiToken: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newCicd.login}
                             size="small"
                             label="Login"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewCicd({
                                     ...newCicd,
                                     login: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newCicd.password}
                             size="small"
                             label="Password"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewCicd({
                                     ...newCicd,
                                     password: event.target.value
                                 })
                             }}
            />


            <Button variant="contained"
                    color="error"
                    onClick={handleAddCicdButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Add CICD</Button>
        </Box>
    </Modal>
}

export default NewCicdModal;