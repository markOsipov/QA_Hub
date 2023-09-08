import LogViewer from "../components/logs/LogViewer";
import {observer} from "mobx-react-lite";
import appState from "../state/AppState";

const Logs = observer(() => {
  appState.setTitle("QA Hub: Logs")

  return <div style={{padding: "15px"}}>
    <LogViewer/>
  </div>
})

export default Logs