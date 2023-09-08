import TestStats from "../../../components/stats/TestStats";
import appState from "../../../state/AppState";
import {observer} from "mobx-react-lite";

const Statistics = observer(() => {
  appState.setTitle(`QA Hub: Statistics`)

  return <div style={{minWidth: 'max-content'}}>
    <TestStats />
  </div>
})

export default Statistics