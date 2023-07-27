import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getTestRun} from "../../requests/TestRunRequests";
import TestRunResultsOverview from "../../components/testRuns/testRunResults/testRunOverview/TestRunResultsOverview";
import TestResultsList from "../../components/testRuns/testRunResults/testResultsList/TestResultsList";
import TestResultDetails from "../../components/testRuns/testRunResults/testResultDetails/TestResultDetails";
import {getSingleTestResult} from "../../requests/testResults/TestResultsRequests";

export default function TestRunPage() {
  const router = useRouter()

  const [testRun, setTestRun] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [testResults, setTestResults] = useState([])

  const [filter, setFilter] = useState({})
  const [filterChanged, setFilterChanged] = useState(false)

  const loadTestResultFromUrl = (testRunId) => {
    const identifier = router.query.test

    if (identifier) {
      getSingleTestResult(testRunId, identifier).then((data) => {
        if (data?.data) {
          setSelectedTest(data.data)
        } else {
          delete router.query.test
          router.replace(router)
        }
      })
    }
  }

  useEffect(() => {
    const testRunId = router.query.testRunId

    if (testRunId) {
      getTestRun(testRunId).then(data => {
        if (data?.data) {
          setTestRun(data.data)
        }
      })
      loadTestResultFromUrl(testRunId)
    }
  }, [router.query])

  if (!testRun) {
    return <div>Loading</div>
  }

  return <div style={{padding: "15px"}}>
    <TestRunResultsOverview
      testRun={testRun}
      filter={filter}
      setFilter={setFilter}
      setFilterChanged={setFilterChanged}
    />

    <div style={{display: "flex", marginTop: '15px', width: '100%', minWidth: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
      <TestResultsList
        testsCount={testRun?.tests?.testsCount}
        testResults={testResults}
        setTestResults={setTestResults}
        testRunId={testRun.testRunId}
        setSelectedTest={setSelectedTest}
        filter={filter}
        setFilter={setFilter}
        filterChanged={filterChanged}
        setFilterChanged={setFilterChanged}
        style={{width: "550px", minWidth: '370px', maxWidth: '70%', overflowX: 'auto', resize: 'horizontal'}}
      />
      <TestResultDetails
        testResult={selectedTest}
        testResults={testResults}
        setTestResults={setTestResults}
        filter={filter}
        setFilter={setFilter}
        setFilterChanged={setFilterChanged}
        style={{marginLeft: '15px', overflowX: 'auto', width: 'min-content', flexGrow:'1.1'}}
      />
    </div>
  </div>
}