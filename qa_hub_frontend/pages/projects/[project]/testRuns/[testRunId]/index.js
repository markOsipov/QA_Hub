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
import SwitchTestListButton from "../../../../../components/testRuns/testRunResults/SwitchTestListButton";
import {getCookie, QaHubCookies, setCookie} from "../../../../../utils/CookieHelper";

const TestRunPage = observer(() => {
  const router = useRouter()

  const [testRun, setTestRun] = useState(null)
  const [showTestResultsList, setShowTestResultsList] = useState((getCookie(QaHubCookies.showTestResultsList) || "true") === "true")

  const switchShowTestList = () => {
    let newValue = !showTestResultsList
    setShowTestResultsList(newValue)
    setCookie(QaHubCookies.showTestResultsList, newValue)
  }

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

  return <div style={{padding: "15px 10px 10px 15px"}}>
    <PushTestRunModal/>

    <TestRunResultsOverview
      testRun={testRun}
      updateTestRunInfo={updateTestRunInfo}
    />

    <div style={{display: "flex", paddingTop: '15px', width: '100%', minWidth: '100%', maxHeight: 'calc(100vh - 90px)', overflowY: 'auto', position: 'relative'}}>

      {
        showTestResultsList &&
        <TestResultsList
          style={{width: "550px", minWidth: '449px', maxWidth: '70%', overflowX: 'auto', marginRight: '15px', position: 'relative', resize: 'horizontal', }}
          testRun={testRun}
        />
      }

      <TestResultDetails
        style={{overflowX: 'auto', width: 'min-content', flexGrow:'1.1'}}
      />

      <SwitchTestListButton
        style={{position: 'absolute', top: '10px', left: '0px'}}
        showTestList={showTestResultsList}
        switchShowTestList={switchShowTestList}
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