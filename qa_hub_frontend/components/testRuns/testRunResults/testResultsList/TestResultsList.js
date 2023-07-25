import {Card, Paper} from "@mui/material";
import TestResultCard from "./TestResultCard";
import {useEffect, useState} from "react";
import {getTestResults} from "../../../../requests/testResults/TestResultsRequests";
import LoadMoreTests from "./LoadMoreTests";
import TestRunsFilter from "./filters/TestResultsFilter";
import TestResultsFilter from "./filters/TestResultsFilter";
import {getTestRuns} from "../../../../requests/TestRunRequests";

export default function TestResultsList({testsCount, testRunId, testResults, setTestResults, setSelectedTest, ...props }) {
  const initialLoadSize = 50
  const initialSkip = 0

  const [loadMoreSize, setLoadMoreSize] = useState(initialLoadSize)
  const [skip, setSkip] = useState(initialSkip)
  const [filter, setFilter] = useState({})
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
    const newSkip = skip + loadMoreSize

    setSkip(newSkip)

    await getTestResults(testRunId, filter, newSkip, loadMoreSize).then((data) => {
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
    setSkip(initialSkip)
    updateTestResults(initialSkip, initialLoadSize)
  }, [testRunId])



  if (loading) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading test results</Paper>
  }

  return <Paper style={{padding: '15px', ...props.style}}>
    <TestResultsFilter
      filter={filter}
      setFilter={setFilter}
      filterAndLoad={filterAndLoad}/>
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
      <label >{`Test results: ${testResults.length}/${testsCount}`}</label>
    </div>
  </Paper>
}