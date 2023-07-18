import {Paper} from "@mui/material";
import TestRetriesTabs from "./TestRetriesTabs";

export default function TestResultDetails({ testResult, ...props }) {
  const renderContent = () => {
    if (testResult == null) {
      return <div>Not selected</div>
    } else {
      return <div>
        <label>Test result</label>
        <TestRetriesTabs testResult={testResult} />
      </div>
    }
  }

  return <Paper style={{padding: '15px', ...props.style}}>
    <label>Test result details</label>
    {
      renderContent()
    }
  </Paper>
}