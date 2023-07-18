import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {getTestRun} from "../../requests/TestRunRequests";
import {getTestResults} from "../../requests/TestResultsRequests";
import {Paper} from "@mui/material";
import TestRunResultsOverview from "../../components/testRuns/testRunResults/TestRunResultsOverview";
import TestResultsList from "../../components/testRuns/testRunResults/TestResultsList";
import TestResultDetails from "../../components/testRuns/testRunResults/TestResultDetails";

export default function TestRunPage() {
  const router = useRouter()
  const testRunId = router.query.testRunId

  const [testRun, setTestRun] = useState(null)
  const [testResults, setTestResults] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)

  let testRunResp = useSWR("getTestRun", async () => { return await getTestRun(testRunId) }, { refreshInterval: 60000 })
  let testResultsResp = useSWR("getTestResults", async () => { return await getTestResults(testRunId) }, { refreshInterval: 60000 })

  useEffect(() => {
    if (testRunResp.data?.data) {
      setTestRun(testRunResp.data.data)
    }
  }, [testRunResp.data])

  useEffect(() => {
    if (testResultsResp.data?.data) {
      setTestResults(testResultsResp.data.data)
    }
  }, [testResultsResp.data])

  return <div style={{padding: "15px"}}>
    <TestRunResultsOverview testRun={testRun}/>

    <div style={{display: "flex", marginTop: '15px', width: '100%', minWidth: '100%'}}>
      <TestResultsList
        testResults={testResults}
        style={{width: "26%", minWidth: '500px', maxWidth: '70%', overflowX: 'auto', resize: 'horizontal'}}
        setSelectedTest={setSelectedTest}
      />
      <TestResultDetails testResult={selectedTest} style={{flexGrow: '1.1', marginLeft: '15px'}}></TestResultDetails>
    </div>

    <Paper style={{padding: "10px", marginTop: "15px"}}>
      {JSON.stringify(testRun)}
    </Paper>
    <Paper  style={{padding: "10px", marginTop: "15px"}}>
      {JSON.stringify(testResults)}
    </Paper>
  </div>
}