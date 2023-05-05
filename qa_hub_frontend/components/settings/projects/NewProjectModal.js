import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {createProject, loadPlatforms, loadProjects} from "../../../requests/ProjectRequests";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import projectState from "../../../state/ProjectState";
import {modalStyle} from "../../../styles/ModalStyle";

function NewProjectModal({isOpen, setIsOpen}) {
    const defaultProjectValue = {
        name: "",
        platform: "",
        cicdPath: "",
        cicdProjectId: "",
        tmsProjectId: ""
    }

    const [newProject, setNewProject] = useState(defaultProjectValue)
    const [platforms, setPlatforms] = useState([])

    let {data, error} = useSWR('loadPlatforms', async () => {
        return await loadPlatforms()
    }, {
        revalidateOnFocus: false,
    })

    useEffect(() => {
        if (isOpen) {
            setNewProject(defaultProjectValue)
        }
    }, [isOpen])

    useEffect(() => {
        if (data?.data) {
            setPlatforms(data?.data)
        }
    }, [data])

    const handleClose = () => {
        setIsOpen(!confirm("Close modal window?"));
    }

    const selectPlatform = (event) => {
        setNewProject({
            ...newProject,
            platform: event.target.value
        })
    }

    const handleAddProjectButtonClick = () => {
        if (projectState.projects.includes(newProject.name)) {
            alert("A project with the same name already exists")
        } else {
            createProject(newProject).then(() => {
                projectState.updateProjects()
                setIsOpen(false)
            })
        }
    }


    if (error) {
        return <>Failed to load platforms info</>
    }

    if (!data) {
        return <>Loading platform info</>
    }

    return <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "10px"}}>
                Adding new project
            </Typography>

            <StyledTextField value={newProject.name}
                             size="small"
                             label="Project name"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewProject({
                                    ...newProject,
                                    name: event.target.value
                                 })
                             }}
            />

            <FormControl sx={{ minWidth: 300, margin: "8px" }} size="small">
                <InputLabel style={{ color: "var(--faded-text-color)" }}>Platform</InputLabel>
                <Select
                    value={newProject.platform || ''}
                    label="Platform"
                    onChange={selectPlatform}
                >
                    {
                        platforms.map((platform) =>
                            <MenuItem key={platform.name} value={platform.name}>{platform.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>

            <StyledTextField value={newProject.cicdPath}
                             size="small"
                             label="CI\CD path"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setNewProject({
                                     ...newProject,
                                     cicdPath: event.target.value
                                 })
                             }}
            />
            <StyledTextField value={newProject.cicdProjectId}
                             size="small"
                             label="CI\CD project id"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setNewProject({
                                     ...newProject,
                                     cicdProjectId: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={newProject.tmsProjectId}
                             size="small"
                             label="TMS project id"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setNewProject({
                                     ...newProject,
                                     tmsProjectId: event.target.value
                                 })
                             }}
            />

            <Button variant="contained"
                    color="error"
                    onClick={handleAddProjectButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Add project</Button>
        </Box>
    </Modal>
}

export default NewProjectModal;