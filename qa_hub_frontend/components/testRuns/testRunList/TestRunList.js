import {observer} from "mobx-react-lite";
import projectState from "../../../state/ProjectState";
import {useEffect, useState} from "react";
import {getTestRuns} from "../../../requests/TestRunRequests";
import TestRunCard from "./testRun/TestRunCard";
import TestRunsFilter from "./filters/TestRunsFilter";

const TestRunList = observer(({...props}) => {
  let {selectedProject} = projectState

  let [testRuns, setTestRuns] = useState([])
  let [filter, setFilter] = useState({})

  function loadTestRuns() {
    getTestRuns(selectedProject, filter).then(response => {
      if (response.data) {
        setTestRuns(response.data)
      }
    })
  }

  function filterAndLoad(filter) {
    const filterValue = filter || {}
    setFilter(filterValue)
    getTestRuns(selectedProject, filterValue).then(response => {
      if (response.data) {
        setTestRuns(response.data)
      }
    })
  }

  useEffect(() => {
    loadTestRuns()
  }, [selectedProject])


  return <div style={{...props.style}}>
    <TestRunsFilter filter={filter} setFilter={setFilter} loadTestRuns={loadTestRuns} filterAndLoad={filterAndLoad}/>
    <div style={{minWidth: 'max-content'}}>
    {
      testRuns.map((testRun) => {
        return <TestRunCard
          testRun={testRun}
          key={testRun.testRunId}
          style={{marginTop: "15px", minWidth: 'max-content'}}
          filter={filter}
          filterAndLoad={filterAndLoad}
        />
      })
    }
    </div>
  </div>
})

export default TestRunList