import '../styles/globals.css'
import QaHubAppBar from "../components/common/QaHubAppBar";
import {customTheme} from "../styles/CustomTheme";
import {Card, ThemeProvider} from "@mui/material";
import projectState from "../state/ProjectState";
import {loadProjects} from "../requests/ProjectRequests";
import {useEffect, useState} from "react";
import AlertsView from "../components/common/AlertsView";
import Typography from "@mui/material/Typography";
import {observer} from "mobx-react-lite";
import Head from "next/head";
import appState from "../state/AppState";
import favicon from '../public/favicon.ico';

const MyApp = observer(({ Component, pageProps }) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        loadProjects().then(response => {
            if (response.data) {
                setData(response)

                const newProjects = response.data.map(project => {
                    return project.name
                })

                projectState.setProjects(newProjects)
                projectState.setProjectsDetails(response.data)

                if (!projectState.selectedProject) {
                    projectState.setSelectedProject(newProjects[0])
                }
            }
        })

    }, [])

    const AppLoader = ({...props}) => {
        return <div style={{
            width: '100vw',
            height: '100vh',
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
            ...props.style
        }}>
            <Head>
                <title>{appState.title || "QA Hub"}</title>\
                <link rel="shortcut icon" href={favicon.src} />
            </Head>
            <Typography variant={'h5'}>Loading . . .</Typography>
        </div>
    }

    if (data == null) {
        return <AppLoader />
    }

    return <div style={{ height: '100vh', overflow: 'hidden'}}>
        <Head>
            <title>{appState.title}</title>
            <link rel="shortcut icon" href={favicon.src} />
        </Head>
        <ThemeProvider theme={customTheme}>
            <QaHubAppBar/>
            <div
                style={{
                    height: 'calc(100vh - 65px)',
                    minHeight: 'calc(100vh - 65px)',
                    overflowY: 'auto',
                    backgroundColor: customTheme.palette.background.default
                }}
            >
                <Component {...pageProps} />
                <AlertsView style={{position: "absolute", right: '30px', bottom: '20px', zIndex: '1000000'}}/>
            </div>
        </ThemeProvider>
    </div>
})

export default MyApp
