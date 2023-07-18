import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {getTestRun} from "../../requests/TestRunRequests";
import {getTestResults} from "../../requests/TestResultsRequests";
import {Paper} from "@mui/material";
import TestRunResultsOverview from "../../components/testRuns/testRunResults/TestRunResultsOverview";

export default function TestRunPage() {
  const router = useRouter()
  const testRunId = router.query.testRunId

  const [testRun, setTestRun] = useState(null)
  const [testResults, setTestResults] = useState([])

  let testRunResp = useSWR("getTestRun", async () => { return await getTestRun(testRunId) }, { refreshInterval: 60000 })
  let testResultsResp = useSWR("getTestResults", async () => { return await getTestResults(testRunId) }, { refreshInterval: 60000 })

  useEffect(() => {
    console.log(JSON.stringify(testRunResp))
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
    <Paper style={{padding: "10px", marginTop: "15px"}}>
      {JSON.stringify(testRun)}
    </Paper>
    <Paper  style={{padding: "10px", marginTop: "15px"}}>
      {JSON.stringify(testResults)}
    </Paper>
  </div>
}