import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {createProject, loadPlatforms, loadProjects, updateProject} from "../../../requests/QAHubBackend";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import projectState from "../../../state/ProjectState";

function NewProjectModal({isOpen, setIsOpen, project}) {
    const [currentProject, setCurrentProject] = useState(project)
    const [platforms, setPlatforms] = useState([])

    let {data, error} = useSWR('loadPlatforms', async () => {
        return await loadPlatforms()
    }, {
        revalidateOnFocus: false,
    })

    useEffect(() => {
        if (isOpen) {
            setCurrentProject(project)
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
        setCurrentProject({
            ...currentProject,
            platform: event.target.value
        })
    }

    const handleAddProjectButtonClick = () => {
        if (projectState.projects.includes(currentProject.name)) {
            alert("A project with the same name already exists")
        } else {
            updateProject(currentProject).then(() => {
                projectState.updateProjects()
                setIsOpen(false)
            })
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        padding: "10px 25px"
    };

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
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "10px"}}>
                Editing project
            </Typography>

            <StyledTextField value={currentProject.name}
                             size="small"
                             label="Project name"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentProject({
                                    ...currentProject,
                                    name: event.target.value
                                 })
                             }}
            />

            <FormControl sx={{ minWidth: 300, margin: "8px" }} size="small">
                <InputLabel style={{ color: "var(--faded-text-color)" }}>Platform</InputLabel>
                <Select
                    value={currentProject.platform || ''}
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

            <StyledTextField value={currentProject.cicdPath}
                             size="small"
                             label="CI\CD path"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setCurrentProject({
                                     ...currentProject,
                                     cicdPath: event.target.value
                                 })
                             }}
            />
            <StyledTextField value={currentProject.cicdProjectId}
                             size="small"
                             label="CI\CD project id"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setCurrentProject({
                                     ...currentProject,
                                     cicdProjectId: event.target.value
                                 })
                             }}
            />

            <StyledTextField value={currentProject.tmsProjectId}
                             size="small"
                             label="TMS project id"
                             style={{minWidth: "300px", color: "white", margin: "8px"}}
                             autoComplete='off'
                             onChange={(event) => {
                                 setCurrentProject({
                                     ...currentProject,
                                     tmsProjectId: event.target.value
                                 })
                             }}
            />

            <Button variant="contained"
                    color="error"
                    onClick={handleAddProjectButtonClick}
                    style={{margin: "12px 8px 0 8px"}}
            >Save changes</Button>
        </Box>
    </Modal>
}

export default NewProjectModal;