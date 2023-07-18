import {Card, Paper} from "@mui/material";
import StatusBadge from "../../primitives/StatusBadge";
import TextWithLabel from "../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import TestResultCard from "./TestResultCard";

export default function TestResultsList({loader, testResults, setSelectedTest, ...props }) {
  if (loader) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading test results</Paper>
  }

  return <Paper style={{padding: '15px', ...props.style}}>
    <label>Test results list</label>
    {
      testResults.map((testResult) => {
        return <TestResultCard
          testResult={testResult}
          setSelectedTest={setSelectedTest}
          key={testResult.fullName}
          style={{padding: '15px', marginTop: '15px'}}
        />
      })
    }
  </Paper>
}