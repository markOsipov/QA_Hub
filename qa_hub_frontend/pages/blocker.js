import useSWR from "swr";
import {getBlockedTests} from "../requests/QAHubBackend";
import projectState from "../state/ProjectState";

function Blocker() {
    const { selectedProject } = projectState
    let { data, error } = useSWR(selectedProject, getBlockedTests, { refreshInterval: 15000 } )

    if (error) return <div>Failed to receive blocked tests: { JSON.stringify(error, null, 2) }</div>
    if (!data) return <div>Blocked tests are loading </div>

    return (
        <div>{ JSON.stringify(data) }</div>
    );
}

export default Blocker;