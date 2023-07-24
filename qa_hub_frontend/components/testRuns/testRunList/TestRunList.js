import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
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

  function clearAndLoad() {
    setFilter({})
    getTestRuns(selectedProject, {}).then(response => {
      if (response.data) {
        setTestRuns(response.data)
      }
    })
  }

  useEffect(() => {
    loadTestRuns()
  }, [selectedProject])


  return <div style={{...props.style}}>
    <TestRunsFilter filter={filter} setFilter={setFilter} loadTestRuns={loadTestRuns} clearAndLoad={clearAndLoad}/>
    <div style={{minWidth: 'max-content'}}>
    {
      testRuns.map((testRun) => {
        return <TestRunCard testRun={testRun} key={testRun.testRunId} style={{marginTop: "15px", minWidth: 'max-content'}} />
      })
    }
    </div>
  </div>
})

export default TestRunList