import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {createProject, loadPlatforms} from "../../../requests/ProjectRequests";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import projectState from "../../../state/ProjectState";
import {modalStyle} from "../../../styles/ModalStyle";
import StyledSelect from "../../primitives/StyledSelect";
import ProjectCICDForm from "./components/ProjectCICDForm";
import ProjectTMSForm from "./components/ProjectTMSForm";
import ProjectTaskTrackerForm from "./components/ProjectTaskTrackerForm";
import {customTheme} from "../../../styles/CustomTheme";

function NewProjectModal({isOpen, setIsOpen}) {
    const defaultProjectValue = {
        name: "",
        platform: "",
        separator: ".",
        cicd: {},
        tms: {},
        taskTracking: {}
    }

    const [newProject, setNewProject] = useState(defaultProjectValue)
    const [platforms, setPlatforms] = useState([])

    useEffect(() => {
        if (isOpen) {
            setNewProject(defaultProjectValue)
        }
    }, [isOpen])

    useEffect(() => {
        loadPlatforms().then(data => {
            if (data?.data) {
                setPlatforms(data?.data)
            }
        })
    }, [])

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

    return <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={{...modalStyle, minWidth: '550px'}}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "20px"}}>
                Adding new project
            </Typography>

            <StyledTextField value={newProject.name}
                             size="small"
                             label="Project name"
                             style={{minWidth: "100%", color: "white", marginBottom: "20px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewProject({
                                    ...newProject,
                                    name: event.target.value
                                 })
                             }}
            />

            <FormControl sx={{ minWidth: "100%"}} size="small">
                <InputLabel style={{ color: customTheme.palette.text.faded }}>Platform</InputLabel>
                <StyledSelect
                    value={newProject.platform || ''}
                    label="Platform"
                    onChange={selectPlatform}
                >
                    {
                        platforms.map((platform) =>
                            <MenuItem key={platform.name} value={platform.name}>{platform.name}</MenuItem>
                        )
                    }
                </StyledSelect>
            </FormControl>

            <StyledTextField value={newProject.separator}
                             size="small"
                             label="Separator"
                             style={{minWidth: "100%", color: "white", marginTop: '20px'}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setNewProject({
                                     ...newProject,
                                     separator: event.target.value
                                 })
                             }}
            />

            <ProjectCICDForm project={newProject} setProject={setNewProject} style={{marginTop: '30px'}}/>
            <ProjectTMSForm project={newProject} setProject={setNewProject} style={{marginTop: '10px'}} />
            <ProjectTaskTrackerForm project={newProject} setProject={setNewProject} style={{marginTop: '10px'}}/>

            <Button variant="contained"
                    color="error"
                    onClick={handleAddProjectButtonClick}
                    style={{marginTop: "20px"}}
            >Add project</Button>
        </Box>
    </Modal>
}

export default NewProjectModal;