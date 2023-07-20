import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {getTestRun} from "../../requests/TestRunRequests";
import TestRunResultsOverview from "../../components/testRuns/testRunResults/testRunOverview/TestRunResultsOverview";
import TestResultsList from "../../components/testRuns/testRunResults/testResultsList/TestResultsList";
import TestResultDetails from "../../components/testRuns/testRunResults/testResultDetails/TestResultDetails";

export default function TestRunPage() {
  const router = useRouter()
  const testRunId = router.query.testRunId

  const [testRun, setTestRun] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)

  let testRunResp = useSWR(
    "getTestRun",
    async () => { return await getTestRun(testRunId) },
    { refreshInterval: 60000 }
  )

  useEffect(() => {
    if (testRunResp.data?.data) {
      setTestRun(testRunResp.data.data)
    }
  }, [testRunResp.data])


  return <div style={{padding: "15px"}}>
    <TestRunResultsOverview testRun={testRun}/>

    <div style={{display: "flex", marginTop: '15px', width: '100%', minWidth: '100%'}}>
      <TestResultsList
        testRunId={testRunId}
        setSelectedTest={setSelectedTest}
        style={{width: "550px", minWidth: '370px', maxWidth: '70%', overflowX: 'auto', resize: 'horizontal'}}
      />
      <TestResultDetails testResult={selectedTest} style={{marginLeft: '15px', overflowX: 'auto', width: 'min-content', flexGrow:'1.1'}} />
    </div>
  </div>
}