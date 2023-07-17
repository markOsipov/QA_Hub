import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TimingsPlate from "./elements/TimingsPlate";
import GitEnvPlate from "./elements/GitEnvPlate";
import RunnersPlate from "./elements/RunnersPlate";
import TestResultsPlate from "./elements/TestResultsPlate";
export default function TestRunCard({testRun, ...props }) {
  return <Paper style={{ padding: '15px', ...props.style}}>
    <div style={{display: "flex", flexDirection: "column"}}>
      <div style={{marginTop: "10px", display: "flex", alignItems: 'center'}}>
        <TextWithLabel
          value={testRun.testRunId}
          label={'testRunId'}
          labelStyle={{ justifySelf: 'center'}}
          style={{fontSize: "17px", width: "min-content", padding: "5px 6px", minHeight: 'unset'}}
        />
        <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
      </div>


      <TestResultsPlate testRun={testRun} style={{marginTop: '25px'}} />

      <div style={{display: 'flex',  marginTop: "40px"}}>
        <GitEnvPlate testRun={testRun} style={{marginTop: '10px'}} />

        <RunnersPlate testRun={testRun} style={{marginTop: "10px", marginLeft: '70px'}} />
      </div>



      <TimingsPlate testRun={testRun} style={{marginTop: "50px"}} />
    </div>
  </Paper>
}