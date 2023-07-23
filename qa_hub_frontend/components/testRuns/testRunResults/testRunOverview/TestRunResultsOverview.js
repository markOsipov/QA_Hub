import {Paper} from "@mui/material";
import TextWithLabel from "../../../primitives/TextWithLabel";
import StatusBadge from "../../../primitives/StatusBadge";
import TestResultsPlate from "../../testRunList/testRun/elements/TestResultsPlate";
import TimingsPlate from "../../testRunList/testRun/elements/TimingsPlate";
import RunnersPlate from "../../testRunList/testRun/elements/RunnersPlate";
import GitEnvPlate from "../../testRunList/testRun/elements/GitEnvPlate";
import RunnersDetailsPlate from "./RunnersDetailsPlate";
import TestRunCard from "../../testRunList/testRun/TestRunCard";

export default function TestRunResultsOverview({testRun, ...props}) {
  if (testRun == null) {
    return <Paper style={{padding: '15px', ...props.style}}>Loading testrun</Paper>
  }
  return <Paper style={{padding: '15px 20px', minWidth: 'max-content', ...props.style}}>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TestRunCard testRun={testRun}></TestRunCard>


      <RunnersDetailsPlate testRun={testRun} style={{marginLeft: '50px', marginTop: '65px'}} />
    </div>
  </Paper>
}