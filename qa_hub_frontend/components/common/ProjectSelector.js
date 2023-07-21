import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import StyledSelect from "../primitives/StyledSelect";

const ProjectSelector = observer(({style}) => {
    function handleProjectChange(event) {
        projectState.setSelectedProject(event.target.value)
    }

    if (!projectState.selectedProject) return null

    return(
        <FormControl style={{...style}}>
            <InputLabel id="project-selector-label" style={{color: "var(--faded-text-color)"}}>Project</InputLabel>
            <StyledSelect
                id="project-selector"
                value={projectState.selectedProject}
                label="Project"
                onChange={(e) => handleProjectChange(e)}
                size="small"
            >
                {
                    (projectState.projects || []).map(project => (
                        <MenuItem key={project} value={project}>{project}</MenuItem>
                    ))
                }

            </StyledSelect>
        </FormControl>
    )
})

export default ProjectSelector