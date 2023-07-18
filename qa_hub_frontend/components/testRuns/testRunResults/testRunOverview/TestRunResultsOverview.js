import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TestResultsPlate from "../../testRunList/testRun/elements/TestResultsPlate";
import TimingsPlate from "../../testRunList/testRun/elements/TimingsPlate";
import RunnersPlate from "../../testRunList/testRun/elements/RunnersPlate";
import GitEnvPlate from "../../testRunList/testRun/elements/GitEnvPlate";
import RunnersDetailsPlate from "./RunnersDetailsPlate";

export default function TestRunResultsOverview({testRun, ...props}) {
  if (testRun == null) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading testrun</Paper>
  }
  return <Paper style={{padding: '15px 20px', minWidth: 'max-content', ...props.style}}>
    <div style={{display: 'flex'}}>
      <div>
        <div style={{ marginTop: "10px", display: "flex", alignItems: 'center' }}>
          <TextWithLabel
            value={testRun.testRunId}
            label={'testRunId'}
            labelStyle={{ justifySelf: 'center'}}
            style={{fontSize: "17px", width: "min-content", padding: "5px 6px", minHeight: 'unset'}}
          />
          <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
        </div>
        <TestResultsPlate testRun={testRun} style={{marginTop: '55px'}}/>

        <div style={{display: 'flex', marginTop: '35px'}}>
          <GitEnvPlate testRun={testRun}  style={{minWidth: '300px'}}/>
          <RunnersPlate testRun={testRun} style={{minWidth: '300px', marginLeft: '35px'}} />
        </div>

        {
          testRun.timeMetrics != null &&
          <TimingsPlate
            testRun={testRun}
            style={{
              display: 'grid',
              alignItems: 'end',
              justifyItems: 'start',
              minWidth: '370px',
              position: 'relative',
              marginTop: '55px'
            }}
          />
        }
      </div>

      <RunnersDetailsPlate testRun={testRun} style={{marginLeft: '50px', marginTop: '65px'}} />
    </div>
  </Paper>
}