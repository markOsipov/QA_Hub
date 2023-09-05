import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import StyledSelect from "../primitives/StyledSelect";
import {customTheme} from "../../styles/CustomTheme";
import {useRouter} from "next/router";
import {useEffect} from "react";
import alertState from "../../state/AlertState";
import StyledFormControl from "../primitives/StyledFormControl";

const ProjectSelector = observer(({style}) => {
  const router = useRouter()

  useEffect(() => {
    const project = router.query.project
    if (project) {
      if (projectState.projects.includes(project)) {
        projectState.setSelectedProject(project)
      } else {
        router.push("/").then(() => {
          alertState.showAlert(`Project ${project} doesn't exist`, alertState.severities.error)
        })
      }
    }
  }, [router.query.project])

  function handleProjectChange(event) {
    projectState.setSelectedProject(event.target.value)
    router.query.project = event.target.value
    router.push(router)
  }

  if (!projectState.selectedProject) return null

  return(
    <StyledFormControl style={{...style}}>
      <InputLabel id="project-selector-label" style={{color: customTheme.palette.text.faded}}>Project</InputLabel>
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
    </StyledFormControl>
  )
})

export default ProjectSelector