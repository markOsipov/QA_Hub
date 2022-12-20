import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const ProjectSelector = observer(({style}) => {
    function handleProjectChange(event) {
        projectState.setSelectedProject(event.target.value)
    }

    if (!projectState.selectedProject) return null

    return(
        <FormControl style={{...style}}>
            <InputLabel id="project-selector-label">Project</InputLabel>
            <Select
                id="project-selector"
                value={projectState.selectedProject}
                label="Project"
                onChange={(e) => handleProjectChange(e)}
                size="small"
            >
                {
                    projectState.projects.map(project => (
                        <MenuItem key={project} value={project}>{project}</MenuItem>
                    ))
                }

            </Select>
        </FormControl>
    )
})

export default ProjectSelector