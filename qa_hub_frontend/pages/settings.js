import ResetPlate from "../components/settings/ResetPlate";
import ProjectEditor from "../components/settings/projects/ProjectEditor";
import CicdEditor from "../components/settings/integrations/cicdIntegrations/CicdEditor";
import TmsEditor from "../components/settings/integrations/tmsIntegrations/TmsEditor";
import TaskTrackerEditor from "../components/settings/integrations/taskTrackerIntegrations/TaskTrackerEditor";
import {useEffect} from "react";
import {getCicdIntegrations, getCicdTypes} from "../requests/integrations/CICDRequests";
import integrationsState from "../state/integrations/IntegrationsState";
import {observer} from "mobx-react-lite";
import {getTaskTrackerIntegrations, getTaskTrackerTypes} from "../requests/integrations/TaskTrackerRequests";
import {getTmsIntegrations, getTmsTypes} from "../requests/integrations/TMSRequests";
import appState from "../state/AppState";

const Settings = observer(() => {
    appState.setTitle("QA Hub: Settings")

    useEffect(() => {
        getCicdTypes().then( data => {
            if (data?.data) {
                integrationsState.setCicdTypes(data.data)
            }
        })
    }, [])

    useEffect(() => {
        getTaskTrackerTypes().then( data => {
            if (data?.data) {
                integrationsState.setTaskTrackerTypes(data.data)
            }
        })
    }, [])

    useEffect(() => {
        getTmsTypes().then( data => {
            if (data?.data) {
                integrationsState.setTmsTypes(data.data)
            }
        })
    }, [])

    useEffect(() => {
        getCicdIntegrations().then( data => {
            if (data?.data) {
                integrationsState.setCicdIntegrations(data.data)
            }
        })
    }, [])

    useEffect(() => {
        getTmsIntegrations().then( data => {
            if (data?.data) {
                integrationsState.setTmsIntegrations(data.data)
            }
        })
    }, [])

    useEffect(() => {
        getTaskTrackerIntegrations().then( data => {
            if (data?.data) {
                integrationsState.setTaskTrackerIntegrations(data.data)
            }
        })
    }, [])


    return <div style={{padding: "15px"}}>
        {/*<ResetPlate />*/}
        <ProjectEditor />
        <CicdEditor />
        <TmsEditor />
        <TaskTrackerEditor />
    </div>
})

export default Settings