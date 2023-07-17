import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {observer} from "mobx-react-lite";
import projectState from "../../../state/ProjectState";
import {useEffect, useState} from "react";
import {getTestRuns} from "../../../requests/TestRunRequests";
import StatusBadge from "../../primitives/StatusBadge";
import TextWithLabel from "../../primitives/TextWithLabel";
import {getTime} from "../../../utils/DateTimeUtils";
import TestRunCard from "./testRun/TestRunCard";

const TestRunList = observer(({...props}) => {
  let {selectedProject} = projectState

  let [testRuns, setTestRuns] = useState([])

  function loadTestRuns() {
    getTestRuns(selectedProject).then(response => {
      if (response.data) {
        setTestRuns(response.data)
      }
    })
  }

  useEffect(() => {
    loadTestRuns()
  }, [selectedProject])


  return <div style={{...props.style}}>
    <Paper style={{padding: "15px"}}>
       <Typography variant={'h5'}>TestRuns </Typography>
    </Paper>
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