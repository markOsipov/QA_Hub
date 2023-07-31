import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getTestRun} from "../../requests/testRuns/TestRunRequests";
import TestRunResultsOverview from "../../components/testRuns/testRunResults/testRunOverview/TestRunResultsOverview";
import TestResultsList from "../../components/testRuns/testRunResults/testResultsList/TestResultsList";
import TestResultDetails from "../../components/testRuns/testRunResults/testResultDetails/TestResultDetails";
import {getSingleTestResult} from "../../requests/testResults/TestResultsRequests";
import {observer} from "mobx-react-lite";
import testResultsFilterState from "../../state/testResults/TestResultsFilterState";

const TestRunPage = observer(() => {
  const router = useRouter()

  const [testRun, setTestRun] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)
  const [testResults, setTestResults] = useState([])

  const {filter } = testResultsFilterState

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

  const updateTestRunInfo = (testRunId) => {
    getTestRun(testRunId).then(data => {
      if (data?.data) {
        setTestRun(data.data)
      }
    })
    loadTestResultFromUrl(testRunId)
  }

  useEffect(() => {
    const testRunId = router.query.testRunId

    if (testRunId) {
      updateTestRunInfo(testRunId)
    }
  }, [router.query])

  if (!testRun) {
    return <div>Loading</div>
  }

  return <div style={{padding: "15px"}}>
    <TestRunResultsOverview
      testRun={testRun}
      updateTestRunInfo={updateTestRunInfo}
    />

    <div style={{display: "flex", marginTop: '15px', width: '100%', minWidth: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
      <TestResultsList
        testsCount={testRun?.tests?.testsCount}
        testResults={testResults}
        setTestResults={setTestResults}
        testRunId={testRun.testRunId}
        setSelectedTest={setSelectedTest}
        runners={testRun.runners || []}
        style={{width: "550px", minWidth: '370px', maxWidth: '70%', overflowX: 'auto', resize: 'horizontal'}}
      />
      <TestResultDetails
        testResult={selectedTest}
        testResults={testResults}
        setTestResults={setTestResults}
        style={{marginLeft: '15px', overflowX: 'auto', width: 'min-content', flexGrow:'1.1'}}
      />
    </div>
  </div>
})

export default TestRunPage