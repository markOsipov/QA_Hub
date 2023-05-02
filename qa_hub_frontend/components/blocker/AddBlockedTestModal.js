import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import useSWR from "swr";
import Button from "@mui/material/Button";
import {blockTest} from "../../requests/BlockerRequests";
import StyledTextField from "../primitives/StyledTextField";
import projectState from "../../state/ProjectState";

function AddBlockedTestModal({isOpen, setIsOpen, updateBlockedTestsList}) {
    const defaultBlockedTestValue = {
        fullName: "",
        testcaseId: "",
        jiraIssue: "",
        comment: "",
        project: projectState.selectedProject
    }

    const [newBlockedTest, setNewBlockedTest] = useState(defaultBlockedTestValue)

    useEffect(() => {
        if (isOpen) {
            setNewBlockedTest(defaultBlockedTestValue)
        }
    }, [isOpen])

    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const handleAddBlockedTestButtonClick = () => {
        if (newBlockedTest.fullName.length == 0) {
            alert("Full name should not be empty")
        } else {
            blockTest(newBlockedTest).then(() => {
                updateBlockedTestsList()
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
                Adding new blocked test
            </Typography>

            <StyledTextField value={newBlockedTest.fullName}
                             size="small"
                             label="Full name"
                             style={{minWidth: "530px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewBlockedTest({
                                     ...newBlockedTest,
                                     fullName: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newBlockedTest.testcaseId}
                             size="small"
                             label="Testcase id"
                             style={{minWidth: "530px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setNewBlockedTest({
                                     ...newBlockedTest,
                                     testcaseId: event.target.value
                                 })
                             }}
            />
            <StyledTextField value={newBlockedTest.jiraIssue}
                             size="small"
                             label="Jira issue"
                             style={{minWidth: "530px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setNewBlockedTest({
                                     ...newBlockedTest,
                                     jiraIssue: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newBlockedTest.comment}
                             size="small"
                             label="Comment"
                             style={{minWidth: "530px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setNewBlockedTest({
                                     ...newBlockedTest,
                                     comment: event.target.value
                                 })
                             }}
            />

            <Button variant="contained"
                    color="error"
                    onClick={handleAddBlockedTestButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Block test</Button>
        </Box>
    </Modal>
}

export default AddBlockedTestModal;