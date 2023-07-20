import {Paper} from "@mui/material";
import TestResultCard from "./TestResultCard";
import {useEffect, useState} from "react";
import {getTestResults} from "../../../../requests/testResults/TestResultsRequests";

export default function TestResultsList({testRunId, testResults, setTestResults, setSelectedTest, ...props }) {
  const [loading, setLoading] = useState(false)

  async function updateTestResults() {
    if (testResults[0]?.testRunId !== testRunId) {
      setLoading(true)
    }
    const resp = await getTestResults(testRunId).then((data) =>
      setTestResults(data.data)
    )
    setLoading(false)
    return resp
  }

  useEffect(() => {
    updateTestResults()
  }, [testRunId])



  if (loading) {
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