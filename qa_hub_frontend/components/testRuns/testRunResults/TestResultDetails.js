import {Paper} from "@mui/material";

export default function TestResultDetails({ testResult, ...props }) {
  const renderContent = () => {
    if (testResult == null) {
      return <div>Not selected</div>
    } else {
      return <div>Test result</div>
    }
  }

  return <Paper style={{padding: '15px', ...props.style}}>
    <label>Test result details</label>
    {
      renderContent()
    }
  </Paper>
}