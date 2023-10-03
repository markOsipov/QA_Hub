import {Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {loadPlatforms, updateProject} from "../../../requests/ProjectRequests";
import StyledTextField from "../../primitives/StyledTextField";
import Button from "@mui/material/Button";
import projectState from "../../../state/ProjectState";
import {modalStyle} from "../../../styles/ModalStyle";
import StyledSelect from "../../primitives/StyledSelect";
import ProjectCICDForm from "./components/ProjectCICDForm";
import ProjectTMSForm from "./components/ProjectTMSForm";
import ProjectTaskTrackerForm from "./components/ProjectTaskTrackerForm";
import {customTheme} from "../../../styles/CustomTheme";
import ProjectOtherIntsForm from "./components/ProjectOtherIntsForm";

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

    const handleUpdateProjectButtonClick = () => {
        updateProject(currentProject).then(() => {
            projectState.updateProjects()
            setIsOpen(false)
        })
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
        <Box sx={{...modalStyle, minWidth: '550px'}}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: "20px"}}>
                Editing project
            </Typography>

            <StyledTextField value={currentProject.name}
                             size="small"
                             label="Project name"
                             style={{minWidth: "100%", color: "white", marginBottom: "16px"}}
                             autoComplete='off'
                             onChange ={(event) => {
                                 setCurrentProject({
                                    ...currentProject,
                                    name: event.target.value
                                 })
                             }}
            />

            <FormControl sx={{ minWidth: "100%", marginBottom: "8px" }} size="small">
                <InputLabel style={{ color: customTheme.palette.text.faded }}>Platform</InputLabel>
                <StyledSelect
                    value={currentProject.platform || ''}
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

            <ProjectCICDForm project={currentProject} setProject={setCurrentProject} style={{marginTop: '20px'}}/>
            <ProjectTMSForm project={currentProject} setProject={setCurrentProject} style={{marginTop: '10px'}} />
            <ProjectTaskTrackerForm project={currentProject} setProject={setCurrentProject} style={{marginTop: '10px'}}/>
            <ProjectOtherIntsForm project={currentProject} setProject={setCurrentProject} style={{marginTop: '10px'}} />

            <Button variant="contained"
                    color="error"
                    onClick={handleUpdateProjectButtonClick}
                    style={{marginTop: "20px"}}
            >Save changes</Button>
        </Box>
    </Modal>
}

export default NewProjectModal;