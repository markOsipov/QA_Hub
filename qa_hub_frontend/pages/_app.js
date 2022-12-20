import '../styles/globals.css'
import QaHubAppBar from "../components/common/QaHubAppBar";
import {customTheme} from "../styles/CustomTheme";
import {ThemeProvider} from "@mui/material";
import projectState from "../state/ProjectState";
import useSWR from "swr";
import {loadProjects} from "../requests/QAHubBackend";
import {useEffect} from "react";

function MyApp({ Component, pageProps }) {
  let { data, error } = useSWR("/api/config/projects", loadProjects, { refreshInterval: 60000 })

  useEffect(() => {
    if(data?.data) {
      const newProjects = data.data.config.map(project => {
        return project.name
      })
      projectState.setProjects(newProjects)

      if (!projectState.selectedProject) {
        projectState.setSelectedProject(newProjects[0])
      }
    }
  }, [data])

  if (!data) {
    return <div>Loading projects</div>
  }
  if (error) {
      return <div>Error: {error}</div>
  }

  return <div style={{ height: '100vh', overflow: 'hidden'}}>
      <ThemeProvider theme={customTheme}>
        <QaHubAppBar></QaHubAppBar>

        <div style={{height: '91vh', minHeight: '91vh', overflowY: 'auto'}}>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
  </div>
}

export default MyApp
