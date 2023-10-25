import {Paper} from "@mui/material";
import TestResultCard from "./TestResultCard";
import {useEffect, useState} from "react";
import {getTestResults} from "../../../../requests/testResults/TestResultsRequests";
import TestResultsFilter from "./filters/TestResultsFilter";
import testResultsFilterState from "../../../../state/testResults/TestResultsFilterState";
import {observer} from "mobx-react-lite";
import testResultsState from "../../../../state/testResults/TestResultsState";

import StyledTextField from "../../../primitives/StyledTextField";
import LoadMoreTestsButton from "./LoadMoreTestsButton";
import {getCookie, QaHubCookies, setCookie} from "../../../../utils/CookieHelper";
import Typography from "@mui/material/Typography";
import {customTheme} from "../../../../styles/CustomTheme";
import {useRouter} from "next/router";
import {TestRunStatuses} from "../../testRunList/TestRunConstants";

const TestResultsList = observer(({  testRun, ...props}) => {
  const router = useRouter()

  const { filter } = testResultsFilterState
  const { testResults} = testResultsState

  const loadMoreCookie = QaHubCookies.testResultsLoadCount
  const defaultLoadSize = 50
  const initialLoadSize = Number.parseInt(getCookie(loadMoreCookie)) || defaultLoadSize
  const initialSkip = 0

  const [loadMoreSize, setLoadMoreSize] = useState(initialLoadSize)
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)

  const testsCount = testRun?.tests?.testsCount
  const testRunId = testRun.testRunId
  const runners = testRun.runners || []

  async function updateTestResults(skip, limit, filter) {
    if (testResults[0]?.testRunId !== testRunId) {
      setLoading(true)
    }
    const resp = await getTestResults(testRunId, filter, skip, limit).then((data) =>
      testResultsState.setTestResults(data.data)
    )
    setLoading(false)
    return resp
  }

  const loadMoreResults = async () => {
    await getTestResults(testRunId, filter, testResults.length, loadMoreSize).then((data) => {
      testResultsState.setTestResults([...testResults, ...data.data])
    })
  }

  function filterAndLoad(filter) {
    const filterValue = filter || {}

    testResultsFilterState.setFilter(filterValue)
    setFilterToUrl(filterValue)

    setFilterLoading(true)
    getTestResults(testRunId, filter, initialSkip, loadMoreSize).then(response => {
      setFilterLoading(false)
      if (response.data) {
        testResultsState.setTestResults(response.data)
      }
    })
  }

  useEffect(() => {
    const newFilter =  getFilterFromUrl()
    testResultsFilterState.setFilter(newFilter)

    updateTestResults(initialSkip, loadMoreSize, newFilter)

    //Updating test results if not finished
    const interval = setInterval(() => {
      if (testRun === null || [TestRunStatuses.created, TestRunStatuses.processing].includes(testRun.status)) {
        console.log('refreshing')
        filterAndLoad(filter)
      } else {
        console.log('stop refreshing')
        clearInterval(interval)
      }
    }, 30000)
    return () => clearInterval(interval)

  }, [testRunId])

  function getFilterFromUrl() {
    const statuses = router.query.statuses
    const unreviewed = router.query.unreviewed
    const retries = router.query.retries
    const deviceId = router.query.deviceId
    const runner = router.query.runner
    const message = router.query.message

    let newFilter = {}
    newFilter.statuses = statuses ? statuses.split(" ") : []
    newFilter.unreviewed = unreviewed ? unreviewed === 'true' : null
    newFilter.filterRetries = retries ? retries === 'true' : null
    newFilter.deviceId = deviceId
    newFilter.runner = runner
    newFilter.message = message

    return newFilter
  }

  function setFilterToUrl(filter) {
    if (filter.statuses != null && filter.statuses.length > 0) {
      router.query.statuses = filter.statuses.join(" ")
    } else {
      delete router.query.statuses
    }

    ['unreviewed', 'retries', 'deviceId', 'runner', 'message'].forEach(filterType => {
      if (filter[filterType] != null) {
        router.query[filterType] = filter[filterType].toString()
      } else {
        delete router.query[filterType]
      }
    })

    router.replace(router)
  }
  const updateLoadMoreCount = (event) => {
    setLoadMoreSize(Number.parseInt(event.target.value))
  }

  const saveCurrentLoadCount = () => {
    setCookie(loadMoreCookie, loadMoreSize)
  }

  if (loading) {
    return <Paper style={{
      padding: '15px',
      display: 'grid',
      placeItems: 'center',
      ...props.style
    }}>
      <Typography variant={'h5'} style={{color: customTheme.palette.text.disabled}}>Loading test results</Typography>
    </Paper>
  }

  return <Paper style={{padding: '12px 15px 15px 15px', ...props.style}}>
    <TestResultsFilter
      filterAndLoad={filterAndLoad}
      filterLoading={filterLoading}
      runners={runners}
    />
    {
      testResults.map((testResult, index) => {
        return <TestResultCard
          testResult={testResult}
          key={testResult.fullName}
          style={{padding: '15px', marginTop: index > 0 && '15px'}}
        />
      })
    }

    { testsCount > testResults.length &&
      <LoadMoreTestsButton
        loadMoreSize={loadMoreSize}
        loadMoreResults={loadMoreResults}
        style={{marginTop: '25px'}}
      />
    }
    <div style={{marginTop: '11px', paddingLeft: '4px', opacity: '0.55'}}>
      <div style={{display: 'flex'}}>
        <label >{`Test results: ${testResults.length}/${testsCount}`}</label>
        <div style={{flexGrow: '1.1'}}></div>

        <div style={{display: 'flex', alignItems: 'center'}}>
          <label style={{fontSize: '12px', marginRight: '5px'}}>Load count</label>
          <StyledTextField
            size={"tiny"}
            value={loadMoreSize}
            onChange={updateLoadMoreCount}
            onBlur={saveCurrentLoadCount}
            style={{width: 'min-content', minWidth: '50px'}}
            type={'number'}
          />
        </div>
      </div>
    </div>
  </Paper>
})

export default TestResultsList