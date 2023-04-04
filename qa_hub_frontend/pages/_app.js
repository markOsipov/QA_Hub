import '../styles/globals.css'
import QaHubAppBar from "../components/common/QaHubAppBar";
import {customTheme} from "../styles/CustomTheme";
import {Card, ThemeProvider} from "@mui/material";
import projectState from "../state/ProjectState";
import useSWR from "swr";
import {loadProjects} from "../requests/QAHubBackend";
import {useEffect} from "react";
import { useRouter } from 'next/router'
import GoToSettingsStub from "../components/stubs/GoToSettingsStub";

function MyApp({ Component, pageProps }) {
    let router = useRouter()
    let { data, error } = useSWR("loadProjects", loadProjects, { refreshInterval: 60000 })

    useEffect(() => {
        if(data?.data) {
            const newProjects = data.data.map(project => {
                return project.name
            })
            projectState.updateProjects(newProjects)
            projectState.setProjectsDetails(data.data)

            if (!projectState.selectedProject) {
                projectState.setSelectedProject(newProjects[0])
            }
        }
    }, [data])

    if (data == null) {
        return <div>Loading projects</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    function shouldNavigateToSettings() {
        return (!projectState.projects || projectState.projects.length === 0) && !router.asPath.includes("/settings")
    }

    return <div style={{ height: '100vh', overflow: 'hidden'}}>
        <ThemeProvider theme={customTheme}>
            <QaHubAppBar/>
            {
                shouldNavigateToSettings() ? (
                    <GoToSettingsStub />
                ) : (
                    <div style={{height: '91vh', minHeight: '91vh', overflowY: 'auto'}}>
                        <Component {...pageProps} />
                    </div>
                )
            }
        </ThemeProvider>
    </div>
}

export default MyApp
