import ResetPlate from "../components/settings/ResetPlate";
import ProjectEditor from "../components/settings/projects/ProjectEditor";
import CicdEditor from "../components/settings/cicdIntegrations/CicdEditor";
import TmsEditor from "../components/settings/tmsIntegrations/TmsEditor";

function Settings() {


    return <div style={{padding: "15px"}}>
        <ResetPlate />
        <ProjectEditor />
        <TmsEditor />
        <CicdEditor />
    </div>
}

export default Settings