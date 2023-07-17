import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TimingsPlate from "./elements/TimingsPlate";
import GitEnvPlate from "./elements/GitEnvPlate";
import RunnersPlate from "./elements/RunnersPlate";
import TestResultsPlate from "./elements/TestResultsPlate";
import {useEffect, useState} from "react";
export default function TestRunCard({testRun, ...props }) {
  const [progressBarWidth, setProgressBarWidth] = useState(500)

  function handleResize() {
    setProgressBarWidth(Math.max(window.innerWidth * 0.25, 100))
  }

  window.addEventListener('resize', handleResize)

  return <Paper style={{ padding: '15px', ...props.style }}>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginTop: "10px", display: "flex", alignItems: 'center' }}>
        <TextWithLabel
          value={testRun.testRunId}
          label={'testRunId'}
          labelStyle={{ justifySelf: 'center'}}
          style={{fontSize: "17px", width: "min-content", padding: "5px 6px", minHeight: 'unset'}}
        />
        <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
      </div>

      <div style={{display: 'flex', marginTop: '45px'}}>
        <TimingsPlate testRun={testRun}
                      style={{
                        display: 'grid',
                        alignItems: 'end',
                        justifyItems: 'start',
                        minWidth: '370px',
                        position: 'relative',
                      }}
        />

        <div style={{display: 'flex', minWidth: '450px', position: 'relative', top: '-37px', flexGrow: '2', justifyContent: 'center'}}>
          <TestResultsPlate testRun={testRun} progressBarWidth={progressBarWidth} style={{ minWidth: `${progressBarWidth + 180}px`}}/>
          <RunnersPlate testRun={testRun} style={{minWidth: '300px', marginLeft: '50px'}} />
        </div>

        <div style={{display: 'grid', minWidth: '570px', justifyItems: 'end',  position: 'relative', top: '-37px'}}>
          <GitEnvPlate testRun={testRun}/>
        </div>
      </div>
    </div>
  </Paper>
}