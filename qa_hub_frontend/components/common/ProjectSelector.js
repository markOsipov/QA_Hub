import {observer} from "mobx-react-lite";
import projectState from "../../state/ProjectState";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import StyledSelect from "../primitives/StyledSelect";
import {customTheme} from "../../styles/CustomTheme";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import alertState from "../../state/AlertState";
import StyledFormControl from "../primitives/StyledFormControl";
import projectIntegrationsState from "../../state/integrations/ProjectIntegrationsState";
import {
  getAllProjectIntegrations,
} from "../../requests/integrations/ProjectIntegrationRequests";
import Loader from "./Loader";

const ProjectSelector = observer(({style}) => {
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    if (projectState.selectedProject) {
      setLoading(true)
      getAllProjectIntegrations(projectState.selectedProject).then(data => {
        let taskTrackerInt = data?.data?.taskTrackerInt || {}
        taskTrackerInt.taskUrl = getTaskUrl(taskTrackerInt)

        let tmsInt = getMutatedTmsInt(data?.data?.tmsInt || {})

        let cicdInt = data?.data?.cicdInt || {}
        cicdInt.jobUrl = getJobUrl(cicdInt)

        projectIntegrationsState.setTaskTrackerInt(taskTrackerInt)
        projectIntegrationsState.setTmsInt(tmsInt)
        projectIntegrationsState.setCicdInt(cicdInt)

        setLoading(false)
      })
    }
  }, [projectState.selectedProject])

  function getTaskUrl(taskTrackerInt) {
    let taskUrl = taskTrackerInt?.taskTrackerInfo?.baseUrl
    if (taskTrackerInt?.taskTrackerInfo?.type === "Jira") {
      taskUrl += "/browse"

      taskUrl = taskUrl.replace("//browse", "/browse")
    }

    if (taskTrackerInt?.taskTrackerInfo?.type === "Asana") {
      taskUrl += "/0/0"

      taskUrl = taskUrl.replace("//0", "/0")
    }

    return taskUrl
  }

  function getMutatedTmsInt(tmsInt) {
    let testcaseUrl = tmsInt?.tmsInfo?.baseUrl
    let launchUrl = tmsInt?.tmsInfo?.baseUrl

    const tmsType = tmsInt?.projectTmsInfo?.type
    const tmsProject = tmsInt?.projectTmsInfo?.project

    if (tmsType === "Allure") {
      testcaseUrl += `/project/${tmsProject}/test-cases/`
      testcaseUrl = testcaseUrl.replace("//project", "/project")

      launchUrl += `/launch`
      testcaseUrl = testcaseUrl.replace("//launch", "/launch")
    }

    if (tmsType === "Qase") {
      testcaseUrl += `/case/${tmsProject}-`

      launchUrl += `/run/${tmsProject}/dashboard`
      launchUrl = launchUrl.replace("//run", "/run")
    }

    return {
      ...tmsInt,
      testcaseUrl: testcaseUrl,
      launchUrl: launchUrl
    }
  }

  function getJobUrl(cicdInt) {
    let jobUrl = cicdInt?.cicdInfo?.baseUrl
    const project = cicdInt?.projectCicdInfo?.project
    const path = cicdInt?.projectCicdInfo?.path

    if (cicdInt?.projectCicdInfo?.type === "GitHub") {
      jobUrl = `${jobUrl}/${path}/${project}/actions/runs`

      jobUrl = jobUrl.replace(`//${project}`, `/${project}`)
    }

    return jobUrl
  }

  function handleProjectChange(event) {
    projectState.setSelectedProject(event.target.value)
    router.query.project = event.target.value
    router.push(router)
  }

  if (!projectState.selectedProject) return null

  return(
    <div style={{display: 'flex', alignItems: 'center', position: 'relative', ...style}}>
      {
        loading &&
        <Loader style={{alignSelf: 'center', color: customTheme.palette.text.disabled, position: 'absolute', marginRight: '5px', right: '100%'}}/>
      }
      <StyledFormControl >
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
    </div>
  )
})

export default ProjectSelector