import TestRunForm from "../components/testRuns/testRunForms/TestRunForm";
import TestRunList from "../components/testRuns/testRunList/TestRunList";

function TestRuns() {
    return <div style={{padding: "15px"}}>
        <TestRunForm />
        <TestRunList style={{marginTop: '15px'}}/>
    </div>
}

export default TestRuns