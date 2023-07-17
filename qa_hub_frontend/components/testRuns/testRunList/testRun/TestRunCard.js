import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TimingsPlate from "./elements/TimingsPlate";
import GitEnvPlate from "./elements/GitEnvPlate";
import RunnersPlate from "./elements/RunnersPlate";
import TestResultsPlate from "./elements/TestResultsPlate";
export default function TestRunCard({testRun, ...props }) {
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
                        minWidth: '390px',
                        position: 'relative',
                      }}
        />

        <div style={{display: 'flex', minWidth: '1000px', position: 'relative', top: '-37px', flexGrow: '2', justifyContent: 'center'}}>
            <TestResultsPlate testRun={testRun} style={{minWidth: '700px'}} />
            <RunnersPlate testRun={testRun} style={{minWidth: '300px'}} />
        </div>

        <div style={{display: 'grid', minWidth: '620px', justifyItems: 'end',  position: 'relative', top: '-37px'}}>
          <GitEnvPlate testRun={testRun} style={{marginLeft: '70px'}}/>
        </div>
      </div>
    </div>
  </Paper>
}