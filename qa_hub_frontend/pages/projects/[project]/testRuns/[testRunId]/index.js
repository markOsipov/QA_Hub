import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getTestRun} from "../../../../../requests/testRuns/TestRunRequests";
import TestRunResultsOverview from "../../../../../components/testRuns/testRunResults/testRunOverview/TestRunResultsOverview";
import TestResultsList from "../../../../../components/testRuns/testRunResults/testResultsList/TestResultsList";
import TestResultDetails from "../../../../../components/testRuns/testRunResults/testResultDetails/TestResultDetails";
import {getSingleTestResult} from "../../../../../requests/testResults/TestResultsRequests";
import {observer} from "mobx-react-lite";
import testResultsState from "../../../../../state/testResults/TestResultsState";
import PushTestRunModal from "../../../../../components/testRuns/pushTestRunModal/PushTestRunModal";
import pushModalState from "../../../../../state/testRuns/PushModalState";
import PushTestRunPopup from "../../../../../components/testRuns/pushTestRunModal/PushTestRunPopup";
import appState from "../../../../../state/AppState";
import ImagePopup from "../../../../../components/testRuns/testRunResults/testResultDetails/ImagePopup";
import imagePopupState from "../../../../../state/testRuns/ImagePopupState";
import {TestRunStatuses} from "../../../../../components/testRuns/testRunList/TestRunConstants";

const TestRunPage = observer(() => {
  const router = useRouter()

  const [testRun, setTestRun] = useState(null)
  const loadTestResultFromUrl = (testRunId) => {
    const identifier = router.query.test

    if (identifier) {
      getSingleTestResult(testRunId, identifier).then((data) => {
        if (data?.data) {
          testResultsState.setSelectedTest(data.data)
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
  }, [router.query.testRunId])

  useEffect(() => {
    //Refreshing not finished testrun
    const interval = setInterval(() => {
      if (testRun === null || [TestRunStatuses.created, TestRunStatuses.processing].includes(testRun.status)) {
        updateTestRunInfo(router.query.testRunId)
      } else {
        clearInterval(interval)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [testRun])

  useEffect(() => {
    appState.setTitle(`QA Hub: ${testRun?.testRunId || 'Test run'}`)
  }, [testRun?.testRunId])

  if (!testRun) {
    return <div>Loading</div>
  }

  return <div style={{padding: "15px"}}>
    <PushTestRunModal/>
    {/*<TestHistoryModal isOpen={testHistoryModalOpen} onClose={closeTestHistoryModal} testcaseId={selectedTestId} />*/}

    <TestRunResultsOverview
      testRun={testRun}
      updateTestRunInfo={updateTestRunInfo}
    />

    <div style={{display: "flex", marginTop: '15px', width: '100%', minWidth: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
      <TestResultsList
        testRun={testRun}
        style={{width: "550px", minWidth: '449px', maxWidth: '70%', overflowX: 'auto', resize: 'horizontal'}}
      />
      <TestResultDetails
        style={{marginLeft: '15px', overflowX: 'auto', width: 'min-content', flexGrow:'1.1'}}
      />
    </div>

    {
      pushModalState.selectedTests?.length > 0 &&
      <PushTestRunPopup testRun={testRun} style={{position: 'absolute', bottom: '30px', right: '30px'}}/>
    }

    {
      imagePopupState.isOpen &&
      <ImagePopup style={{position: 'absolute'}}/>
    }
  </div>
})

export default TestRunPage