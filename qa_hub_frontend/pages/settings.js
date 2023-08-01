import ResetPlate from "../components/settings/ResetPlate";
import ProjectEditor from "../components/settings/projects/ProjectEditor";
import CicdEditor from "../components/settings/integrations/cicdIntegrations/CicdEditor";
import TmsEditor from "../components/settings/integrations/tmsIntegrations/TmsEditor";
import TaskTrackerEditor from "../components/settings/integrations/taskTrackerIntegrations/TaskTrackerEditor";

function Settings() {


    return <div style={{padding: "15px"}}>
        <ResetPlate />
        <ProjectEditor />
        <TmsEditor />
        <CicdEditor />
        <TaskTrackerEditor />
    </div>
}

export default Settings