import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import {getTime} from "../../../../utils/DateTimeUtils";
import TestRunTimings from "./TestRunTimings";

export default function TestRunCard({testRun, ...props }) {
  return <Paper style={{ padding: '15px', ...props.style}}>
    <div style={{display: "flex", flexDirection: "column"}}>
      <div style={{marginTop: "10px", display: "flex", alignItems: 'center'}}>
        <TextWithLabel
          value={testRun.testRunId}
          label={'testRunId'}
          style={{fontSize: "17px", width: "min-content", padding: "5px 6px", minHeight: 'unset'}}
        />
        <StatusBadge label={testRun.status} style={{ marginLeft: "10px"}}/>
      </div>

      <TestRunTimings testRun={testRun} style={{marginTop: "35px"}} />
    </div>
  </Paper>
}