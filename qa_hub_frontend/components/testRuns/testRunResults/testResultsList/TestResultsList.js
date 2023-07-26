import {Card, Paper} from "@mui/material";
import TestResultCard from "./TestResultCard";
import {useEffect, useState} from "react";
import {getTestResults} from "../../../../requests/testResults/TestResultsRequests";
import LoadMoreTests from "./LoadMoreTests";
import TestResultsFilter from "./filters/TestResultsFilter";
import StyledTextField from "../../../primitives/StyledTextField";
import {getCookie, setCookie} from "../../../../utils/CookieHelper";

export default function TestResultsList(
  {
    testsCount, testRunId, testResults, setTestResults, setSelectedTest,
    filter, setFilter, filterChanged, setFilterChanged,
    ...props
  }
) {
  const loadMoreCookie = "testResultsLoadCount"
  const initialLoadSize = getCookie(loadMoreCookie) || 50
  const initialSkip = 0

  const [loadMoreSize, setLoadMoreSize] = useState(initialLoadSize)
  const [loading, setLoading] = useState(false)

  async function updateTestResults(skip, limit) {
    if (testResults[0]?.testRunId !== testRunId) {
      setLoading(true)
    }
    const resp = await getTestResults(testRunId, filter, skip, limit).then((data) =>
      setTestResults(data.data)
    )
    setLoading(false)
    return resp
  }

   const loadMoreResults = async () => {
    await getTestResults(testRunId, filter, testResults.length, loadMoreSize).then((data) => {
      setTestResults([...testResults, ...data.data])
    })
  }

  function filterAndLoad(filter) {
    const filterValue = filter || {}

    setFilter(filterValue)

    getTestResults(testRunId, filter, initialSkip, loadMoreSize).then(response => {
      if (response.data) {
        setTestResults(response.data)
      }
    })
  }

  useEffect(() => {
    updateTestResults(initialSkip, loadMoreSize)
  }, [testRunId])

  const updateLoadMoreCount = (event) => {
    setLoadMoreSize(Number.parseInt(event.target.value))
  }

  const saveCurrentLoadCount = () => {
    setCookie(loadMoreCookie, loadMoreSize)
  }

  if (loading) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading test results</Paper>
  }

  return <Paper style={{padding: '15px', ...props.style}}>
    <TestResultsFilter
      filter={filter}
      setFilter={setFilter}
      filterAndLoad={filterAndLoad}
      filterChanged={filterChanged}
      setFilterChanged={setFilterChanged}
    />
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

    { testsCount > testResults.length &&
      <LoadMoreTests
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
          />
        </div>
      </div>
    </div>
  </Paper>
}