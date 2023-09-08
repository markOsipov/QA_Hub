import TestRunForm from "../../../../components/testRuns/testRunForms/TestRunForm";
import TestRunList from "../../../../components/testRuns/testRunList/TestRunList";
import appState from "../../../../state/AppState";
import {observer} from "mobx-react-lite";

const TestRuns = observer(() => {
    appState.setTitle(`QA Hub: TestRuns`)

    return <div style={{padding: "10px", minWidth: 'max-content'}}>
        <TestRunList/>
    </div>
})

export default TestRuns