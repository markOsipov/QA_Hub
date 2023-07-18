import {Card, Paper} from "@mui/material";
import StatusBadge from "../../primitives/StatusBadge";
import TextWithLabel from "../../primitives/TextWithLabel";
import Typography from "@mui/material/Typography";
import TestResultCard from "./TestResultCard";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {getTestResults} from "../../../requests/TestResultsRequests";

export default function TestResultsList({testRunId, setSelectedTest, ...props }) {
  const [testResults, setTestResults] = useState([])

  let testResultsResp = useSWR(
    "getTestResults",
    async () => { return await getTestResults(testRunId) },
    { refreshInterval: 60000 }
  )

  useEffect(() => {
    if (testResultsResp.data?.data) {
      setTestResults(testResultsResp.data.data)
    }
  }, [testResultsResp.data])

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