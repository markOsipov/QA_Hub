import {Box, FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import {updateCicdIntegration} from "../../../requests/CICDRequests";
import {modalStyle} from "../../../styles/ModalStyle";

function EditCicdModal({isOpen, setIsOpen, updateCicdList, cicdTypes, cicdIntegrations, cicd }) {
    const [currentCicd, setCurrentCicd] = useState(cicd)

    useEffect(() => {
        if (isOpen) {
            setCurrentCicd(cicd)
        }
    }, [isOpen])


    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectCicd = (event) => {
        setCurrentCicd({
            ...currentCicd,
            cicdType: event.target.value
        })
    }

    const handleUpdateCicdButtonClick = () => {
        if (cicdIntegrations.find(cicd => {
            return cicd.cicdType === currentCicd.cicdType && cicd["_id"] !== currentCicd["_id"]
        })) {
            alert("A CICD with the same type already exists")
        } else {
            updateCicdIntegration(currentCicd).then(() => {
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
                Editing CICD Integration
            </Typography>

            <FormControl sx={{ minWidth: 400, margin: "8px" }} size="small">
                <InputLabel style={{ color: "var(--faded-text-color)" }}>CICD Type</InputLabel>
                <Select
                    value={currentCicd.cicdType || ''}
                    label="Cicd type"
                    onChange={selectCicd}
                >
                    {
                        (cicdTypes).map((cicd) =>
                            <MenuItem key={cicd.cicdName} value={cicd.cicdName}>{cicd.cicdName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <StyledTextField value={currentCicd.baseUrl}
                             size="small"
                             label="Base URL"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentCicd({
                                     ...currentCicd,
                                     baseUrl: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentCicd.apiToken}
                             size="small"
                             label="Api Token"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentCicd({
                                     ...currentCicd,
                                     apiToken: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentCicd.login}
                             size="small"
                             label="Login"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentCicd({
                                     ...currentCicd,
                                     login: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentCicd.password}
                             size="small"
                             label="Password"
                             style={{minWidth: "400px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentCicd({
                                     ...currentCicd,
                                     password: event.target.value
                                 })
                             }}
            />


            <Button variant="contained"
                    color="error"
                    onClick={handleUpdateCicdButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Save changes</Button>
        </Box>
    </Modal>
}

export default EditCicdModal;